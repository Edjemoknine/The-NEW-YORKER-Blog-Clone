/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMissedPosts } from "@/api/posts";
import { EditorialPostCard } from "@/components/utils/PostCard";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const MissedPostsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["missed-posts-paginated", page],
    queryFn: () => fetchMissedPosts({ page, limit }),
    keepPreviousData: true,
  } as any);

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <main className="max-w-[90rem] mx-auto px-4 py-12 md:px-6 min-h-screen">
      <div className="mb-8 border-b pb-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
          All Stories – Last 3 Days
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse everything you might have missed over the past 72 hours.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-muted/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p>No stories found from the last three days.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post: any) => (
              <EditorialPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border/20">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || isFetching}
                className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Previous
              </button>

              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages || isFetching}
                className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default MissedPostsPage;
