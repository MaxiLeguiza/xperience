// src/lib/api.ts
import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // si tu login usa cookies/JWT
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.message || err?.message || "Error de red";
    console.error("[API ERROR]", msg);
    return Promise.reject(err);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o donde lo guardes
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
