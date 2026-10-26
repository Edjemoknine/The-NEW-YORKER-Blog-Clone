import { and, eq, lt, lte, or, sql } from "drizzle-orm";

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
      return { status: existing.status, skipped: true };
    }

    if (existing.status === "pending" && existing.nextAttemptAt > now) {
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

    // Do not process a job for an outdated post version.
    if (post.embeddingVersion !== job.requestedVersion) {
      throw new Error("POST_VERSION_MISMATCH");
    }

    const embeddingText = [
      `Title: ${post.title}`,
      `Description: ${post.desc}`,
      `Categories: ${post.categories.join(", ")}`,
      `Content: ${post.content}`,
    ].join("\n\n");

    const embedding = await generateEmbedding(embeddingText);

    await db.transaction(async (tx) => {
      // Save only if the post has not changed during inference.
      const [updatedPost] = await tx
        .update(posts)
        .set({
          embedding,
          embeddingModel: EMBEDDING_MODEL,
          embeddingUpdatedAt: new Date(),
        })
        .where(
          and(
            eq(posts.id, post.id),
            eq(posts.embeddingVersion, job.requestedVersion),
          ),
        )
        .returning({ id: posts.id });

      if (!updatedPost) {
        throw new Error("POST_VERSION_MISMATCH");
      }

      // Complete only the exact job claim this worker owns.
      const [completedJob] = await tx
        .update(embeddingJobs)
        .set({
          status: "completed",
          lockedAt: null,
          lastError: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(embeddingJobs.id, job.id),
            eq(embeddingJobs.status, "processing"),
            eq(embeddingJobs.requestedVersion, job.requestedVersion),
            eq(embeddingJobs.lockedAt, job.lockedAt!),
          ),
        )
        .returning({ id: embeddingJobs.id });

      if (!completedJob) {
        throw new Error("JOB_CLAIM_LOST");
      }
    });

    return {
      status: "completed",
      postId: post.id,
      version: job.requestedVersion,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown embedding error";

    // Update retry state only if this worker still owns the claim.
    const exhausted = job.attempts >= MAX_ATTEMPTS;

    const backoffMs = Math.min(
      60_000 * 2 ** (job.attempts - 1),
      MAX_BACKOFF_MS,
    );

    const [releasedJob] = await db
      .update(embeddingJobs)
      .set({
        status: exhausted ? "failed" : "pending",
        lockedAt: null,
        lastError: message.slice(0, 4000),
        nextAttemptAt: new Date(Date.now() + backoffMs),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(embeddingJobs.id, job.id),
          eq(embeddingJobs.status, "processing"),
          eq(embeddingJobs.requestedVersion, job.requestedVersion),
          eq(embeddingJobs.lockedAt, job.lockedAt!),
        ),
      )
      .returning({ id: embeddingJobs.id });

    // Another update or worker has superseded this claim.
    if (!releasedJob) {
      return {
        status: "superseded",
        skipped: true,
      };
    }

    console.error("Embedding job failed:", {
      jobId: job.id,
      version: job.requestedVersion,
      attempt: job.attempts,
      error: message,
    });

    // Allow QStash to retry the failed delivery.
    throw error;
  }
}
