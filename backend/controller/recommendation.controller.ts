import type { Request, Response } from "express";
import { getRecommendedPosts } from "../services/recommendation.service.ts";

export async function getPostRecommendations(req: Request, res: Response) {
  const { id } = req.params;
  const rawLimit = req.query.limit;
  const parsedLimit = Number(rawLimit ?? 5);

  if (!id) {
    return res.status(400).json({
      message: "Post ID is required",
    });
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
    return res.status(400).json({
      message: "Limit must be an integer between 1 and 20",
    });
  }

  try {
    const recommendations = await getRecommendedPosts(
      id as string,
      parsedLimit,
    );

    return res.status(200).json({
      data: recommendations,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Post not found") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    console.error("Failed to get recommendations:", error);

    return res.status(500).json({
      message: "Failed to get recommendations",
    });
  }
}
