import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { fetchPosts } from "@/api/handlers/posts";
import { getOptimizedImageUrl } from "@/lib/optimizedImageUrl";
import MagazineSkeleton from "@/components/skeletons/MagazineSkeleton";

const getDayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const MagazineView = ({ index }: { index: number }) => {
  const [dayKey, setDayKey] = useState(() => getDayKey(new Date()));
  const { ref, inView } = useInView({
    rootMargin: "600px 0px",
    triggerOnce: true,
  });

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const timer = window.setTimeout(
      () => setDayKey(getDayKey(new Date())),
      nextMidnight.getTime() - now.getTime(),
    );

    return () => window.clearTimeout(timer);
  }, [dayKey]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", "magazine-view", dayKey],
    queryFn: () =>
      fetchPosts({
        postType: "Magazine",
        limit: 4,
        sortBy: "random",
      }),
    staleTime: Infinity,
    enabled: inView,
  });
  const post = data?.posts?.[index];
  if (!inView || isLoading) {
    return <MagazineSkeleton ref={ref} />;
  }

  if (!post) {
    return (
      <section
        ref={ref}
        className="max-w-[90rem] h-[90vh] min-h-[36rem] my-16 mx-auto grid place-items-center bg-black text-white"
      >
        {isError
          ? "Unable to load magazine story."
          : "No magazine story available."}
      </section>
    );
  }

  return (
    <div
      ref={ref}
      className="max-w-[90rem] h-[90vh] min-h-[36rem] my-16 mx-auto grid grid-rows-2 bg-black text-white no-underline md:grid-rows-1 md:grid-cols-2"
    >
      <div className="flex flex-col gap-6 max-w-md mx-auto py-10 justify-center text-white text-center">
        <p className="font-grotesk">{post.postType}</p>
        <Link to={`/blog/${post.id ?? post._id}`}>
          <h3 className="text-4xl font-medium font-grotesk">{post.title}</h3>
        </Link>
        <p className="line-clamp-5">{post.desc}</p>
        <Link to={`/profile/${post.username._id}`}>
          <span className="font-medium">
            By {post.username?.name ?? "Staff Writer"}
          </span>
        </Link>
      </div>
      <div className="overflow-hidden h-full w-full">
        <img
          src={getOptimizedImageUrl(post.image || "/placeholder.svg", 1200)}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default MagazineView;
