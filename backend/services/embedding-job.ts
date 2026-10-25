import { and, eq, lt, or, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { posts, embeddingJobs } from "../db/schema.ts";
import { generateEmbedding } from "./embedding.service.ts";

const EMBEDDING_MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

// A job left locked for this long can be reclaimed.
const STALE_LOCK_MS = 10 * 60 * 1000;

export async function processEmbeddingJob(jobId: string) {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - STALE_LOCK_MS);

  // Atomically claim a pending job, or reclaim a stale one.
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
          eq(embeddingJobs.status, "pending"),
          and(
            eq(embeddingJobs.status, "processing"),
            lt(embeddingJobs.lockedAt, staleBefore),
          ),
        ),
      ),
    )
    .returning();

  if (!job) {
    // A completed, failed, or currently locked job wasn't claimed.
    const [existing] = await db
      .select({
        status: embeddingJobs.status,
      })
      .from(embeddingJobs)
      .where(eq(embeddingJobs.id, jobId))
      .limit(1);

    if (!existing) {
      throw new Error(`Embedding job not found: ${jobId}`);
    }

    if (existing.status === "completed") {
      return { status: "completed", skipped: true };
    }

    if (existing.status === "failed") {
      return { status: "failed", skipped: true };
    }

    // Ask QStash to retry rather than acknowledging a job that
    // may still be processing in another invocation.
    throw new Error(`Embedding job is already ${existing.status}`);
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

    // Avoid saving an embedding if the post was edited while
    // inference was running. We'll handle regeneration on edits.
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

    return { status: "completed", postId: post.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown embedding error";

    await db
      .update(embeddingJobs)
      .set({
        status: job.attempts >= 5 ? "failed" : "pending",
        lockedAt: null,
        lastError: message.slice(0, 4000),
        nextAttemptAt: new Date(
          Date.now() + Math.min(60_000 * 2 ** job.attempts, 30 * 60_000),
        ),
        updatedAt: new Date(),
      })
      .where(eq(embeddingJobs.id, job.id));

    throw error;
  }
}
