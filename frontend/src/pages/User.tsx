/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Bookmark,
  Camera,
  Check,
  FileText,
  LayoutDashboard,
  PenLine,
  Plus,
  Tags,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { z } from "zod";
import { userData } from "@/api/handlers/auth";
import api from "@/api/handlers/client";
import { PostForm } from "@/components/forms/PostForm";
import { NewsCard } from "@/components/utils/NewsCard";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { handleImage } from "@/lib/cloudinaryUpload";
import CategoryManager from "@/components/shared/CategoryManager";
import UserProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";

type Section = "overview" | "posts" | "saved" | "categories" | "create";

const profileSections: {
  id: Section;
  label: string;
  icon: typeof UserRound;
}[] = [
  { id: "overview", label: "Account overview", icon: UserRound },
  { id: "posts", label: "Your posts", icon: FileText },
  { id: "saved", label: "Saved posts", icon: Bookmark },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "create", label: "Create a post", icon: Plus },
];

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(500, "Bio must be 500 characters or fewer."),
  password: z.string().refine((value) => value === "" || value.length >= 8, {
    message: "New password must be at least 8 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const User = () => {
  const { user } = useSelector((store: any) => store.auth);
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = user?.otherData?._id;

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userData(userId),
    enabled: Boolean(userId),
  });

  if (!user) return <Navigate to="/" replace />;

  const posts = profile?.posts ?? [];
  const savedPosts = profile?.savedPost ?? [];

  const selectSection = (section: Section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  const refreshProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
  };

  return (
    <main className="min-h-screen  pt-24 text-[#172033] md:pt-28">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1480px] relative">
        <aside
          className={`fixed inset-y-16 left-0 z-40 flex w-[260px] flex-col overflow-y-auto rounded-r-xl border border-neutral-200 bg-white px-4 pb-6 pt-4 shadow-xl transition-transform duration-200 lg:sticky lg:top-1/2 lg:max-h-[calc(100vh-4rem)] lg:-translate-y-1/2 lg:translate-x-0 lg:self-start lg:pt-6 lg:shadow-lg ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            Manage
          </p>
          <nav aria-label="Profile navigation" className="space-y-1">
            {profileSections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              const count =
                id === "posts"
                  ? posts.length
                  : id === "saved"
                    ? savedPosts.length
                    : undefined;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectSection(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#000000] text-[#ffffff]"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon
                    className={`size-[18px] ${
                      isActive ? "text-[#ffffff]" : "text-neutral-400"
                    }`}
                    strokeWidth={2}
                  />
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl bg-[#f8f5f2] p-4">
            <p className="text-sm font-bold">Your writing, in one place.</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Manage your stories and saved reading from your profile.
            </p>
          </div>
        </aside>

        {menuOpen && (
          <button
            type="button"
            aria-label="Close profile navigation"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          />
        )}

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
            {isLoading ? (
              <UserProfileSkeleton />
            ) : isError ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-white p-8 text-center"
              >
                <h2 className="text-lg font-bold">
                  Could not load your profile
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {error instanceof Error
                    ? error.message
                    : "Please try again later."}
                </p>
              </div>
            ) : (
              <SectionContent
                section={activeSection}
                profile={profile}
                posts={posts}
                savedPosts={savedPosts}
                onProfileSaved={refreshProfile}
                onCreate={() => selectSection("create")}
                toast={toast}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

function SectionContent({
  section,
  profile,
  posts,
  savedPosts,
  onProfileSaved,
  onCreate,
  toast,
}: {
  section: Section;
  profile: any;
  posts: any[];
  savedPosts: any[];
  onProfileSaved: () => Promise<void>;
  onCreate: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  if (section === "overview") {
    return (
      <>
        <SectionHeading
          eyebrow="Your profile"
          title="Account settings"
          description="Manage your personal information and public profile."
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <ProfileSettings
            profile={profile}
            onProfileSaved={onProfileSaved}
            toast={toast}
          />
          <aside className="space-y-5">
            <div className="rounded-2xl bg-[#202b42] p-6 text-white shadow-sm">
              <span className="inline-flex rounded-lg bg-white/10 p-2.5">
                <LayoutDashboard className="size-4 text-red-200" />
              </span>
              <p className="mt-7 text-sm font-medium text-white/65">
                Your activity
              </p>
              <p className="mt-1 text-3xl font-bold">
                {posts.length + savedPosts.length}
              </p>
              <p className="mt-2 text-xs text-white/60">
                Stories published and saved
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-sm font-bold">Your library</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat value={posts.length} label="Your posts" />
                <Stat value={savedPosts.length} label="Saved" />
              </div>
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (section === "posts" || section === "saved") {
    const isPosts = section === "posts";
    const list = isPosts ? posts : savedPosts;

    return (
      <>
        <SectionHeading
          eyebrow={isPosts ? "Published by you" : "Your reading list"}
          title={isPosts ? "Your posts" : "Saved posts"}
          description={
            isPosts
              ? "All the stories you have shared with the community."
              : "Stories you have saved to come back to later."
          }
          action={
            isPosts
              ? {
                  label: "Write a post",
                  onClick: onCreate,
                }
              : undefined
          }
        />
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((post) => (
              <NewsCard key={post.id ?? post._id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={isPosts ? FileText : Bookmark}
            title={isPosts ? "No posts yet" : "Nothing saved yet"}
            description={
              isPosts
                ? "Your published stories will show up here."
                : "Save stories you enjoy and they will be collected here."
            }
            action={
              isPosts
                ? { label: "Create your first post", onClick: onCreate }
                : undefined
            }
          />
        )}
      </>
    );
  }

  if (section === "categories") {
    return (
      <>
        <SectionHeading
          eyebrow="Explore and organize"
          title="Categories"
          description="Create categories and browse the posts filed under each one."
        />
        <CategoryManager />
      </>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="Share your voice"
        title="Create a post"
        description="Write and publish a new story for the community."
      />
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <PostForm type="create" />
      </div>
    </>
  );
}

function ProfileSettings({
  profile,
  onProfileSaved,
  toast,
}: {
  profile: any;
  onProfileSaved: () => Promise<void>;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(profile?.avatar ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSelector((store: any) => store.auth);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      bio: profile?.bio ?? "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: profile?.name ?? "",
      bio: profile?.bio ?? "",
      password: "",
    });
    setAvatar(profile?.avatar ?? "");
  }, [form, profile]);

  const startEditing = () => {
    form.reset({
      name: profile?.name ?? "",
      bio: profile?.bio ?? "",
      password: "",
    });
    setAvatar(profile?.avatar ?? "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.reset({
      name: profile?.name ?? "",
      bio: profile?.bio ?? "",
      password: "",
    });
    setAvatar(profile?.avatar ?? "");
    setIsEditing(false);
  };

  const submitProfile: SubmitHandler<ProfileFormValues> = async (values) => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        name: values.name,
        bio: values.bio,
        avatar,
      };
      if (values.password) payload.password = values.password;

      await api.put(`/api/users/${user?.otherData?._id}`, payload);
      await onProfileSaved();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved.",
      });
    } catch (saveError) {
      console.error("Unable to update profile:", saveError);
      toast({
        title: "Could not update profile",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    try {
      const url = await handleImage(event);
      if (!url) {
        toast({
          title: "Image upload failed",
          description: "Please try another image.",
          variant: "destructive",
        });
        return;
      }
      setAvatar(url);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProfileAvatar
              src={avatar}
              name={profile?.name}
              className="size-[76px] rounded-2xl"
            />
            {isEditing && (
              <label
                htmlFor="profile-avatar"
                className="absolute -bottom-2 -right-2 grid size-8 cursor-pointer place-items-center rounded-lg border-2 border-white bg-[#b3262d] text-white"
                aria-label="Change profile photo"
              >
                <Camera className="size-4" />
                <input
                  id="profile-avatar"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={uploadAvatar}
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">{profile?.name}</h2>
            <p className="mt-1 text-sm text-neutral-500">{profile?.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-[#fceeee] px-2.5 py-1 text-[11px] font-bold text-[#a3242b]">
              Writer account
            </span>
          </div>
        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={startEditing}
            className="gap-2 self-start rounded-xl sm:self-auto"
          >
            <PenLine className="size-4" />
            Edit profile
          </Button>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitProfile)}
          className="mt-6 space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!isEditing || isSaving}
                    className="rounded-xl disabled:bg-neutral-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>
            <Input
              id="profile-email"
              value={profile?.email ?? ""}
              disabled
              className="rounded-xl bg-neutral-50"
            />
          </div>
          {isEditing && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Leave blank to keep your current password"
                      disabled={isSaving}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    maxLength={500}
                    disabled={!isEditing || isSaving}
                    placeholder="Tell readers a little about yourself..."
                    className="resize-none rounded-xl disabled:bg-neutral-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing && (
            <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-5">
              <Button
                type="submit"
                disabled={isSaving || isUploading}
                className="gap-2 rounded-xl bg-[#202b42] hover:bg-[#303d58]"
              >
                <Check className="size-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={cancelEditing}
                disabled={isSaving}
                className="gap-2 rounded-xl text-neutral-600"
              >
                <X className="size-4" />
                Cancel
              </Button>
              {isUploading && (
                <span className="self-center text-sm text-neutral-500">
                  Uploading photo...
                </span>
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-sm font-semibold text-[#b3262d]">{eyebrow}</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">{description}</p>
      </div>
      {action && (
        <Button
          type="button"
          onClick={action.onClick}
          className="gap-2 self-start rounded-xl bg-[#202b42] hover:bg-[#303d58] sm:self-auto"
        >
          <Plus className="size-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

function ProfileAvatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className: string;
}) {
  return src ? (
    <img
      src={src}
      alt={name ? `${name}'s profile` : "Profile"}
      className={`shrink-0 object-cover ring-1 ring-black/5 ${className}`}
    />
  ) : (
    <div
      aria-label={name ? `${name}'s profile` : "Profile"}
      className={`grid shrink-0 place-items-center bg-[#fceeee] font-bold text-[#a3242b] ring-1 ring-black/5 ${className}`}
    >
      {name?.trim().charAt(0).toUpperCase() || <UserRound className="size-5" />}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-[#f7f7f8] p-4">
      <p className="text-xl font-bold text-[#202b42]">{value}</p>
      <p className="mt-1 text-xs font-medium text-neutral-500">{label}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-[#fceeee] text-[#b3262d]">
          <Icon className="size-6" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        {action && (
          <Button
            type="button"
            onClick={action.onClick}
            className="mt-6 gap-2 rounded-xl bg-[#202b42] hover:bg-[#303d58]"
          >
            {action.label}
            <ArrowUpRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default User;
