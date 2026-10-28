import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  createPost,
  CreatePostProps,
  deletePost,
  savePost,
  updatePost,
} from "../posts";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostProps) => {
      return await createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      toast({
        title: "Post has been created successfully!",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      postId,
    }: CreatePostProps & { postId: string }) => {
      return await updatePost(data, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      toast({
        title: "Post has been updated successfully!",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return await deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      toast({
        title: "Post has been deleted successfully!",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, postId }) => {
      console.log({ postId });

      return await savePost(userId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savePost"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      toast({
        title: "Post has been saved successfully!",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
