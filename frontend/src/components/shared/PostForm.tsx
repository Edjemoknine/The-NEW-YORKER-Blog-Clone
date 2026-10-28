/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
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
import { SelectCategory } from "./CategorySelect";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreatePost, useUpdatePost } from "@/api/hooks/usePosts";
import { handleImage } from "@/lib/cloudinaryUp";

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
  categories: z.array(z.string().min(1)).min(1, {
    message: "Select at least one category.",
  }),
  image: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export function PostForm({
  type,
  post,
  close,
}: {
  type?: string;
  post?: any;
  close?: () => void;
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
          if (close) {
            close();
          }

          navigate(`/profile/${userId}`);
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
          className="w-full  space-y-6 "
        >
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>
                  <div className="w-full bg-neutral-300 overflow-hidden relative rounded-xl h-72 cursor-pointer flex justify-center items-center">
                    <PlusCircle className="text-neutral-500" size={80} />
                    {ImG !== "" && (
                      <img
                        src={ImG}
                        alt="Image"
                        className="w-full h-full object-cover absolute inset-0 "
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
                  <Input placeholder="Title" {...field} />
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
                  <Textarea placeholder="desc" {...field} />
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
                  <Textarea placeholder="content" {...field} />
                </FormControl>

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
                ? "Updating..."
                : "Submit"}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}
