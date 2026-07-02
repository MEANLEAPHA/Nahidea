import axios from "axios";
import { authStore } from "./authStore";

// requests to these should never trigger a forced logout, even on 401 —
// otherwise a bad login attempt itself would redirect you back to /login
const AUTH_FREE_PATHS = ["/api/login", "/api/register", "/api/refresh-token"];

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Always attach the freshest token from the shared store — never a
// component closure. This is what fixes the Safari "logged out immediately" bug.
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isHandling401 = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isAuthFreeRequest = AUTH_FREE_PATHS.some((p) => url.includes(p));

    if (status === 401 && !isAuthFreeRequest && !isHandling401) {
      isHandling401 = true;
      authStore.triggerLogout();
      authStore.triggerRedirectToLogin();
      setTimeout(() => { isHandling401 = false; }, 0);
    }

    return Promise.reject(error);
  }
);

export default api;