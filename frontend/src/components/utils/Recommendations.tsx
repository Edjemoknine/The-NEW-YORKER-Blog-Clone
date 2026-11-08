/* eslint-disable @typescript-eslint/no-explicit-any */

import { NewsCard } from "./NewsCard";
import RecommendationsSkeleton from "@/components/skeletons/RecommendationsSkeleton";
import type { RecommendationsProps } from "@/types/posts";

const Recommendations = ({
  recommendations,
  isLoading,
}: RecommendationsProps) => {
  const posts = recommendations?.data || [];

  if (isLoading) {
    return <RecommendationsSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-16 text-center text-muted-foreground">
        <p className="text-sm">No recommendations available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="max-w-[90rem] mx-auto px-4 pb-16 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Recommended For You
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post: any) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
