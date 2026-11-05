import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { fetchPosts } from "@/api/handlers/posts";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
} from "../handlers/categories";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return await addCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category has been created successfully!",
      });
    },
    onError: (error) => {
      const message = (error as AxiosError<{ message?: string }>).response?.data
        ?.message;
      toast({
        title: "Could not create category",
        description: message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
  });
}

export const useCategoryPosts = (
  category: string,
  limit = 4,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["posts", "category", category, limit],
    queryFn: () => fetchPosts({ category, limit }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to avoid redundant refetches
    enabled,
  });
};

export const useCategoriesList = () => {
  return useCategories();
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Category has been deleted successfully!",
      });
    },
    onError: (error) => {
      const message = (error as AxiosError<{ message?: string }>).response?.data
        ?.message;
      toast({
        title: "Could not delete category",
        description: message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });
};
