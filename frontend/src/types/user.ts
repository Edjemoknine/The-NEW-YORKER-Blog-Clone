import { z } from "zod";

export type Section = "overview" | "posts" | "saved" | "categories" | "create";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(500, "Bio must be 500 characters or fewer."),
  password: z.string().refine((value) => value === "" || value.length >= 8, {
    message: "New password must be at least 8 characters.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
