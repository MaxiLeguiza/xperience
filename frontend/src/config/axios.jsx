import axios from "axios";

// Usá variables de entorno de Vite (deben empezar con VITE_)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const clienteAxios = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // descomenta si usás cookies/sesión
});

// Interceptor para agregar el token en cada request
clienteAxios.interceptors.request.use(
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

export default clienteAxios;
export { clienteAxios };
