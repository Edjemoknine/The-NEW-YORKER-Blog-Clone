/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // or next/router / next/navigation depending on your setup
import { NewsCard } from "./NewsCard";
import { fetchMissedPosts } from "@/api/handlers/posts";
import { useInView } from "react-intersection-observer";

const InCaseMissed = () => {
  const navigate = useNavigate(); // Or router.push if using Next.js
  const { ref, inView } = useInView({
    rootMargin: "600px 0px",
    triggerOnce: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["missed-posts-preview", "before-today"],
    queryFn: () => fetchMissedPosts({ limit: 4 }),
    staleTime: 1000 * 60 * 10,
    enabled: inView,
  });

  const posts = data?.posts || [];

  if (!inView || isLoading) {
    return (
      <section
        ref={ref}
        className="max-w-[90rem] mx-auto px-4 py-12 md:px-6 border-t border-border/40 my-12"
      >
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              In Case You Missed It
            </h2>
            <p className="text-sm text-muted-foreground">
              Catch up on stories published before today.
            </p>
          </div>
          <button
            onClick={() => navigate("/missed")}
            className="text-sm font-semibold underline underline-offset-4"
          >
            View All &rarr;
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] rounded-sm bg-muted/50" />
              <div className="mt-4 h-3 w-1/4 rounded bg-muted" />
              <div className="mt-3 h-5 w-full rounded bg-muted" />
              <div className="mt-2 h-5 w-4/5 rounded bg-muted" />
              <div className="mt-3 h-4 w-full rounded bg-muted/70" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted/70" />
              <div className="mt-5 h-8 border-t border-border/20" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0)
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-12 md:px-6">
        <p className="text-sm text-muted-foreground">No missed posts found.</p>
      </div>
    );

  return (
    <section
      ref={ref}
      className="max-w-[90rem] mx-auto px-4 py-12 md:px-6 border-t border-border/40 my-12"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            In Case You Missed It
          </h2>
          <p className="text-sm text-muted-foreground">
            Catch up on stories published before today.
          </p>
        </div>

        {/* Link redirecting to the full paginated archive page */}
        <button
          onClick={() => navigate("/missed")}
          className="text-sm font-semibold hover:text-sky-500 transition-colors underline underline-offset-4"
        >
          View All &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post: any) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default InCaseMissed;
