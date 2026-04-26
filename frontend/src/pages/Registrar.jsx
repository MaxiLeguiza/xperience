import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, email, password, repetirPassword].includes("")) {
      setAlerta({ msg: "Hay campos vacios", error: true });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({ msg: "Los Password no son iguales", error: true });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        msg: "El Password es muy corto, agrega minimo 6 caracteres",
        error: true,
      });
      return;
    }

    setAlerta({});
    // Crear el usuario en la api
    try {
      await clienteAxios.post("api/user", { nombre, email, password });
      setAlerta({
        msg: "Creado Correctamente, revisa tu email",
        error: false,
      });

      navigate("/login");
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#ef4444] to-[#d86015] py-12 md:py-24 px-4">
      <div className="container mx-auto max-w-md md:max-w-xl">
      {/* Título / Mensaje */}
      <div className="mb-10">
        <h1 className="text-white font-black text-4xl md:text-5xl text-center">
          Crea tu Cuenta y Busca {""}
          <span className="text-black">tus Actividades Favoritas</span>
        </h1>
      </div>

      {/* Formulario (Fondo con Glassmorphism) */}
      <div className="shadow-lg px-5 py-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
        {msg && <Alerta alerta={alerta} />}
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <label className="uppercase text-white block text-sm md:text-xl font-bold">
              Nombre
            </label>
            {/* Input con foco Naranja */}
            <input
              type="text"
              placeholder="Tu Nombre"
              className="
                                border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30
                            "
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="my-3">
            <label className="uppercase text-white block text-sm md:text-xl font-bold">
              Email
            </label>
            {/* Input con foco Naranja */}
            <input
              type="email"
              placeholder="Email de Registro"
              className="
                                border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30
                            "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-3">
            <label className="uppercase text-white block text-sm md:text-xl font-bold">
              Password
            </label>
            {/* Input con foco Naranja */}
            <input
              type="password"
              placeholder="Tu Password"
              className="
                                border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30
                            "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-3">
            <label className="uppercase text-white block text-sm md:text-xl font-bold">
              Repetir Password
            </label>
            {/* Input con foco Naranja */}
            <input
              type="password"
              placeholder="Repite tu Password"
              className="
                                border border-white/30 w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30
                            "
              value={repetirPassword}
              onChange={(e) => setRepetirPassword(e.target.value)}
            />
          </div>

          {/* Botón Naranja */}
          <input
            type="submit"
            value="Crear Cuenta"
            className="
                            bg-gradient-to-r from-[#ef4444] to-[#d86015] w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 
                            hover:cursor-pointer hover:shadow-lg hover:shadow-[#d86015]/50 transition-all hover:scale-105
                        "
          />
        </form>

        <nav className="mt-10 lg:flex lg:justify-between">
          <Link
            className="block text-center my-5 text-white/80 hover:text-white transition-colors"
            to="/login"
          >
            ¿Ya tienes una cuenta? Inicia Sesión
          </Link>
          <Link
            className="block text-center my-5 text-white/80 hover:text-white transition-colors"
            to="/olvide-password"
          >
            Olvide mi Password
          </Link>
        </nav>
      </div>
    </div>
    </div>
  );
};

export default Registrar;
