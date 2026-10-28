import api from "./client";

export const fetchRecommendedPosts = async (postId: string | number) => {
  const response = await api.get(`/api/posts/${postId}/recommendations`, {
    params: { limit: 5 },
  });

  return response.data;
};
