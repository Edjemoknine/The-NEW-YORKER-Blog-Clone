/* eslint-disable @typescript-eslint/no-explicit-any */
import Sponsor from "@/components/utils/Sponsor";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { fetchPosts } from "@/api/handlers/posts";

import { useCallback, useEffect, useRef, useState } from "react";
import { NewsCard } from "@/components/utils/NewsCard";
import CategoryPageSkeleton from "@/components/skeletons/CategoryPageSkeleton";

const Category = () => {
  const { title } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const requestedPages = useRef(new Set<string>());

  const fetchMorePosts = useCallback(async () => {
    const requestKey = `${title}:${page}`;
    if (requestedPages.current.has(requestKey)) return;

    requestedPages.current.add(requestKey);
    setLoading(true);
    try {
      const data = await fetchPosts({
        category: title,
        pageParam: page,
        limit: 10,
      });
      setPosts((prevPosts) => {
        const existingIds = new Set(
          prevPosts.map((post) => post.id ?? post._id),
        );
        const newPosts = data.posts.filter(
          (post: any) => !existingIds.has(post.id ?? post._id),
        );
        return [...prevPosts, ...newPosts];
      });
      setHasMore(data.currentPage < data.totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (err: unknown) {
      setError(
        (err instanceof Error
          ? err.message
          : "An unknown error occurred") as any,
      );
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [title, page]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (!hasLoaded && !loading && posts.length === 0) {
      void fetchMorePosts();
    }
  }, [fetchMorePosts, hasLoaded, loading, posts.length]);

  useEffect(() => {
    if (inView && hasMore && !loading && hasLoaded) {
      fetchMorePosts();
    }
  }, [inView, hasMore, loading, hasLoaded, fetchMorePosts]);

  return (
    <div className="pt-40  max-w-[90rem] mx-auto px-4 md:px-6 py-10">
      <h1 className="md:text-6xl  font-grotesk text-center mb-6 ">{title}</h1>
      <Sponsor />
      {posts.length === 0 && !hasLoaded ? (
        <CategoryPageSkeleton />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 min-h-96 my-6 lg:grid-cols-4 gap-6 divide-x2 divide-gray-500">
          {posts.map((item) => (
            <NewsCard post={item} key={item.id ?? item._id} />
          ))}
        </div>
      )}
      {hasLoaded && posts.length === 0 && !error && (
        <div className="text-xl font-grotesk text-center w-full">
          No Posts related to this category
        </div>
      )}
      {error && <p>Error: {error}</p>}
      <div ref={ref} />
    </div>
  );
};

export default Category;
