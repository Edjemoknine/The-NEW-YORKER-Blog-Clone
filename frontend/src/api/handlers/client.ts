import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEV
    : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshRequest: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const requestUrl = request?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/refresh") ||
      requestUrl.includes("/api/auth/logout");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshRequest ??= api
        .post("/api/auth/refresh")
        .then(() => undefined)
        .finally(() => {
          refreshRequest = null;
        });
      await refreshRequest;
      return api(request);
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        localStorage.removeItem("user");
        if (window.location.pathname !== "/auth") {
          window.location.assign("/auth");
        }
      }
      return Promise.reject(refreshError);
    }
  },
);

export default api;
