import axios from "axios";

// Usá variables de entorno de Vite (deben empezar con VITE_)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const clienteAxios = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // descomenta si usás cookies/sesión
});

export default clienteAxios;
export { clienteAxios };
