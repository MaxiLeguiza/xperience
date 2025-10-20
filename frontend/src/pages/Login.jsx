import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const extractBackendMsg = (error) => {
    const m = error?.response?.data?.msg ?? error?.response?.data?.message;
    // Nest puede mandar string o array
    if (Array.isArray(m)) return m.join(", ");
    return m || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta({});
    setFieldErrors({ email: "", password: "" });

    const emailTrim = email.trim().toLowerCase();
    if ([emailTrim, password].includes("")) {
      setAlerta({ msg: "Todos los campos son obligatorios", error: true });
      return;
    }

    setLoading(true);
    try {
      const { data } = await clienteAxios.post("/api/user/login", {
        email: emailTrim,
        password,
      });

      localStorage.setItem("token", data.token);
      setAuth({
        id: data?.user?.id,
        email: data?.user?.email,
        nombre: data?.user?.nombre,
      });
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      // const backendMsg = extractBackendMsg(error);
      const backendMsg = data?.msg ?? data?.message ?? (typeof data === "string" ? data : "");

      // Por si no hay server
      if (!error?.response) {
        setAlerta({ msg: "No hay conexión con el servidor.", error: true });
        return;
      }

      // Mapeo específico como pediste:
      if (status === 401 || status === 403) {
        // Detectar cuál falló por el texto que manda tu backend
        if (/usuario no registrado/i.test(backendMsg)) {
          setFieldErrors((f) => ({
            ...f,
            email: "El email no está registrado.",
          }));
          setAlerta({ msg: "Usuario no registrado.", error: true });
        } else if (/contrase(ña|na) incorrecta/i.test(backendMsg)) {
          setFieldErrors((f) => ({ ...f, password: "Contraseña incorrecta." }));
          setAlerta({ msg: "Contraseña incorrecta.", error: true });
        } else {
          // fallback genérico si cambia el mensaje
          setAlerta({ msg: "Usuario o contraseña incorrectos.", error: true });
        }
      } else if (status === 404) {
        setAlerta({
          msg: backendMsg || "Ruta no encontrada. Verifica la URL/proxy.",
          error: true,
        });
      } else if (status === 400) {
        setAlerta({ msg: backendMsg || "Solicitud inválida.", error: true });
      } else {
        setAlerta({ msg: backendMsg || "Ocurrió un error.", error: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const { msg } = alerta;

  return (
    <>
      <div>
        <h1 className="text-orange-600 font-black text-6xl">
          Inicia Sesión y busca tus{" "}
          <span className="text-black">Lugares favoritos</span>
        </h1>
      </div>

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-xl font-bold">
              Email
            </label>
            <input
              type="email"
              placeholder="Email de Registro"
              className={`border w-full p-3 mt-3 bg-gray-50 rounded-xl ${
                fieldErrors.email ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => {
                if (msg) setAlerta({});
                setFieldErrors((f) => ({ ...f, email: "" }));
                setEmail(e.target.value);
              }}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="my-5">
            <label className="uppercase text-gray-600 block text-xl font-bold">
              Password
            </label>
            <input
              type="password"
              placeholder="Tu Password"
              className={`border w-full p-3 mt-3 bg-gray-50 rounded-xl ${
                fieldErrors.password ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => {
                if (msg) setAlerta({});
                setFieldErrors((f) => ({ ...f, password: "" }));
                setPassword(e.target.value);
              }}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <input
            type="submit"
            value={loading ? "Ingresando..." : "Iniciar Sesión"}
            disabled={loading}
            className={`bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 md:w-auto ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-800"
            }`}
          />
        </form>

        <nav className="mt-10 lg:flex lg:justify-between">
          <Link
            className="block text-center my-5 text-gray-500"
            to="/registrar"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
          <Link
            className="block text-center my-5 text-gray-500"
            to="/olvide-password"
          >
            Olvidé mi Password
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Login;
