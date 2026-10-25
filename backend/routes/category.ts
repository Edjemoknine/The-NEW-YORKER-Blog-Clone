import { Router } from "express";
import { verifytoken } from "../middleware/verify.ts";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controller/category.controller.ts";

const catRoute = Router();

catRoute.post("/", verifytoken, createCategory);
catRoute.get("/", getCategories);

// Optional: protect category deletion too.
catRoute.delete("/:id", verifytoken, deleteCategory);

export default catRoute;
