import express from "express";
const postRoute = express.Router();
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
} from "../controller/post.js";
import { verifytoken } from "../middleware/verify.js";

postRoute.get("/", getPosts);
postRoute.get("/:id", getPost);
postRoute.post("/", verifytoken, createPost);
postRoute.put("/:id", verifytoken, updatePost);
postRoute.delete("/:id", verifytoken, deletePost);

export default postRoute;
