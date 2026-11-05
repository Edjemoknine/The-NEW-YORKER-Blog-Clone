import api from "./client";

export type Category = {
  id: string;
  name: string;
};

export const addCategory = async (category: string) => {
  const { data } = await api.post<Category>("/api/categories", { category });
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get<Category[]>("/api/categories");
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/api/categories/${id}`);
  return data;
};
