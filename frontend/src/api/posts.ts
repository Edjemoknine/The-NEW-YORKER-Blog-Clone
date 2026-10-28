import { FormValues } from "@/components/shared/PostForm";
import api from "./client";

/* eslint-disable @typescript-eslint/no-unused-vars */
type Props = {
  category?: string;
  limit: number;
  search?: string;
  pageParam?: number;
  sort?: string; // "desc" or "asc"
};
export type PostProps = {
  title: string;
  description: string;
  content: string;
  categories: string[];
  ImG: string;
  userId: string;
};
export type CreatePostProps = FormValues & { userId: string };
export const fetchPosts = async ({
  category = "",
  limit = 8,
  search = "",
  pageParam = 1,
  // sort,
}: Props) => {
  console.log(search);
  console.log(pageParam);
  console.log(category);
  const { data } = await api.get(
    `/api/posts?category=${category}&limit=${limit}&search=${search}&page=${pageParam}`,
  );
  return data;
};

export const fetchPost = async (id: string) => {
  const { data } = await api.get(`/api/posts/${id}`);
  return data;
};
export const createPost = async (data: CreatePostProps) => {
  const response = await api.post("/api/posts", data);
  return response;
};

export const updatePost = async (data: CreatePostProps, postId: string) => {
  const response = await api.put(`/api/posts/${postId}`, data);
  return response;
};

export const deletePost = async (id: string) => {
  try {
    await api.delete(`/api/posts/${id}`);
  } catch (error) {
    console.log(error);
  }
};
export const savePost = async (userId: string, postId: string) => {
  console.log({ userId, postId });

  try {
    await api.put(`/api/users/${userId}`, {
      postId: postId!,
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchMissedPosts = async ({ page = 1, limit = 4 }) => {
  const { data } = await api.get(
    `/api/posts/missed?page=${page}&limit=${limit}`,
  );
  return data;
};
