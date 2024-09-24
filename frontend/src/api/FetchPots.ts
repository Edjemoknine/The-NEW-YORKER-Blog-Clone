/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
type Props = {
  category?: string;
  limit: number;
  search?: string;
  pageParam?: number;
  sort?: string; // "desc" or "asc"
};

export const fetchPosts = async ({
  category = "",
  limit = 8,
  search = "",
  pageParam = 1,
  sort,
}: Props) => {
  console.log(search);
  console.log(pageParam);
  console.log(category);
  const { data } = await axios.get(
    `/api/posts?category=${category}&limit=${limit}&search=${search}&page=${pageParam}`
  );
  return data;
};

export const fetchPost = async (id: string) => {
  const { data } = await axios.get(`/api/posts/${id}`);
  return data;
};
export const userData = async (name: string) => {
  const { data } = await axios.get(`/api/users/${name}`);
  return data;
};
