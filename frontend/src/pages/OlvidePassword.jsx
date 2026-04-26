import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios'; 

const OlvidePassword = () => {
    const [email, setEmail] = useState('')
    const [alerta, setAlerta] = useState({})


    const handleSubmit = async e => {
        e.preventDefault()

        if(email === '' || email.length < 6) {
            setAlerta({msg: 'El Email es obligatorio', error: true})
            return
        }

        try {
            const { data } = await clienteAxios.post('/veterinarios/olvide-password', { email })
            setAlerta({msg: data.msg})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta 

  return (
      <>
            <div className="min-h-screen bg-gradient-to-br from-black via-[#ef4444] to-[#d86015] py-12 md:py-24 px-4 flex flex-col items-center justify-center">
            <div className="max-w-xl mb-10">
                <h1 className="text-white font-black text-6xl text-center">
                    Recupera tu Acceso y no Pierdas {""} 
                    <span className="text-black">tu Cuenta</span>
                </h1>
            </div>

            <div className='w-full max-w-xl shadow-lg px-5 py-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20'>

                { msg && <Alerta 
                    alerta={alerta}
                />}
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="my-3">
                        <label
                            className="uppercase text-white block text-xl font-bold"
                        >
                            Email
                        </label>
                        <input 
                            type="email"
                            placeholder="Email de Registro"
                            className="border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <input 
                        type="submit"
                        value="Enviar Instrucciones"
                        className="bg-gradient-to-r from-[#ef4444] to-[#d86015] w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:shadow-lg hover:shadow-[#d86015]/50 transition-all hover:scale-105 md:w-auto "
                    />
                </form>

                <nav className='mt-10 lg:flex lg:justify-between'>
                    <Link 
                        className='block text-center my-5 text-white/80 hover:text-white transition-colors'
                        to="/login">¿Ya tienes una cuenta? Inicia Sesión</Link >
                    <Link 
                        className='block text-center my-5 text-white/80 hover:text-white transition-colors'
                        to="/registrar">¿No tienes una cuenta? Regístrate</Link >
                </nav>
            </div>
            </div>
      </>
  )
};

export default OlvidePassword;
