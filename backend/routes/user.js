const express = require("express");
const userRoute = express.Router();
const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
const Post = require("../models/Post.js");
const { verifytoken } = require("../middleware/verify.js");

userRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const user = await User.findById(id).populate("savedPost posts").exec();
    console.log(user);
    const data = user._doc;
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

userRoute.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { postId, ...rest } = req.body;

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // const hashPassword = await bcrypt.hash(req.body.password, 10);
      rest.password = hashPassword;
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle savedPost logic if postId is provided
    if (postId) {
      const postIndex = user.savedPost.findIndex((post) => post.equals(postId));
      if (postIndex === -1) {
        user.savedPost.push(postId);
      } else {
        user.savedPost = user.savedPost.filter((post) => !post.equals(postId));
      }
    }
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});
userRoute.delete("/:id", verifytoken, async (req, res) => {
  const { id } = req.params;
  if (id === req.body.userId) {
    try {
      const findUser = await User.findById(id);

      try {
        await Post.deleteMany({ email: findUser.email });
        await User.findByIdAndDelete(id);
        res.json({ message: "user has been deleted" });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = userRoute;
