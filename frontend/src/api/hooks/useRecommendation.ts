import { useQuery } from "@tanstack/react-query";
import {
  fetchForYouPosts,
  fetchRecommendedPosts,
} from "../handlers/recommendations";

export const useRecommendations = (postId: string) => {
  return useQuery({
    queryKey: ["categories", postId],
    queryFn: () => fetchRecommendedPosts(postId),
  });
};

export const useForYouPosts = (limit: number, page?: number) => {
  return useQuery({
    queryKey: ["for-you", limit, page],
    queryFn: () => fetchForYouPosts({ limit, page: page || 1 }),
    staleTime: 1000 * 60 * 5,
  });
};
