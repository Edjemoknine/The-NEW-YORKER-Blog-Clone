const express = require("express");
const postRoute = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
} = require("../controller/post.js");
const { verifytoken } = require("../middleware/verify.js");

postRoute.get("/", getPosts);
postRoute.get("/:id", getPost);
postRoute.post("/", verifytoken, createPost);
postRoute.put("/:id", verifytoken, updatePost);
postRoute.delete("/:id", verifytoken, deletePost);

module.exports = postRoute;
