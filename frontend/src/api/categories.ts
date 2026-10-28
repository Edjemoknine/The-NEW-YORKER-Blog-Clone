import api from "./client";

export const addCategory = async (category: string) => {
  try {
    return await api.post("/api/categories", { category });
  } catch (error) {
    console.log(error);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};
