import axios from 'axios'

const clienteAxios = axios.create({
<<<<<<< Updated upstream
    baseURL: 'http://localhost:3000', //Falta el de qr y tambien del de recoridos local de render:https://xperience-h650.onrender.com/
=======
    baseURL:'http://localhost:3000',
>>>>>>> Stashed changes
    withCredentials: true,
})

export default clienteAxios