const Post = require("../models/Post");
const User = require("../models/User");
const { options } = require("../routes/user");

const createPost = async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    const newPost = new Post(data);
    newPost.categories.push(data.category);
    const post = await newPost.save();

    await User.findByIdAndUpdate(data.username, { $push: { posts: post._id } });
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

const getPosts = async (req, res) => {
  const {
    category,
    search,
    page,
    limit,
    sortBy = "title",
    order = "asc",
  } = req.query;

  let filters = {};

  if (category) filters.categories = { $in: [category] };

  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { desc: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const sortOrder = order === "asc" ? 1 : -1;

    const posts = await Post.find(filters)
      .populate("username", "-password")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ [sortBy]: sortOrder });

    const count = await Post.countDocuments(filters);
    console.log({ count });
    const totalPages = Math.ceil(count / Number(limit));
    console.log({ totalPages });

    res.json({
      posts,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ _id: id }).populate(
      "username",
      "-password"
    );
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;

  try {
    const post = await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPost, getPosts, getPost, deletePost, updatePost };
