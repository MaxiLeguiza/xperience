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
    <div className="container mx-auto mt-12 md:mt-24 px-4 max-w-md md:max-w-xl">
      {/* Título / Mensaje */}
      <div className="mb-10">
        <h1 className="text-orange-600 font-black text-4xl md:text-5xl text-center">
          Crea tu Cuenta y Busca {""}
          <span className="text-black">tus Actividades Favoritas</span>
        </h1>
      </div>

      {/* Formulario (Fondo Blanco Suave: bg-gray-50) */}
      <div className="shadow-lg px-5 py-10 rounded-xl bg-gray-50">
        {msg && <Alerta alerta={alerta} />}
        <form onSubmit={handleSubmit}>
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-sm md:text-xl font-bold">
              Nombre
            </label>
            {/* Input con foco Naranja */}
            <input
              type="text"
              placeholder="Tu Nombre"
              className="
                                border border-gray-300 w-full p-3 mt-3 bg-white rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                            "
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="my-5">
            <label className="uppercase text-gray-600 block text-sm md:text-xl font-bold">
              Email
            </label>
            {/* Input con foco Naranja */}
            <input
              type="email"
              placeholder="Email de Registro"
              className="
                                border border-gray-300 w-full p-3 mt-3 bg-white rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                            "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-5">
            <label className="uppercase text-gray-600 block text-sm md:text-xl font-bold">
              Password
            </label>
            {/* Input con foco Naranja */}
            <input
              type="password"
              placeholder="Tu Password"
              className="
                                border border-gray-300 w-full p-3 mt-3 bg-white rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                            "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-5">
            <label className="uppercase text-gray-600 block text-sm md:text-xl font-bold">
              Repetir Password
            </label>
            {/* Input con foco Naranja */}
            <input
              type="password"
              placeholder="Repite tu Password"
              className="
                                border border-gray-300 w-full p-3 mt-3 bg-white rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
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
                            bg-orange-600 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 
                            hover:cursor-pointer hover:bg-orange-700 transition-colors
                        "
          />
        </form>

        <nav className="mt-10 lg:flex lg:justify-between">
          <Link
            className="block text-center my-5 text-gray-500 hover:text-orange-600 transition-colors"
            to="/login"
          >
            ¿Ya tienes una cuenta? Inicia Sesión
          </Link>
          <Link
            className="block text-center my-5 text-gray-500 hover:text-orange-600 transition-colors"
            to="/olvide-password"
          >
            Olvide mi Password
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Registrar;
