import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})
  const [tokenValido, setTokenValido] = useState(false)
  const [ passwordModificado, setPasswordModificado ] = useState(false)

  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
          await clienteAxios(`/veterinarios/olvide-password/${token}`)
          setAlerta({
            msg: 'Coloca tu Nuevo Password'
          })
          setTokenValido(true)
      } catch (error) {
          setAlerta({
            msg: 'Hubo un error con el enlace',
            error: true
          })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(password.length < 6) {
      setAlerta({
        msg: 'El Password debe ser mínimo de 6 caracteres',
        error: true
      })
      return
    }

    try {
      const url = `/veterinarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, { password } )
      setAlerta({
        msg: data.msg
      })
      setPasswordModificado(true)
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
                    Reestablece tu password y no Pierdas Acceso a {""} 
                    <span className="text-black">tu Cuenta</span>
                </h1>
            </div>

            <div className='w-full max-w-xl shadow-lg px-5 py-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20'>
                { msg && <Alerta 
                      alerta={alerta}
                  />}

                { tokenValido && (
                  <>
                      <form onSubmit={handleSubmit}>
                        <div className="my-3">
                              <label
                                  className="uppercase text-white block text-xl font-bold"
                              >
                                  Nuevo Password
                              </label>
                              <input 
                                  type="password"
                                  placeholder="Tu Nuevo Password"
                                  className="border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                                  value={password}
                                  onChange={ e => setPassword(e.target.value)}
                              />
                        </div>
                        <input 
                            type="submit"
                            value="Guardar Nuevo Password"
                            className="bg-gradient-to-r from-[#ef4444] to-[#d86015] w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:shadow-lg hover:shadow-[#d86015]/50 transition-all hover:scale-105 md:w-auto "
                        />
                      </form>


             
                  </>
                ) }

                {passwordModificado && 
                    <Link 
                      className='block text-center my-5 text-white/80 hover:text-white transition-colors'
                      to="/login"
                    >Iniciar Sesión</Link >
                }
                
            </div>
            </div>
      </>
  )
};

export default NuevoPassword;
