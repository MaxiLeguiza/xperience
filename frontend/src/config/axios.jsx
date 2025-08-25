import axios from 'axios'

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_MAPTILER_KEY,
    withCredentials: true,
})

export default clienteAxios