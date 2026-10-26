import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
} from "drizzle-orm";
import { db } from "../db/index.ts";
import { posts, users, embeddingJobs } from "../db/schema.ts";
import { postWithAuthor } from "../db/serialize.ts";
import { qstash } from "../lib/qstash.ts";

const getJoinedPost = async (id: string) => {
  const [row] = await db
    .select({ post: posts, author: users })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .limit(1);
  return row ? postWithAuthor(row.post, row.author) : null;
};

const EMBEDDING_MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

export const createPost = async (req: any, res: any) => {
  const { title, desc, content, categories, image } = req.body;
  const userId = req.user?.id;

  if (!title || !desc || !content || !userId) {
    return res.status(400).json({
      message: "Title, description, content, and author are required",
    });
  }

  if (
    !Array.isArray(categories) ||
    categories.length === 0 ||
    !categories.every(
      (category: unknown) =>
        typeof category === "string" && category.trim().length > 0,
    )
  ) {
    return res.status(400).json({
      message: "categories must be a non-empty array of strings",
    });
  }

  const normalizedCategories = [
    ...new Set(categories.map((category: string) => category.trim())),
  ];

  try {
    const { post, job } = await db.transaction(async (tx) => {
      const [createdPost] = await tx
        .insert(posts)
        .values({
          title,
          desc,
          content,
          userId,
          image: image || "",
          categories: normalizedCategories,
          embedding: null,
          embeddingModel: EMBEDDING_MODEL,
          embeddingUpdatedAt: null,
        })
        .returning();

      const [createdJob] = await tx
        .insert(embeddingJobs)
        .values({
          postId: createdPost.id,
        })
        .returning();

      return {
        post: createdPost,
        job: createdJob,
      };
    });

    try {
      const baseUrl = process.env.APP_BASE_URL;

      if (!baseUrl) {
        throw new Error("Missing APP_BASE_URL");
      }

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
        .where(eq(embeddingJobs.id, job.id));
    } catch (dispatchError) {
      console.error("Embedding job dispatch failed:", dispatchError);
    }

    const responsePost = await getJoinedPost(post.id);

    return res.status(201).json({
      ...responsePost,
      embeddingStatus: "pending",
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A post with this title already exists",
      });
    }

    if (error.code === "22P02" || error.code === "23503") {
      return res.status(400).json({
        message: "Invalid post or author data",
      });
    }

    console.error("Unable to create post:", error);

    return res.status(500).json({
      message: "Unable to create post",
    });
  }
};

export const getPosts = async (req: any, res: any) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 8),
  );
  const filters = [];
  if (req.query.category) {
    filters.push(arrayContains(posts.categories, [String(req.query.category)]));
  }
  if (req.query.search) {
    const searchTerm = `%${String(req.query.search).replace(/[\\%_]/g, "\\$&")}%`;
    filters.push(
      or(
        ilike(posts.title, searchTerm),
        ilike(posts.desc, searchTerm),
        ilike(posts.content, searchTerm),
      ),
    );
  }

  const sortColumns: any = {
    title: posts.title,
    date: posts.date,
    createdAt: posts.createdAt,
  };
  const sortColumn = sortColumns[req.query.sortBy] || posts.title;
  const sortDirection = req.query.order === "desc" ? desc : asc;
  const where = filters.length ? and(...filters) : undefined;

  try {
    const [result, [countResult]] = await Promise.all([
      db
        .select({ post: posts, author: users })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .where(where)
        .orderBy(sortDirection(sortColumn))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(posts).where(where),
    ]);

    return res.json({
      posts: result.map(({ post, author }) => postWithAuthor(post, author)),
      totalPages: Math.ceil(Number(countResult.total) / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Unable to fetch posts:", error);
    return res.status(500).json({ message: "Unable to fetch posts" });
  }
};

export const getPost = async (req: any, res: any) => {
  try {
    const post = await getJoinedPost(req.params.id);
    return post
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Post not found" });
  } catch (error: any) {
    if (error.code === "22P02") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    console.error("Unable to fetch post:", error);
    return res.status(500).json({ message: "Unable to fetch post" });
  }
};

export const deletePost = async (req: any, res: any) => {
  try {
    const deleted = await db
      .delete(posts)
      .where(eq(posts.id, req.params.id))
      .returning({ id: posts.id });
    if (!deleted.length) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    if (error.code === "22P02") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    console.error("Unable to delete post:", error);
    return res.status(500).json({ message: "Unable to delete post" });
  }
};

export const updatePost = async (req: any, res: any) => {
  const {
    title,
    desc,
    content,
    categories: submittedCategories,
    image,
  } = req.body;

  const postId = req.params.id;
  const embeddingModel = EMBEDDING_MODEL;

  if (submittedCategories !== undefined) {
    if (
      !Array.isArray(submittedCategories) ||
      submittedCategories.length === 0 ||
      !submittedCategories.every(
        (category: unknown) =>
          typeof category === "string" && category.trim().length > 0,
      )
    ) {
      return res.status(400).json({
        message: "categories must be a non-empty array of strings",
      });
    }
  }

  const normalizedCategories: string[] | undefined =
    submittedCategories === undefined
      ? undefined
      : [
          ...new Set(
            submittedCategories.map((category: string) => category.trim()),
          ),
        ];

  try {
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!existing) return null;

      const values: Record<string, any> = {
        updatedAt: new Date(),
      };

      const nextVersion = existing.embeddingVersion + 1;

      if (title !== undefined) values.title = title;
      if (desc !== undefined) values.desc = desc;
      if (content !== undefined) values.content = content;
      if (image !== undefined) values.image = image;

      if (normalizedCategories !== undefined) {
        values.categories = normalizedCategories;
      }

      const categoriesChanged =
        normalizedCategories !== undefined &&
        (normalizedCategories.length !== existing.categories.length ||
          normalizedCategories.some(
            (category, index) => category !== existing.categories[index],
          ));

      const embeddingChanged =
        (title !== undefined && title !== existing.title) ||
        (desc !== undefined && desc !== existing.desc) ||
        (content !== undefined && content !== existing.content) ||
        categoriesChanged;

      if (embeddingChanged) {
        values.embeddingVersion = nextVersion;
        values.embedding = null;
        values.embeddingUpdatedAt = null;
        values.embeddingModel = embeddingModel;
      }

      const [updated] = await tx
        .update(posts)
        .set(values)
        .where(eq(posts.id, postId))
        .returning();

      let jobId: string | null = null;

      if (embeddingChanged) {
        const [existingJob] = await tx
          .select()
          .from(embeddingJobs)
          .where(eq(embeddingJobs.postId, postId))
          .limit(1);

        if (existingJob) {
          const [updatedJob] = await tx
            .update(embeddingJobs)
            .set({
              status: "pending",
              attempts: 0,
              nextAttemptAt: new Date(),
              lockedAt: null,
              dispatchedAt: null,
              lastError: null,
              updatedAt: new Date(),
              requestedVersion: nextVersion,
            })
            .where(eq(embeddingJobs.id, existingJob.id))
            .returning();

          jobId = updatedJob.id;
        } else {
          const [createdJob] = await tx
            .insert(embeddingJobs)
            .values({
              postId,
              requestedVersion: nextVersion,
            })
            .returning();

          jobId = createdJob.id;
        }
      }

      return { post: updated, jobId };
    });

    if (!result) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (result.jobId) {
      try {
        const baseUrl = process.env.APP_BASE_URL;

        if (!baseUrl) {
          throw new Error("Missing APP_BASE_URL");
        }

        await qstash.publishJSON({
          url: `${baseUrl}/api/jobs/embed-post`,
          body: { jobId: result.jobId },
          retries: 5,
        });

        await db
          .update(embeddingJobs)
          .set({
            dispatchedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(embeddingJobs.id, result.jobId));
      } catch (error) {
        console.error("Updated post embedding dispatch failed:", error);
      }
    }

    return res.status(200).json({
      ...(await getJoinedPost(result.post.id)),
      embeddingStatus: result.jobId ? "pending" : "unchanged",
    });
  } catch (error: any) {
    if (error.code === "22P02" || error.code === "23503") {
      return res.status(400).json({
        message: "Invalid post or author data",
      });
    }

    console.error("Unable to update post:", error);

    return res.status(500).json({
      message: "Unable to update post",
    });
  }
};
