import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPost } from "@/api/handlers/posts";
import { PostForm } from "@/components/forms/PostForm";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/context/store";
import BlogDetailsSkeleton from "@/components/skeletons/BlogDetailsSkeleton";

const UpdatePost = () => {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["details", id],
    queryFn: () => fetchPost(id!),
    enabled: Boolean(id),
  });

  if (isLoading) return <BlogDetailsSkeleton />;

  if (isError || !post) {
    return (
      <main className="page-shell">
        <div
          role="alert"
          className="editorial-surface mx-auto max-w-3xl p-8 text-center"
        >
          <h1 className="font-editorial text-3xl font-semibold">
            Could not load this story
          </h1>
          <p className="mt-2 text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The story may have been removed or is temporarily unavailable."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
            <Button asChild>
              <Link to={id ? `/blog/${id}` : "/"}>Back to story</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (post.username?._id !== user?.otherData?._id) {
    return (
      <main className="page-shell">
        <div
          role="alert"
          className="editorial-surface mx-auto max-w-3xl p-8 text-center"
        >
          <h1 className="font-editorial text-3xl font-semibold">
            You can’t edit this story
          </h1>
          <p className="mt-2 text-muted-foreground">
            Only the author can make changes to this story.
          </p>
          <Button asChild className="mt-6">
            <Link to={`/blog/${id}`}>Back to story</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="page-kicker">Contribute</p>
        <h1 className="page-title">Edit your story</h1>
        <p className="page-description">
          Revise your story and keep your readers up to date.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link to={`/blog/${id}`}>Cancel and return to story</Link>
        </Button>
      </header>
      <PostForm type="Edit" post={post} />
    </main>
  );
};

export default UpdatePost;
