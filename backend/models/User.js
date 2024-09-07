const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
      maxLength: 500,
    },
    avatar: {
      type: String,
      default: "",
    },
    posts: [{ type: ObjectId, ref: "Post" }],
    savedPost: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
