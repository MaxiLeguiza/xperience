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

        // --- Lógica de validación de campos vacíos ---
        let errors = {};
        if (!emailTrim) {
            errors.email = "El email es obligatorio.";
        }
        if (!password) {
            errors.password = "La contraseña es obligatoria.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setAlerta({ msg: "Todos los campos son obligatorios", error: true });
            return; // Detiene la ejecución si hay errores
        }
        // ---------------------------------------------

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
            navigate("/home");
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
            <div className="relative min-h-screen bg-gradient-to-br from-black via-[#ef4444] to-[#d86015] flex flex-col items-center justify-center">
                <div className="absolute top-4 left-4 z-20">
                    <Link
                        to="/"
                        className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-[#d86015] px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-orange-500/20 hover:from-orange-500/90 hover:to-[#d86015]/90 hover:shadow-[#d86015]/30 transition-all"
                    >
                        Volver atrás
                    </Link>
                </div>

                <div className="container mx-auto flex flex-col items-center gap-4 p-4 max-w-xl">
                    {/* Encabezado (h1) 
                Se ajusta el margen y el texto para que se vea mejor en una sola columna.
            */}
                    <div className="mb-8">
                        <h1 className="text-white font-black text-6xl text-center">
                            Inicia Sesión y busca tus{" "}
                            <span className="text-black">Lugares favoritos</span>
                        </h1>
                    </div>

                    {/* Formulario 
            Se ajustan los márgenes.
        */}
                    <div className="w-full shadow-lg px-5 py-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
                        {msg && <Alerta alerta={alerta} />}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="my-3">
                                <label className="uppercase text-white block text-xl font-bold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Email de Registro"
                                    className={`border w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 ${fieldErrors.email ? "border-red-500" : "border-white/30"
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

                            <div className="my-3">
                                <label className="uppercase text-white block text-xl font-bold">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Tu Password"
                                    className={`border w-full p-3 mt-3 bg-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 ${fieldErrors.password ? "border-red-500" : "border-white/30"
                                        }`}
                                    value={password}
                                    onChange={(e) => {
                                        if (msg) setAlerta({});
                                        setFieldErrors((f) => ({ ...f, password: "" }));
                                        setPassword(e.target.value);
                                    }}
                                />
                                {/* Esta línea muestra el error específico de contraseña vacía */}
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
                                className={`bg-gradient-to-r from-orange-500 to-[#d86015] w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 ${loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:shadow-[#d86015]/50 hover:scale-105 transition-all"
                                    }`}
                            />
                        </form>

                        <nav className="mt-10 lg:flex lg:justify-between">
                            <Link
                                className="block text-center my-5 text-white/80 hover:text-white transition-colors"
                                to="/registrar"
                            >
                                ¿No tienes una cuenta? Regístrate
                            </Link>
                            <Link
                                className="block text-center my-5 text-white/80 hover:text-white transition-colors"
                                to="/olvide-password"
                            >
                                Olvidé mi Password
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;