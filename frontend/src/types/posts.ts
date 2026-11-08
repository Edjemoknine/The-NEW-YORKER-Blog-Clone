import { z } from "zod";

export const POST_TYPES = [
  "News",
  "Books & Culture",
  "Fiction & Poetry",
  "Humor & Cartoons",
  "Magazine",
] as const;

export const postFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  desc: z.string().min(2, {
    message: "desc must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  postType: z.enum(POST_TYPES, {
    errorMap: () => ({ message: "Select a post type." }),
  }),
  categories: z.array(z.string().min(1)).min(1, {
    message: "Select at least one category.",
  }),
  image: z.string().optional(),
});

export type FormValues = z.infer<typeof postFormSchema>;

export interface PostCardPost {
  id?: string;
  _id?: string;
  title: string;
  desc: string;
  image?: string;
  postType?: string;
  categories: string[];
  username?: {
    id?: string;
    _id?: string;
    name: string;
  };
  createdAt?: string | Date;
}

export type NewsCardProps = {
  post: PostCardPost;
  onClick?: () => void;
};

export type SearchCardItem = {
  id: string;
  title?: string;
  desc?: string;
  username?: {
    name: string;
  };
  date?: string | number | Date;
  image?: string;
  categories?: string[];
};

export interface SearchCardProps {
  item: SearchCardItem;
}

export type FetchPostsParams = {
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

export type PostFormProps = {
  type?: string;
  post?: any;
  close?: () => void;
};

export type MagazinePost = {
  _id: string;
  title: string;
  desc: string;
  image: string;
  postType?: string;
  categories?: string[];
  username?: { _id?: string; name: string };
};

export type MagazineSliderProps = {
  data: MagazinePost[];
};

export type MissedPostsResponse = {
  posts: PostCardPost[];
  totalPages: number;
};

export type RecommendationsProps = {
  recommendations?: {
    data?: PostCardPost[];
  };
  isLoading?: boolean;
};
