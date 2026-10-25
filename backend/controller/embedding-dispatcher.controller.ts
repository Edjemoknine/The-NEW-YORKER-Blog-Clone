import type { Request, Response } from "express";
import { dispatchDueEmbeddingJobs } from "../services/embedding-dispatcher.service.ts";

export async function dispatchPendingEmbeddingJobs(
  req: Request,
  res: Response,
) {
  const secret = process.env.JOB_DISPATCH_SECRET;

  if (!secret || req.header("x-job-dispatch-secret") !== secret) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const result = await dispatchDueEmbeddingJobs();

    return res.status(200).json({
      message: "Embedding recovery dispatch completed",
      ...result,
    });
  } catch (error) {
    console.error("Recovery dispatcher failed:", error);

    return res.status(500).json({
      message: "Recovery dispatcher failed",
    });
  }
}
