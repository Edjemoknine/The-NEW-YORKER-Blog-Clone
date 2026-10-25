import { and, asc, eq, isNull, lt, lte, or, sql } from "drizzle-orm";

import { db } from "../db/index.ts";
import { posts, embeddingJobs } from "../db/schema.ts";
import { generateEmbedding } from "./embedding.service.ts";

const EMBEDDING_MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

const MAX_ATTEMPTS = 5;
const STALE_LOCK_MS = 10 * 60 * 1000;
const MAX_BACKOFF_MS = 30 * 60 * 1000;

export async function processEmbeddingJob(jobId: string) {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - STALE_LOCK_MS);

  // Atomically claim a due job or recover a stale processing job.
  const [job] = await db
    .update(embeddingJobs)
    .set({
      status: "processing",
      lockedAt: now,
      attempts: sql`${embeddingJobs.attempts} + 1`,
      updatedAt: now,
    })
    .where(
      and(
        eq(embeddingJobs.id, jobId),
        or(
          and(
            eq(embeddingJobs.status, "pending"),
            lte(embeddingJobs.nextAttemptAt, now),
          ),
          and(
            eq(embeddingJobs.status, "processing"),
            lt(embeddingJobs.lockedAt, staleBefore),
          ),
        ),
      ),
    )
    .returning();

  if (!job) {
    const [existing] = await db
      .select({
        status: embeddingJobs.status,
        nextAttemptAt: embeddingJobs.nextAttemptAt,
      })
      .from(embeddingJobs)
      .where(eq(embeddingJobs.id, jobId))
      .limit(1);

    if (!existing) {
      throw new Error(`Embedding job not found: ${jobId}`);
    }

    if (existing.status === "completed" || existing.status === "failed") {
      return {
        status: existing.status,
        skipped: true,
      };
    }

    if (existing.status === "pending" && existing.nextAttemptAt > now) {
      // The recovery dispatcher will send it when due.
      return {
        status: "pending",
        skipped: true,
        reason: "retry_not_due",
      };
    }

    if (existing.status === "processing") {
      return {
        status: "processing",
        skipped: true,
        reason: "already_processing",
      };
    }

    throw new Error(`Unable to claim embedding job: ${jobId}`);
  }

  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, job.postId))
      .limit(1);

    if (!post) {
      throw new Error(`Post not found: ${job.postId}`);
    }

    const embeddingText = [
      `Title: ${post.title}`,
      `Description: ${post.desc}`,
      `Categories: ${post.categories.join(", ")}`,
      `Content: ${post.content}`,
    ].join("\n\n");

    const embedding = await generateEmbedding(embeddingText);

    await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          embedding,
          embeddingModel: EMBEDDING_MODEL,
          embeddingUpdatedAt: new Date(),
        })
        .where(eq(posts.id, post.id));

      await tx
        .update(embeddingJobs)
        .set({
          status: "completed",
          lockedAt: null,
          lastError: null,
          updatedAt: new Date(),
        })
        .where(eq(embeddingJobs.id, job.id));
    });

    return {
      status: "completed",
      postId: post.id,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown embedding error";

    const exhausted = job.attempts >= MAX_ATTEMPTS;

    // First failure: 1 minute; second: 2 minutes; then 4, 8, etc.
    const backoffMs = Math.min(
      60_000 * 2 ** (job.attempts - 1),
      MAX_BACKOFF_MS,
    );

    await db
      .update(embeddingJobs)
      .set({
        status: exhausted ? "failed" : "pending",
        lockedAt: null,
        lastError: message.slice(0, 4000),
        nextAttemptAt: new Date(Date.now() + backoffMs),
        updatedAt: new Date(),
      })
      .where(eq(embeddingJobs.id, job.id));

    throw error;
  }
}
