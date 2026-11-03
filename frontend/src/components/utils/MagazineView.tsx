import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/handlers/posts";

const getDayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const MagazineView = ({ index }: { index: number }) => {
  const [dayKey, setDayKey] = useState(() => getDayKey(new Date()));

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

  const { data, isLoading } = useQuery({
    queryKey: ["posts", "magazine-view", dayKey],
    queryFn: () =>
      fetchPosts({
        postType: "Magazine",
        limit: 4,
        sortBy: "random",
      }),
    staleTime: Infinity,
  });
  const post = data?.posts?.[index];

  if (isLoading) {
    return (
      <div className="max-w-[90rem] h-[90vh] bg-muted my-16 mx-auto animate-pulse" />
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-[90rem] h-[90vh] bg-black my-16 mx-auto grid md:grid-cols-2">
      <div className="flex flex-col gap-6 max-w-md mx-auto py-10 justify-center text-white text-center">
        <p className="font-grotesk">{post.postType}</p>
        <h3 className="text-4xl font-medium font-grotesk">{post.title}</h3>
        <p className="line-clamp-5">{post.desc}</p>
        <span className="font-medium">
          By {post.username?.name ?? "Staff Writer"}
        </span>
      </div>
      <div className="overflow-hidden h-full w-full">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default MagazineView;
