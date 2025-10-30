import axios from 'axios'

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_MAPTILER_KEY,//'http://localhost:3000',
    withCredentials: true,
})

export default clienteAxios