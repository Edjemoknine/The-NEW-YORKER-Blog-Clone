/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreatePost, useUpdatePost } from "@/api/hooks/usePosts";
import { handleImage } from "@/lib/cloudinaryUpload";
import { SelectCategory } from "../shared/CategorySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POST_TYPES = [
  "News",
  "Books & Culture",
  "Fiction & Poetry",
  "Humor & Cartoons",
  "Magazine",
] as const;
const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  desc: z.string().min(2, {
    message: "desc must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  postType: z.enum(POST_TYPES, {
    errorMap: () => ({ message: "Select a post type." }),
  }),
  categories: z.array(z.string().min(1)).min(1, {
    message: "Select at least one category.",
  }),
  image: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export function PostForm({
  type,
  post,
}: {
  type?: string;
  post?: any;
}) {
  const { user } = useSelector((store: any) => store.auth);
  const [ImG, setImage] = useState(post?.image ?? "");
  const navigate = useNavigate();
  const userId = user?.otherData?._id;
  const postId = post?._id;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: post?.title ?? "",
      desc: post?.desc ?? "",
      content: post?.content ?? "",
      postType: post?.postType ?? "News",
      categories: Array.isArray(post?.categories)
        ? post.categories
        : post?.categories
          ? [post.categories]
          : [],
      image: post?.image ?? "",
    },
  });
  const { mutateAsync: onCreate, isPending: isCreating } = useCreatePost();
  const { mutateAsync: onUpdate, isPending: isUpdating } = useUpdatePost();

  async function onSubmit(data: FormValues) {
    if (ImG) {
      if (type !== "Edit") {
        try {
          await onCreate({ ...data, userId });

          navigate(`/profile/${userId}`);
          form.reset();
          setImage("");
        } catch (error: unknown) {
          console.log(error);
        }
      } else {
        try {
          await onUpdate({ ...data, userId, postId });
          form.reset();
          setImage("");
          navigate(`/blog/${postId}`);
        } catch (error: unknown) {
          console.log(error);
        }
      }
    } else {
      alert("Please upload an image");
    }
  }

  return (
    <div className=" flex justify-center w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="editorial-surface mx-auto w-full max-w-4xl space-y-6 p-5 shadow-sm sm:p-8"
        >
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>
                  <div className="relative flex h-72 w-full cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-border bg-muted">
                    <PlusCircle className="text-muted-foreground" size={64} />
                    {ImG !== "" && (
                      <img
                        src={ImG}
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                </FormLabel>
                <FormControl>
                  {/*   <Input
                    onChange={handleImage}
                    style={{ display: "none" }}
                    type="file"
                  /> */}
                  <Input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const url = await handleImage(e);
                      if (url) {
                        form.setValue("image", url);
                        setImage(url);
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <Input
                    placeholder="Story title"
                    className="h-12 bg-background"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>desc</FormLabel> */}
                <FormControl>
                  <Textarea
                    placeholder="Write a short summary"
                    className="min-h-28 resize-y bg-background"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <Textarea
                    placeholder="Write your story"
                    className="min-h-64 resize-y bg-background"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POST_TYPES.map((postType) => (
                      <SelectItem key={postType} value={postType}>
                        {postType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectCategory
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isCreating || isUpdating} type="submit">
            {isCreating
              ? "Creating..."
              : isUpdating
                ? "Saving..."
                : type === "Edit"
                  ? "Save changes"
                  : "Publish story"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
