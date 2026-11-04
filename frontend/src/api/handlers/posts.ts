import { FormValues } from "@/components/forms/PostForm";
import api from "./client";

type Props = {
  category?: string;
  postType?: string;
  limit: number;
  search?: string;
  pageParam?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};
export type PostProps = {
  title: string;
  description: string;
  content: string;
  postType: FormValues["postType"];
  categories: string[];
  ImG: string;
  userId: string;
};
export type CreatePostProps = FormValues & { userId: string };
export const fetchPosts = async ({
  category = "",
  postType,
  limit = 8,
  search = "",
  pageParam = 1,
  sortBy,
  order,
}: Props) => {
  const params = new URLSearchParams({
    category,
    limit: String(limit),
    search,
    page: String(pageParam),
  });
  if (postType) params.set("postType", postType);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const { data } = await api.get(`/api/posts?${params.toString()}`);
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
  await api.put(`/api/users/${userId}`, { postId });
};

export const fetchMissedPosts = async ({ page = 1, limit = 4 }) => {
  const { data } = await api.get(
    `/api/posts/missed?page=${page}&limit=${limit}`,
  );
  return data;
};
