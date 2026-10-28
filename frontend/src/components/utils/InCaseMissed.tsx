/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // or next/router / next/navigation depending on your setup
import { EditorialPostCard } from "./PostCard";
import { fetchMissedPosts } from "@/api/posts";

const InCaseMissed = () => {
  const navigate = useNavigate(); // Or router.push if using Next.js

  const { data, isLoading } = useQuery({
    queryKey: ["missed-posts-preview"],
    queryFn: () => fetchMissedPosts({ limit: 4 }),
    staleTime: 1000 * 60 * 10,
  });

  const posts = data?.posts || [];

  if (isLoading) {
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-12 md:px-6">
        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-[20rem] bg-muted/50 animate-pulse rounded-xl "
            />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0)
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-12 md:px-6">
        <p className="text-sm text-muted-foreground">No missed posts found.</p>
      </div>
    );

  return (
    <section className="max-w-[90rem] mx-auto px-4 py-12 md:px-6 border-t border-border/40 my-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            In Case You Missed It
          </h2>
          <p className="text-sm text-muted-foreground">
            Catch up on top stories from the last three days.
          </p>
        </div>

        {/* Link redirecting to the full paginated archive page */}
        <button
          onClick={() => navigate("/missed-posts")}
          className="text-sm font-semibold hover:text-sky-500 transition-colors underline underline-offset-4"
        >
          View All &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post: any) => (
          <EditorialPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default InCaseMissed;
