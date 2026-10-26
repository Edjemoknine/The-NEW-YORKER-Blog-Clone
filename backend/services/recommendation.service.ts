import { and, eq, isNotNull, ne, sql } from "drizzle-orm";

import { db } from "../db/index.ts";
import { posts } from "../db/schema.ts";

const EMBEDDING_MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

export async function getRecommendedPosts(postId: string, limit = 5) {
  const [sourcePost] = await db
    .select({
      id: posts.id,
      embedding: posts.embedding,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!sourcePost) {
    throw new Error("Post not found");
  }

  if (!sourcePost.embedding) {
    return [];
  }

  // Serialize the embedding as a single pgvector value.
  const embeddingLiteral = `[${sourcePost.embedding.join(",")}]`;

  // Explicitly cast the parameter to PostgreSQL's vector type.
  const distance = sql<number>`
    ${posts.embedding} <=> ${embeddingLiteral}::vector
  `;

  const similarity = sql<number>`
    1 - (${distance})
  `;

  return db
    .select({
      id: posts.id,
      title: posts.title,
      desc: posts.desc,
      categories: posts.categories,
      similarity,
    })
    .from(posts)
    .where(
      and(
        ne(posts.id, postId),
        isNotNull(posts.embedding),
        eq(posts.embeddingModel, EMBEDDING_MODEL),
      ),
    )
    .orderBy(distance)
    .limit(Math.max(1, Math.min(limit, 20)));
}
