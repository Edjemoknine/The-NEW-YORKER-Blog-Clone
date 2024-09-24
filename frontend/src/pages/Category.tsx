/* eslint-disable @typescript-eslint/no-explicit-any */
import Sponsor from "@/components/utils/Sponsor";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { fetchPosts } from "@/api/FetchPots";

import { useCallback, useEffect, useState } from "react";
import Card from "@/components/utils/Card";

const Category = () => {
  const { title } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMorePosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({
        category: title,
        pageParam: page,
        limit: 10, // Add a default limit or adjust as needed
      });
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setHasMore(data.currentPage < data.totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'An unknown error occurred') as any);
    } finally {
      setLoading(false);
    }
  }, [title, page]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      console.log("fire");
      fetchMorePosts();
    }
  }, [inView, hasMore, loading, fetchMorePosts]);

  // useEffect(() => {
  //   fetchMorePosts();
  // }, []);
  console.log(posts);
  return (
    <div className="pt-40  max-w-[90rem] mx-auto px-4 md:px-6 py-10">
      <h1 className="md:text-6xl  font-grotesk text-center mb-6 ">{title}</h1>
      <Sponsor />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 min-h-96 my-6 lg:grid-cols-4 gap-6 divide-x2 divide-gray-500">
        {posts?.map((item, index: number) => (
          <Card item={item} key={index} />
        ))}
      </div>
      {posts?.length == 0 && (
        <div className="text-xl font-grotesk text-center w-full">
          No Posts related to this category
        </div>
      )}
      {loading && <p>Loading more posts...</p>}
      {error && <p>Error: {error}</p>}
      <div ref={ref} />
    </div>
  );
};

export default Category;
