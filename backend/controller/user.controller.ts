import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../db/index.ts";
import { users, posts, savedPosts } from "../db/schema.ts";

// GET /api/users/:id
export const getUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [userPosts, savedPostRows] = await Promise.all([
      db.select().from(posts).where(eq(posts.userId, id)),

      db
        .select({ post: posts })
        .from(savedPosts)
        .innerJoin(posts, eq(savedPosts.postId, posts.id))
        .where(eq(savedPosts.userId, id)),
    ]);

    const { password: _password, ...safeUser } = user;

    return res.status(200).json({
      ...safeUser,
      posts: userPosts,
      savedPost: savedPostRows.map(({ post }) => post),
    });
  } catch (error) {
    if (isInvalidUuidError(error)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    console.error("Unable to fetch user:", error);
    return res.status(500).json({ message: "Unable to fetch user" });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { postId, name, email, password, bio, avatar } = req.body ?? {};

  const values = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Invalid name" });
    }
    values.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Invalid email" });
    }
    values.email = email.trim();
  }

  if (bio !== undefined) {
    if (typeof bio !== "string") {
      return res.status(400).json({ message: "Invalid bio" });
    }
    values.bio = bio;
  }

  if (avatar !== undefined) {
    if (typeof avatar !== "string") {
      return res.status(400).json({ message: "Invalid avatar" });
    }
    values.avatar = avatar;
  }

  if (password !== undefined) {
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    values.password = await bcrypt.hash(password, 10);
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [existingUser] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!existingUser) return null;

      if (Object.keys(values).length > 0) {
        await tx
          .update(users)
          .set({
            ...values,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));
      }

      if (postId !== undefined) {
        if (typeof postId !== "string" || !postId) {
          throw new Error("INVALID_POST_ID");
        }

        const [existingPost] = await tx
          .select({ id: posts.id })
          .from(posts)
          .where(eq(posts.id, postId))
          .limit(1);

        if (!existingPost) {
          throw new Error("POST_NOT_FOUND");
        }

        const condition = and(
          eq(savedPosts.userId, id),
          eq(savedPosts.postId, postId),
        );

        const [saved] = await tx
          .select({ postId: savedPosts.postId })
          .from(savedPosts)
          .where(condition)
          .limit(1);

        if (saved) {
          await tx.delete(savedPosts).where(condition);
        } else {
          await tx.insert(savedPosts).values({
            userId: id,
            postId,
          });
        }
      }

      const [updatedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return updatedUser;
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _password, ...safeUser } = result;

    const [userPosts, savedPostRows] = await Promise.all([
      db.select().from(posts).where(eq(posts.userId, id)),

      db
        .select({ post: posts })
        .from(savedPosts)
        .innerJoin(posts, eq(savedPosts.postId, posts.id))
        .where(eq(savedPosts.userId, id)),
    ]);

    return res.status(200).json({
      ...safeUser,
      posts: userPosts,
      savedPost: savedPostRows.map(({ post }) => post),
    });
  } catch (error) {
    if (isInvalidUuidError(error)) {
      return res.status(400).json({ message: "Invalid user or post id" });
    }

    if (error instanceof Error && error.message === "INVALID_POST_ID") {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (error instanceof Error && error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Post not found" });
    }

    if (hasErrorCode(error, "23505")) {
      return res.status(409).json({
        message: "Name or email already exists",
      });
    }

    console.error("Unable to update user:", error);
    return res.status(500).json({ message: "Unable to update user" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authored posts and saved-post relationships are removed
    // by the foreign-key cascade rules in your schema.
    return res.status(200).json({
      message: "User has been deleted",
    });
  } catch (error) {
    if (isInvalidUuidError(error)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    console.error("Unable to delete user:", error);
    return res.status(500).json({ message: "Unable to delete user" });
  }
};

function hasErrorCode(error, code) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function isInvalidUuidError(error, code) {
  return hasErrorCode(error, "22P02");
}
