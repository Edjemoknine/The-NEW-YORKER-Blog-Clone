/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from "@/components/utils/Grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPost, fetchPosts, userData } from "@/api/FetchPots";
import { Bookmark, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { AlertDialogDemo } from "@/components/shared/AlertDialog";
import { useState } from "react";
import { EditPostDialog } from "@/components/shared/EditDialog";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { cn } from "@/lib/utils";

const BlogDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((store:any) => store.auth);
  const name = user?.otherData?._id;
  const naviagte = useNavigate();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: details } = useQuery({
    queryKey: ["details", id],
    queryFn: () => fetchPost(id!),
  });

  const [isEdit, setIsEdit] = useState(false);
  const isOwner = user?.otherData._id === details?.username._id;

  const { data } = useQuery({
    queryKey: [details?.categories[0]],
    queryFn: () => fetchPosts({ category: details?.categories[0], limit: 10 }),
  });

  const deletePost = async () => {
    try {
      await axios.delete(`/api/posts/${id}`);
      toast({
        title: "Post has been deleted successfully !",
        type: "background",
      });
      naviagte(`/`);
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  const savePost = async () => {
    try {
      await axios.put(`/api/users/${name}`, {
        postId: id,
      });
      toast({
        title: "Post has been saved successfully !",
        type: "background",
      });
    } catch (error) {
      console.log(error);
    }
  };
  queryClient.invalidateQueries({ queryKey: ["userProfile"] });

  const onSavePost = useMutation({
    mutationKey: ["savePost", id],
    mutationFn: async () => {
      await savePost();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast({
        title: "Post has been saved successfully!",
        type: "background",
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { data: profile } = useQuery({
    queryKey: ["userProfile", name],
    queryFn: () => userData(name!),
  });
  const isSaved = profile?.savedPost.some((post: { _id: string }) => post._id === id);

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
              to={`/profile/${details?.username._id}`}
              className="max-w-md   hover:border-neutral-700 border-b border-transparent font-semibold text-neutral-800"
            >
              By {details?.username?.name}
            </Link>
          </div>
        </div>
        <div className="md:pl-32 relative ">
          <Bookmark
            fill={isSaved && "blue"}
            size={50}
            strokeWidth={1}
            onClick={() => onSavePost.mutate()}
            className={cn(
              "cursor-pointer text-7xl   hover:text-sky-500 p-1.5 absolute md:top-1/3 md:left-3 right-3 top-2  border rounded-lg"
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
              <AlertDialogDemo
                action={deletePost}
                open={open}
                setOpen={setOpen}
              />
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

      <Grid
        data={data}
        HeadingTitle={"READ MORE"}
        HeadingSubTitle={""}
        image={""}
        type={"news"}
      />
    </div>
  );
};

export default BlogDetails;
