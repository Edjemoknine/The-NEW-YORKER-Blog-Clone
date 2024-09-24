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
// import { toast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";
import { PlusCircle } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import { SelectCategory } from "./CategorySelect";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Username must be at least 10 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 100 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 500 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be provided.",
  }),
  image:z.string().optional()
});

export function PostForm({ type, post, close }: { type?: string; post?: any; close?: () => void }) {
  const { user } = useSelector((store: any) => store.auth);
  const preset_key = "download";
  const cloud_name = "drcatqidu";
  const [ImG, setImage] = useState(post?.image ?? "");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
        }
      )
      .then((res) => setImage(res.data.secure_url))
      .catch((err) => console.log(err));
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: post?.title ?? "",
      description: post?.desc ?? "",
      content: post?.content ?? "",
      category: post?.categories[0] ?? "",
      image: post?.image ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (ImG) {
      if (type !== "Edit") {
        try {
          await axios.post("/api/posts", {
            title: data.title,
            desc: data.description,
            content: data.content,
            category: data.category,
            image: ImG,
            username: user.otherData._id,
          });
          toast({
            title: "Post has been created successfully !",
            type: "background",
          });

          navigate(`/profile/${user?.otherData?._id}`);
          form.reset();
          setImage("");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast({
              title: error.message,
              type: "background",
            });
            console.error(error);
          } else {
            toast({
              title: "An unknown error occurred",
              type: "background",
            });
            console.error("An unknown error occurred:", error);
          }
        }
      } else {
        try {
          await axios.put(`/api/posts/${post._id}`, {
            title: data.title,
            desc: data.description,
            content: data.content,
            category: data.category,
            image: ImG,
            username: user.otherData._id,
          });
          form.reset();
          setImage("");
          if (close) {
            close();
          }
          toast({
            title: "Post has been updated successfully!",
            type: "background",
          });
          navigate(`/profile/${user?.otherData?._id}`);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast({
              title: error.message,
              type: "background",
            });
            console.error(error);
          } else {
            toast({
              title: "An unknown error occurred",
              type: "background",
            });
            console.error("An unknown error occurred:", error);
          }
        }
      }
    } else {
      toast({
        title: "Image Post is Required !",
        type: "foreground",
      });
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
            render={({ field }) => (
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
                  <Input
                    onChange={handleImage}
                    style={{ display: "none" }}
                    type="file"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Description</FormLabel> */}
                <FormControl>
                  <Textarea placeholder="description" {...field} />
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectCategory
                    onChange={field.onChange}
                    value={field.value}
                  />
                  {/* <Textarea placeholder="content" {...field} /> */}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
