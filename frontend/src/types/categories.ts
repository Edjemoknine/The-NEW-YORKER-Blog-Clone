import type { PostCardPost } from "./posts";

export interface Category {
  id: string;
  name: string;
}

export type SelectCategoryProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export type DeleteCategoryModelProps = {
  category: Category | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export type CategoryPost = PostCardPost;
