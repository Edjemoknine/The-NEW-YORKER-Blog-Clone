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
