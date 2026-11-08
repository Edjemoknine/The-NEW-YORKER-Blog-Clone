import api from "./client";
import type { FetchForYouParams, UserEvent } from "@/types/recommendations";

export const trackEvent = async (event: UserEvent) => {
  try {
    await api.post("/api/events", event);
    return true;
  } catch (error) {
    console.error("Failed to track user event:", error);
    return false;
  }
};

export const fetchForYouPosts = async (params: FetchForYouParams) => {
  const response = await api.get(`/api/events`, {
    params,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = response.data.data.map((item: any) => item.post);
  return { ...response.data, posts: result };
};

export const fetchRecommendedPosts = async (postId: string | number) => {
  const response = await api.get(`/api/posts/${postId}/recommendations`, {
    params: { limit: 4 },
  });

  return response.data;
};
