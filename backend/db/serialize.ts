import type { InferSelectModel } from "drizzle-orm";
import { users, posts, categories } from "./schema.ts";

type User = InferSelectModel<typeof users>;
type Post = InferSelectModel<typeof posts>;
type Category = InferSelectModel<typeof categories>;
export const publicUser = (user: User) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const postWithAuthor = (post: Post, author: User | null) => ({
  _id: post.id,
  title: post.title,
  desc: post.desc,
  content: post.content,
  date: post.date,
  username: author ? publicUser(author) : post.userId,
  image: post.image,
  postType: post.postType,
  categories: post.categories,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const publicCategory = (category: Category) => ({
  _id: category.id,
  name: category.name,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});
