import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Notifications } from "./Notifications_standalone";

export default function HeaderRight() {
  const { auth, logout } = useAuth();

  return (
    <div className="div3 flex justify-between">
      <div className="card">
        {auth ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              Hola, {auth.nombre || auth.email?.split("@")[0]}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Salir
            </button>

            <div className="flex items-center gap-4">
              <Notifications />
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
