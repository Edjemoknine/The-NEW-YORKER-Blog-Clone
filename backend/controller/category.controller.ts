import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { categories, posts } from "../db/schema.ts";

export const createCategory = async (req: any, res: any) => {
  const { category } = req.body;

  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  const name = category.trim();

  if (name.length > 255) {
    return res.status(400).json({
      message: "Category name must not exceed 255 characters",
    });
  }

  try {
    const [createdCategory] = await db
      .insert(categories)
      .values({ name })
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
    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Unable to fetch categories:", error);

    return res.status(500).json({
      message: "Unable to fetch categories",
    });
  }
};

export const deleteCategory = async (req: any, res: any) => {
  const id = req.params.id;
  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    return res.status(400).json({
      message: "Invalid category id",
    });
  }

  try {
    const [deletedCategory] = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, id),
          sql`NOT EXISTS (
            SELECT 1
            FROM ${posts}
            WHERE ${categories.name} = ANY(${posts.categories})
          )`,
        ),
      )
      .returning({ id: categories.id });

    if (!deletedCategory) {
      const [existingCategory] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

      if (existingCategory) {
        return res.status(409).json({
          message: "Cannot delete a category that is used by posts",
        });
      }

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
