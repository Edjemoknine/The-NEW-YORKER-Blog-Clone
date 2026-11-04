import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

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
    staleTime: 1000 * 60 * 30,
  });
};
import { fetchPosts } from "@/api/handlers/posts";
import { addCategory, fetchCategories } from "../handlers/categories";

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
// hooks/useCategoriesList.ts

export const useCategoriesList = () => {
  return useCategories();
};
