// src/lib/api.ts
import axios from 'axios';

const baseURL ='http://localhost:3000/api';
// Convención: baseURL ya termina en /api → en las llamadas NO pongas /api (usa '/qr')

const api = axios.create({
  baseURL,
  withCredentials: true, // si usás cookies; si solo JWT, podés quitarlo
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete (config.headers as any).Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err?.message || 'Error de red';
    console.error('[API ERROR]', status, msg);
    return Promise.reject(err);
  }
);

export default api;
