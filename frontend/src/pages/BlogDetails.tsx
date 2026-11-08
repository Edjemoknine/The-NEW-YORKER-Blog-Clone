import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPost, fetchPosts } from "@/api/handlers/posts";
import { Bookmark, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { AlertDialogDemo } from "@/components/shared/AlertDialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { userData } from "@/api/handlers/auth";
import { useSavePost } from "@/api/hooks/usePosts";
import { useRecommendations } from "@/api/hooks/useRecommendation";
import Recommendations from "@/components/utils/Recommendations";
import BlogDetailsSkeleton from "@/components/skeletons/BlogDetailsSkeleton";
import { trackEvent } from "@/api/handlers/recommendations";

const BlogDetails = () => {
  const { id: postId } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((store: any) => store.auth);
  const userId = user?.otherData?._id;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: details, isLoading: detailsLoading } = useQuery({
    queryKey: ["details", postId],
    queryFn: () => fetchPost(postId!),
  });

  const isOwner = user?.otherData._id === details?.username._id;

  const { data } = useQuery({
    queryKey: [details?.categories[0]],
    queryFn: () => fetchPosts({ category: details?.categories[0], limit: 10 }),
  });
  const { data: recommendations, isLoading } = useRecommendations(postId!);
  const { mutateAsync: savePost } = useSavePost();
  const hasDetails = Boolean(details);

  useEffect(() => {
    if (!hasDetails || !postId) return;

    const startedAt = Date.now();
    return () => {
      const duration = Math.max(1, Math.ceil((Date.now() - startedAt) / 1000));
      void trackEvent({
        eventType: "post_view",
        postId,
        metadata: { duration },
      }).then((tracked) => {
        if (tracked) {
          return queryClient.invalidateQueries({ queryKey: ["for-you"] });
        }
      });
    };
  }, [hasDetails, postId, queryClient]);

  const { data: profile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userData(userId!),
  });
  const isSaved = profile?.savedPost.some(
    (post: { id: string }) => post.id === postId,
  );

  if (detailsLoading) return <BlogDetailsSkeleton />;

  return (
    <main>
      <div className="page-shell">
        <header className="relative flex w-full items-center border-b border-border pb-10 md:pb-16">
          <div>
            <p className="page-kicker">
              <Link to={`/category/${details?.categories[0]}`}>
                {details?.categories[0]}
              </Link>
            </p>
            <h1 className="page-title mb-5 max-w-5xl">{details?.title}</h1>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground md:text-xl">
              {details?.desc}
            </p>
            <Link
              to={`/profile/${details?.username._id}`}
              className="mt-5 inline-block border-b border-transparent font-semibold text-foreground transition-colors hover:border-primary"
            >
              By @{details?.username?.name}
            </Link>
          </div>
        </header>
        <section className="relative mt-10 md:pl-24">
          <Bookmark
            fill={isSaved ? "currentColor" : "none"}
            size={50}
            strokeWidth={1}
            onClick={async () => await savePost({ userId, postId: postId! })}
            className={cn(
              "absolute right-2 top-2 cursor-pointer rounded-sm border border-border bg-card p-2 text-primary transition-colors hover:bg-muted md:left-0 md:right-auto md:top-16",
            )}
          />
          <div className="mt-8 aspect-[16/10] overflow-hidden bg-muted md:mt-0 md:w-2/3">
            <img
              src={details?.image}
              alt="banner"
              className="h-full w-full object-cover"
            />
          </div>
          {isOwner && (
            <div className="my-4 flex items-center justify-end gap-4 md:w-2/3">
              <Link to={`/update/${postId}`}>
                <Edit
                  className="cursor-pointer rounded-sm border border-border p-1 transition-colors hover:text-primary"
                  size={25}
                />
              </Link>
              <AlertDialogDemo id={postId!} open={open} setOpen={setOpen} />
              <Trash
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-sm border border-border p-1 text-destructive transition-colors hover:bg-destructive/10"
                size={25}
              />
            </div>
          )}

          <div className="mt-8 max-w-4xl break-words text-lg leading-8 text-foreground first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold md:text-xl">
            {details?.content}
          </div>
        </section>
      </div>
      <Recommendations
        isLoading={isLoading}
        recommendations={recommendations ?? data}
      />
    </main>
  );
};

export default BlogDetails;
