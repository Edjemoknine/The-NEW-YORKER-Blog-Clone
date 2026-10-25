import express from "express";
const postRoute = express.Router();
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
} from "../controller/post.controller.ts";
import { verifytoken } from "../middleware/verify.ts";

postRoute.get("/", getPosts);
postRoute.get("/:id", getPost);
postRoute.post("/", verifytoken, createPost);
postRoute.put("/:id", verifytoken, updatePost);
postRoute.delete("/:id", verifytoken, deletePost);

export default postRoute;
