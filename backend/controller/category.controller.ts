import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { categories } from "../db/schema.ts";

export const createCategory = async (req: any, res: any) => {
  const { category } = req.body;

  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  try {
    const [createdCategory] = await db
      .insert(categories)
      .values({
        name: category.trim(),
      })
      .returning();

    return res.status(201).json(createdCategory);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    console.error("Unable to create category:", error);

    return res.status(500).json({
      message: "Unable to create category",
    });
  }
};

export const getCategories = async (_req: any, res: any) => {
  try {
    const result = await db.select().from(categories).orderBy(categories.name);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Unable to fetch categories:", error);

    return res.status(500).json({
      message: "Unable to fetch categories",
    });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  try {
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Unable to delete category:", error);

    return res.status(500).json({
      message: "Unable to delete category",
    });
  }
};
