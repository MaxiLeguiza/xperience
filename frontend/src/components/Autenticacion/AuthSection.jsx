import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Notifications } from "../Autenticacion/Notifications_standalone";
// import { User } from 'lucide-react';

export default function AuthSection() {
  const { auth, logout } = useAuth();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nuevo estado para el menú móvil
  return (
    <div className="w-82">
      {auth ? (
        <div className="flex items-center justify-end gap-4 w-full">
          <div className="flex items-center">
            <Notifications />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white ">
              {auth.nombre || auth.email?.split("@")[0]}
            </span>
            <button
              onClick={logout}
              className="px-6 py-1 rounded-md border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
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
                px-6 py-1 rounded-md 
                border border-orange-600 
                text-orange-600 
                hover:bg-orange-600 
                hover:text-white 
                transition-colors
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
