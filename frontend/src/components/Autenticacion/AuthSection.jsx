// AuthSection.jsx actualizado
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Notifications } from "../Notifications/Notifications_standalone";
import { User } from 'lucide-react'; // Descomentamos esto

export default function AuthSection() {
  const { auth, logout } = useAuth();
  
  return (
    <div className="w-82">
      {auth ? (
        <div className="flex items-center justify-end gap-4 w-full">
          <div className="flex items-center">
            <Notifications />
          </div>
          
          <div className="flex items-center gap-2">
            {/* --- CAMBIO AQUÍ: Sección convertida en Link/Botón --- */}
            <Link 
              to="/dashboard-user" // Redirige a la nueva ruta
              className="flex items-center gap-2 group p-1 rounded-full hover:bg-neutral-800 transition-all duration-200"
              title="Ir a mi Dashboard"
            >
              {/* Ícono de usuario con borde naranja */}
              <div className="border border-orange-600 rounded-full p-1 bg-neutral-700">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              
              {/* Texto del nombre con efecto hover naranja */}
              <span className="text-white group-hover:text-orange-600 transition-colors font-medium text-sm">
                {auth.nombre || auth.email?.split("@")[0]}
              </span>
            </Link>
            {/* ---------------------------------------------------- */}

            <button
              onClick={logout}
              className="px-2 py-1 rounded-md border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors text-xs"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        // ... (El resto del código para "Iniciar sesión" queda igual)
        <div className="flex justify-between">
          <span></span>
          <Link to="/login">
            <button
              className="px-6 py-1 rounded-md border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            >
              Iniciar sesión
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}