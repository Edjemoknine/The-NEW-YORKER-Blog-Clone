import { useEffect, useState } from "react";

type RecommendedPost = {
  id: string;
  title: string;
  desc: string;
  categories: string[];
  image: string;
};

export function useRecommendations(postId?: string) {
  const [posts, setPosts] = useState<RecommendedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (postId) params.set("postId", postId);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}` + `/api/recommendations?${params}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Recommendation request failed");
        }

        const data = await response.json();
        setPosts(data.posts ?? []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setPosts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [postId]);

  return { posts, loading };
}
