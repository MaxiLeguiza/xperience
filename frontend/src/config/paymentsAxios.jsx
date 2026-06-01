import axios from 'axios';

const PAYMENTS_SERVICE_URL = import.meta.env.VITE_PAYMENTS_SERVICE_URL || 'http://pagos-servicios.onrender.com';

const paymentsAxios = axios.create({
  baseURL: PAYMENTS_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default paymentsAxios;
