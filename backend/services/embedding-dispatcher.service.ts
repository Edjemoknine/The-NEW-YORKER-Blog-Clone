import { and, asc, eq, isNull, lt, lte, or } from "drizzle-orm";

import { db } from "../db/index.ts";
import { embeddingJobs } from "../db/schema.ts";
import { qstash } from "../lib/qstash.ts";

const DISPATCH_BATCH_SIZE = 50;
const STALE_DISPATCH_MS = 45 * 60 * 1000;

export async function dispatchDueEmbeddingJobs() {
  const baseUrl = process.env.APP_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing APP_BASE_URL");
  }

  const now = new Date();
  const staleDispatchBefore = new Date(now.getTime() - STALE_DISPATCH_MS);

  const jobs = await db
    .select({
      id: embeddingJobs.id,
      dispatchedAt: embeddingJobs.dispatchedAt,
      nextAttemptAt: embeddingJobs.nextAttemptAt,
    })
    .from(embeddingJobs)
    .where(
      and(
        eq(embeddingJobs.status, "pending"),
        lte(embeddingJobs.nextAttemptAt, now),
        or(
          isNull(embeddingJobs.dispatchedAt),
          lt(embeddingJobs.dispatchedAt, embeddingJobs.nextAttemptAt),
          lt(embeddingJobs.dispatchedAt, staleDispatchBefore),
        ),
      ),
    )
    .orderBy(asc(embeddingJobs.nextAttemptAt))
    .limit(DISPATCH_BATCH_SIZE);

  let dispatched = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      await qstash.publishJSON({
        url: `${baseUrl}/api/jobs/embed-post`,
        body: { jobId: job.id },
        retries: 5,
      });

      await db
        .update(embeddingJobs)
        .set({
          dispatchedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(embeddingJobs.id, job.id),
            eq(embeddingJobs.status, "pending"),
          ),
        );

      dispatched++;
    } catch (error) {
      failed++;

      console.error(`Failed to dispatch embedding job ${job.id}:`, error);
    }
  }

  return {
    found: jobs.length,
    dispatched,
    failed,
  };
}
