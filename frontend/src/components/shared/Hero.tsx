import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/handlers/posts";
import Slider from "@/components/shared/Swiper";

const Hero = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", "magazine-slider"],
    queryFn: () =>
      fetchPosts({
        postType: "Magazine",
        limit: 5,
        sortBy: "createdAt",
        order: "desc",
      }),
    staleTime: 1000 * 60 * 5,
  });

  const posts = data?.posts ?? [];

  return (
    <div className="relative h-[100svh] min-h-[36rem] w-full bg-[#211b1b]">
      {isLoading ? (
        <div className="absolute inset-0 grid place-items-center text-white">
          Loading magazine stories...
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="absolute inset-0 grid place-items-center px-6 text-center text-white"
        >
          Unable to load magazine stories.
        </div>
      ) : posts.length ? (
        <Slider data={posts} />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-white">
          No magazine stories available.
        </div>
      )}
    </div>
  );
};

export default Hero;
