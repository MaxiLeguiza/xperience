import axios from 'axios';

const PAYMENTS_SERVICE_URL = import.meta.env.VITE_PAYMENTS_SERVICE_URL || 'http://localhost:3002';

const paymentsAxios = axios.create({
  baseURL: PAYMENTS_SERVICE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default paymentsAxios;
