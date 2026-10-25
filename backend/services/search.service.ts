import { sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";

export async function searchPosts(query: string) {
  const normalized = query.trim().slice(0, 200);

  if (!normalized) return [];

  return db
    .select({
      id: posts.id,
      title: posts.title,
      desc: posts.desc,
      categories: posts.categories,
      image: posts.image,
      rank: sql<number>`
        ts_rank(
          to_tsvector(
            'simple',
            ${posts.title} || ' ' ||
            ${posts.desc} || ' ' ||
            ${posts.content}
          ),
          plainto_tsquery('simple', ${normalized})
        )
      `,
    })
    .from(posts)
    .where(
      sql`
      to_tsvector(
        'simple',
        ${posts.title} || ' ' ||
        ${posts.desc} || ' ' ||
        ${posts.content}
      ) @@ plainto_tsquery('simple', ${normalized})
    `,
    )
    .orderBy(sql`rank DESC`)
    .limit(20);
}
