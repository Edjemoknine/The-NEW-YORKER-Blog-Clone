import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.ts";
import userRoute from "./routes/user.ts";
import catRoute from "./routes/category.ts";
import postRoute from "./routes/post.ts";
import { embedPostJob } from "./controller/embedding-job.controller.ts";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  /*   "https://the-new-yorker-blog-frontend.vercel.app",
  "https://the-new-yorker-blog-frontend.onrender.com", */
].filter(Boolean);

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  express.json({
    verify: (req, _res, buffer) => {
      (req as typeof req & { rawBody?: string }).rawBody =
        buffer.toString("utf8");
    },
  }),
);
app.get("/api/test", (_req, res) => {
  res.json({ message: "API is working" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);
app.post("/api/jobs/embed-post", embedPostJob);

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    status: 404,
  });
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error);
  res.status(500).json({ message: "Internal server error" });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
