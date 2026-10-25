import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.ts";
import userRoute from "./routes/user.ts";
import catRoute from "./routes/category.ts";
import postRoute from "./routes/post.ts";
import { embedPostJob } from "./controller/embedding-job.controller.ts";
import { dispatchPendingEmbeddingJobs } from "./controller/embedding-dispatcher.controller.ts";

// Register alongside your existing job endpoint.

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  express.json({
    verify: (req, _res, buffer) => {
      (req as express.Request & { rawBody?: string }).rawBody =
        buffer.toString("utf8");
    },
  }),
);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use(cookieParser());

app.get("/api/test", (_req, res) => {
  res.json({ message: "API is working" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);

// QStash worker
app.post("/api/jobs/embed-post", embedPostJob);
app.post("/api/jobs/dispatch-pending", dispatchPendingEmbeddingJobs);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    status: 404,
  });
});

app.use((error: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled API error:", error);
  res.status(500).json({ message: "Internal server error" });
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
