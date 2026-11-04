import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { posts, recommendationEvents } from "../db/schema.ts";
import { getUserIdFromToken } from "../middleware/verify.ts";

const eventTypes = [
  "post_view",
  "search",
  "recommendation_click",
  "bookmark",
] as const;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createEvent(req: Request, res: Response) {
  const { eventType, postId, searchQuery, metadata } = req.body ?? {};

  if (!eventTypes.includes(eventType)) {
    return res.status(400).json({ message: "Invalid event type" });
  }

  if (eventType === "search") {
    if (typeof searchQuery !== "string" || !searchQuery.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }
  } else if (typeof postId !== "string" || !uuidPattern.test(postId)) {
    return res.status(400).json({ message: "Valid post ID is required" });
  }

  if (
    metadata !== undefined &&
    (typeof metadata !== "object" || metadata === null || Array.isArray(metadata))
  ) {
    return res.status(400).json({ message: "Metadata must be an object" });
  }

  try {
    if (postId) {
      const [post] = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
    }

    const tokenUserId = getUserIdFromToken(req.cookies?.accessToken);
    const userId =
      tokenUserId && uuidPattern.test(tokenUserId) ? tokenUserId : null;

    let visitorId = req.cookies?.visitorId;
    if (typeof visitorId !== "string" || !uuidPattern.test(visitorId)) {
      visitorId = randomUUID();
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("visitorId", visitorId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    const [event] = await db
      .insert(recommendationEvents)
      .values({
        eventType,
        postId: postId ?? null,
        searchQuery: eventType === "search" ? searchQuery.trim() : null,
        metadata: metadata ?? null,
        userId,
        visitorId: userId ? null : visitorId,
      })
      .returning({ id: recommendationEvents.id });

    return res.status(201).json({ id: event.id });
  } catch (error) {
    console.error("Failed to record user event:", error);
    return res.status(500).json({ message: "Failed to record event" });
  }
}
