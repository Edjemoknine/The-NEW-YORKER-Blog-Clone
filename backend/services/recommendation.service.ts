import { and, cosineDistance, desc, eq, isNotNull, ne, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { posts } from "../db/schema.js";

export async function findSimilarPosts(
  embedding: number[],
  currentPostId?: string,
  limit = 6,
) {
  if (embedding.length !== 384) {
    throw new Error("Unexpected embedding dimensions");
  }

  const distance = cosineDistance(posts.embedding, embedding);

  const conditions = [isNotNull(posts.embedding)];

  if (currentPostId) {
    conditions.push(ne(posts.id, currentPostId));
  }

  return db
    .select({
      id: posts.id,
      title: posts.title,
      desc: posts.desc,
      categories: posts.categories,
      image: posts.image,
      similarity: sql<number>`1 - (${distance})`,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(distance)
    .limit(Math.min(Math.max(limit, 1), 20));
}
