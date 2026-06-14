// Axios service helper that centralizes the API base URL and auth header injection.
// This comment clarifies the file's purpose for future maintainers.

// Axios API client with base URL and auth token request interceptor.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;