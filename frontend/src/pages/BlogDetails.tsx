import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPost, fetchPosts } from "@/api/posts";
import { Bookmark, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { AlertDialogDemo } from "@/components/shared/AlertDialog";
import { useState } from "react";
import { EditPostDialog } from "@/components/shared/EditDialog";
import { cn } from "@/lib/utils";
import { userData } from "@/api/auth";
import { useSavePost } from "@/api/hooks/usePosts";
import { useRecommendations } from "@/api/hooks/useRecommendation";
import Recommendations from "@/components/utils/Recommendations";

const BlogDetails = () => {
  const { id: postId } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((store: any) => store.auth);
  const userId = user?.otherData?._id;
  const [open, setOpen] = useState(false);

  const { data: details } = useQuery({
    queryKey: ["details", postId],
    queryFn: () => fetchPost(postId!),
  });

  const [isEdit, setIsEdit] = useState(false);
  const isOwner = user?.otherData._id === details?.username._id;

  const { data } = useQuery({
    queryKey: [details?.categories[0]],
    queryFn: () => fetchPosts({ category: details?.categories[0], limit: 10 }),
  });
  const { data: recommendations, isLoading } = useRecommendations(postId!);
  const { mutateAsync: savePost } = useSavePost();

  const { data: profile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userData(userId!),
  });
  const isSaved = profile?.savedPost.some(
    (post: { id: string }) => post.id === postId,
  );

  return (
    <div className="">
      <div className="w-full flex flex-col pt-40 max-w-[90rem] mx-auto px-4 md:px-6 py-10">
        <div className=" relative md:pb-20 pb-10 w-full border-b border-neutral-200  flex  items-center  font-grotesk">
          <div>
            <h5 className="text-red-600 mb-3 uppercase font-grotesk">
              <Link to={`/category/${details?.categories[0]}`}>
                {details?.categories[0]}
              </Link>
            </h5>
            <h1 className="text-neutral-900 md:mb-7 mb-4 font-light md:text-5xl text-3xl   font-grotesk">
              {details?.title}
            </h1>
            <p className="max-w-4xl mb-4 font-grotesk italic text-xl text-neutral-700">
              {details?.desc}
            </p>
            <Link
              to={`/profile/${details?.username.id}`}
              className="max-w-md   hover:border-neutral-700 border-b border-transparent font-semibold text-neutral-800"
            >
              By @{details?.username?.name}
            </Link>
          </div>
        </div>
        <div className="md:pl-32 relative ">
          <Bookmark
            fill={isSaved ? "blue" : "none"}
            size={50}
            strokeWidth={1}
            onClick={async () => await savePost({ userId, postId })}
            className={cn(
              "cursor-pointer text-7xl   hover:text-sky-500 p-1.5 absolute md:top-1/3 md:left-3 right-3 top-2  border rounded-lg",
            )}
          />
          <div className="md:w-2/3 h-full mt-16 ">
            <img
              src={details?.image}
              alt="banner"
              className="w-full h-full object-cover "
            />
          </div>
          {isOwner && (
            <div className="my-4 md:w-2/3 flex items-center gap-4 justify-end">
              <Edit
                onClick={() => setIsEdit(true)}
                className="  p-1 border rounded cursor-pointer hover:text-blue-500"
                size={25}
              />
              <EditPostDialog
                post={details}
                open={isEdit}
                setOpen={setIsEdit}
              />
              <AlertDialogDemo id={postId!} open={open} setOpen={setOpen} />
              <Trash
                onClick={() => setOpen(true)}
                className="  p-1 border rounded cursor-pointer hover:text-red-500"
                size={25}
              />
            </div>
          )}

          <div
            className="md:text-xl  md:first-line:w-full break-words mt-6  first-line:uppercase first-line:tracking-wide
                md:first-letter:text-7xl first-letter:text-5xl first-letter:font-bold 
                first-letter:mr-3 first-letter:float-left max-w-4xl"
          >
            {details?.content}
          </div>
        </div>
      </div>
      <Recommendations
        isLoading={isLoading}
        recommendations={recommendations ?? data}
      />
    </div>
  );
};

export default BlogDetails;
