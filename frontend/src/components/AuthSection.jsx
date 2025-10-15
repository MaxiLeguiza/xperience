import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Notifications } from "./Notifications_standalone";

export default function AuthSection() {
  const { auth, logout } = useAuth();

  return (
    // <div className="flex justify-between">
    <div>
      {/*esto le dava otra forama -> className="card"*/}
      {auth ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-12">
            <Notifications/>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {auth.nombre || auth.email?.split("@")[0]}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-orange-600 hover:bg-orange-400 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <span></span>
          <Link to="/login">
            <button className="px-6 py-1 rounded-md bg-indigo-600 text-white">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
    // </div>
  );
}
