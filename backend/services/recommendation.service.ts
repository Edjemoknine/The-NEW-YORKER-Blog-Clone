import { and, eq, isNotNull, ne, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { posts } from "../db/schema.ts";

const EMBEDDING_MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

export async function getRecommendedPosts(postId: string, limit = 5) {
  const [sourcePost] = await db
    .select({
      id: posts.id,
      title: posts.title,
      desc: posts.desc,
      categories: posts.categories,
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

  // Serialize the embedding as one PostgreSQL vector parameter.
  const embeddingLiteral = `[${sourcePost.embedding.join(",")}]`;

  const distance = sql<number>`
    ${posts.embedding} <=> ${embeddingLiteral}::vector
  `;

  // Cosine similarity: higher is better.
  const semanticSimilarity = sql<number>`
    greatest(0, 1 - (${distance}))
  `;

  const escapedSourceTitle = sourcePost.title.replace(/[\\%_]/g, "\\$&");

  // Match the source post's title and description against candidates.
  const keywordScore = sql<number>`
  (
    CASE
      WHEN lower(coalesce(${posts.title}, '')) LIKE
        '%' || lower(${escapedSourceTitle}) || '%'
      THEN 1
      ELSE 0
    END
  ) * 0.6
  +
  (
    CASE
      WHEN lower(coalesce(${posts.desc}, '')) LIKE
        '%' || lower(${escapedSourceTitle}) || '%'
      THEN 1
      ELSE 0
    END
  ) * 0.4
`;

  // PostgreSQL array overlap: true when at least one category matches.
  const categoryArray =
    sourcePost.categories.length > 0
      ? sql`ARRAY[${sql.join(
          sourcePost.categories.map((category) => sql`${category}`),
          sql`, `,
        )}]::text[]`
      : sql`ARRAY[]::text[]`;

  const categoryScore = sql<number>`
  CASE
    WHEN cardinality(${posts.categories}) > 0
      AND ${posts.categories} && ${categoryArray}
    THEN 1
    ELSE 0
  END
`;

  const hybridScore = sql<number>`
  ((${semanticSimilarity}) * 0.60)
  + ((${keywordScore}) * 0.25)
  + ((${categoryScore}) * 0.15)
`;

  return db
    .select({
      id: posts.id,
      title: posts.title,
      desc: posts.desc,
      categories: posts.categories,
      similarity: semanticSimilarity,
      image: posts.image,
      keywordScore,
      categoryScore,
      score: hybridScore,
    })
    .from(posts)
    .where(
      and(
        ne(posts.id, postId),
        isNotNull(posts.embedding),
        eq(posts.embeddingModel, EMBEDDING_MODEL),
      ),
    )
    .orderBy(sql`${hybridScore} DESC`)
    .limit(Math.max(1, Math.min(limit, 20)));
}
