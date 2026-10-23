import { Router } from "express";
import { verifytoken } from "../middleware/verify.js";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controller/category.controller.js";

const catRoute = Router();

catRoute.post("/", verifytoken, createCategory);
catRoute.get("/", getCategories);

// Optional: protect category deletion too.
catRoute.delete("/:id", verifytoken, deleteCategory);

export default catRoute;