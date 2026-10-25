import type { Request, Response } from "express";
import { Receiver } from "@upstash/qstash";
import { processEmbeddingJob } from "../services/embedding-job.ts";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});
type RequestWithRawBody = Request & { rawBody?: string };

export const embedPostJob = async (req: RequestWithRawBody, res: Response) => {
  const signature = req.headers["upstash-signature"];
  const rawBody = req.rawBody;
  const baseUrl = process.env.APP_BASE_URL;

  if (typeof signature !== "string" || !rawBody || !baseUrl) {
    return res.status(400).json({
      message: "Missing signature, request body, or application URL",
    });
  }

  try {
    await receiver.verify({
      signature,
      body: rawBody,
      url: `${baseUrl}${req.originalUrl}`,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid QStash signature",
    });
  }

  let payload: { jobId?: unknown };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({
      message: "Invalid JSON payload",
    });
  }

  if (
    typeof payload.jobId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      payload.jobId,
    )
  ) {
    return res.status(400).json({
      message: "A valid jobId is required",
    });
  }

  try {
    const result = await processEmbeddingJob(payload.jobId);

    return res.status(200).json({
      message: "Embedding job processed",
      ...result,
    });
  } catch (error) {
    console.error("Embedding job processing failed:", error);

    // Non-2xx allows QStash to retry the delivery.
    return res.status(500).json({
      message: "Embedding job processing failed",
    });
  }
};
