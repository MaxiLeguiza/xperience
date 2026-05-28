import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Notifications } from "../Notifications/Notifications_standalone";
import { User } from 'lucide-react';

export default function AuthSection() {
  const { auth, logout } = useAuth();

  return (
    <div className="w-auto md:w-82">
      {auth ? (
        <div className="flex items-center justify-end gap-2 md:gap-4 w-full">
          <div className="flex items-center">
            <Notifications />
          </div>

          {/* Mobile: solo ícono de usuario */}
          <div className="flex md:hidden items-center">
            <div className="w-8 h-8 rounded-full bg-gray-500/30 flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </div>
          </div>

          {/* Desktop: nombre + botón cerrar sesión */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white ">
              {auth.nombre || auth.email?.split("@")[0]}
            </span>
            <button
              onClick={logout}
              className="px-2 py-1 rounded-md border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <span></span>
          <Link to="/login">
            <button
              className="
                px-4 md:px-6 py-1 rounded-md 
                border border-orange-600 
                text-orange-600 
                hover:bg-orange-600 
                hover:text-white 
                transition-colors
                text-sm md:text-base
              "
            >
              Iniciar sesión
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
