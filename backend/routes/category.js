const express = require("express");
const Category = require("../models/Category");
const { verifytoken } = require("../middleware/verify");
const catRoute = express.Router();

catRoute.post("/", verifytoken, async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const category = new Category({ name: data.category });
    await category.save();
    res.json(category);
  } catch (error) {
    console.log(error);
  }
});

catRoute.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.log(error);
  }
});

module.exports = catRoute;
