/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostForm } from "@/components/shared/PostForm";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { userData } from "@/api/FetchPots";
import Grid from "@/components/utils/Grid";
import { Textarea } from "@/components/ui/textarea";

axios.defaults.baseURL = "https://the-new-yorker-backend.vercel.app";
axios.defaults.withCredentials = true;

const User = () => {
  const { user } = useSelector((store: any) => store.auth);
  const navigate = useNavigate();

  const name = user?.otherData?._id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", name],
    queryFn: () => userData(name!),
  });

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return <Navigate to={"/"} />;

  return (
    <div className="  pt-40  max-w-[90rem] mx-auto px-4 md:px-6 py-10">
      <h1 className=" text-center text-6xl mb-6  font-grotesk">
        User Profile{" "}
      </h1>

      <Tabs defaultValue="user" className="">
        <div className="w-full flex justify-center">
          <TabsList className=" mb-4 mt-6 mx-auto">
            <TabsTrigger value="user">User Information</TabsTrigger>
            <TabsTrigger value="posts">User Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved Posts</TabsTrigger>
            <TabsTrigger value="create">Create Post</TabsTrigger>
          </TabsList>
        </div>
        <div>
          {isLoading && (
            <p className="text-center text-2xl mt-10 font-grotesk">Loading...</p>
          )}
        </div>
        <TabsContent value="user">
          <UserInfo profile={profile} />
        </TabsContent>
        <TabsContent value="posts">
          <UserPosts posts={profile?.posts} />
        </TabsContent>
        <TabsContent value="saved">
          <SavedPosts posts={profile?.savedPost} />
        </TabsContent>
        <TabsContent value="create">
          <CreatePost />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default User;
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Email must be provided.",
  }),
  password: z.string().min(6, {
    message: "Password must be provided.",
  }),
  bio: z.string().min(6, { message: "Bio must be provided" }),
});
const UserInfo = ({ profile }: { profile: any }) => {
  // const [userInfo, setUserInfo] = useState({});
  axios.defaults.baseURL = "https://the-new-yorker-backend.vercel.app";
  axios.defaults.withCredentials = true;

  const { user } = useSelector((store: any) => store.auth);
  const [ImG, setImage] = useState(profile?.avatar);

  const { toast } = useToast();
  const id = user?.otherData?._id;



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      username: profile?.name,
      email: profile?.email,
      password: profile?.password,
      bio: profile?.bio,
    },
  });

  const handleImage = (e: any) => {
    const preset_key = "download";
    const cloud_name = "drcatqidu";
    const url = e.target.files[0];
    const formData = new FormData();
    formData.append("file", url);
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
      .then((res) => {
        setImage(res.data.secure_url);
      })
      .catch((err) => console.log(err));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.put(`/api/users/${id}`, {
        name: values.username,
        email: values.email,
        password: values.password,
        bio: values.bio,
        avatar: ImG,
      });
      toast({ title: "Changes has been saved !", type: "background" });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label
                htmlFor="avatar"
                className=" bg-neutral-300 overflow-hidden relative  h-28 w-28 rounded-full cursor-pointer flex justify-center items-center"
              >
                <PlusCircle className="text-neutral-500" size={50} />
                {ImG !== "" && (
                  <img
                    src={ImG}
                    alt="Image"
                    className="w-full h-full object-cover object-top absolute inset-0 "
                  />
                )}
              </Label>
              <Input
                id="avatar"
                onChange={handleImage}
                style={{ display: "none" }}
                type="file"
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passowrd</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I am content creator..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Save changes</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
const SavedPosts = (posts: any) => {
  return (
    <div>
      {" "}
      {posts ? (
        <Grid
          data={posts}
          HeadingTitle={""}
          HeadingSubTitle={""}
          image={""}
          type={"news"}
        />
      ) : (
        <div className="text-center text-xl font-grotesk py-6">No posts</div>
      )}
    </div>
  );
};

const CreatePost = () => {
  return (
    <div className="w-full ">
      <PostForm type="create" />
    </div>
  );
};

const UserPosts = (posts: any) => {
  return (
    <div>
      {posts ? (
        <Grid
          data={posts}
          HeadingTitle={""}
          HeadingSubTitle={""}
          image={""}
          type={"news"}
        />
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};
