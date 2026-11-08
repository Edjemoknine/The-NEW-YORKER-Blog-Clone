import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // or next/router / next/navigation depending on your setup
import Grid from "./Grid";
import { fetchMissedPosts } from "@/api/handlers/posts";
import { useInView } from "react-intersection-observer";

const InCaseMissed = () => {
  const navigate = useNavigate(); // Or router.push if using Next.js
  const { ref, inView } = useInView({
    rootMargin: "600px 0px",
    triggerOnce: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["missed-posts-preview", "before-today"],
    queryFn: () => fetchMissedPosts({ limit: 4 }),
    staleTime: 1000 * 60 * 10,
    enabled: inView,
  });

  const posts = data?.posts || [];

  return (
    <section ref={ref} className="mx-auto my-12 max-w-[90rem] px-4 py-12 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-editorial text-2xl font-semibold tracking-tight">
            In Case You Missed It
          </h2>
          <p className="text-sm text-muted-foreground">
            Catch up on stories published before today.
          </p>
        </div>

        {/* Link redirecting to the full paginated archive page */}
        <button
          onClick={() => navigate("/missed")}
          className="text-sm font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          View All &rarr;
        </button>
      </div>
      {isError ? (
        <p role="alert" className="text-sm text-destructive">
          Unable to load missed posts. Please try again later.
        </p>
      ) : !inView || isLoading ? (
        <Grid
          data={data}
          HeadingTitle="In Case You Missed It"
          HeadingSubTitle="Catch up on stories published before today."
          isLoading
          showHeading={false}
        />
      ) : posts.length ? (
        <Grid
          data={data}
          HeadingTitle="In Case You Missed It"
          HeadingSubTitle="Catch up on stories published before today."
          showHeading={false}
        />
      ) : (
        <p className="text-sm text-muted-foreground">No missed posts found.</p>
      )}
    </section>
  );
};

export default InCaseMissed;
