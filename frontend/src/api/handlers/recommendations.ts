import api from "./client";

type UserEvent =
  | {
      eventType: "post_view";
      postId: string;
      metadata?: Record<string, unknown>;
    }
  | {
      eventType: "search";
      searchQuery: string;
      postId: string;
    };

export const trackEvent = async (event: UserEvent) => {
  try {
    await api.post("/api/events", event);
  } catch (error) {
    console.error("Failed to track user event:", error);
  }
};

export const fetchForYouPosts = async (params: {
  limit: number;
  page: number;
}) => {
  const response = await api.get(`/api/events`, {
    params: { ...params, limit: 4, page: 1 },
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
