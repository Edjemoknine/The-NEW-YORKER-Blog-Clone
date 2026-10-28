import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { addCategory } from "../categories";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/api/categories"; // adjust path as needed

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
      console.error(error);
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
import { fetchPosts } from "@/api/posts";
import api from "../client";

export const useCategoryPosts = (category: string, limit = 4) => {
  return useQuery({
    queryKey: ["posts", "category", category, limit],
    queryFn: () => fetchPosts({ category, limit }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to avoid redundant refetches
  });
};
// hooks/useCategoriesList.ts

export const useCategoriesList = () => {
  return useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const { data } = await api.get("/api/categories");
      return data; // expected to be an array of strings or category objects
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
};
