const mongoose = require("mongoose");

const catSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", catSchema);

module.exports = Category;
