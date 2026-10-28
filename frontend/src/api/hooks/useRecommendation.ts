import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedPosts } from "../recommendations";

export const useRecommendations = (postId: string) => {
  return useQuery({
    queryKey: ["categories", postId],
    queryFn: () => fetchRecommendedPosts(postId),
  });
};
