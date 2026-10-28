import api from "./client";

export const userData = async (name: string) => {
  const { data } = await api.get(`/api/users/${name}`);
  return data;
};
