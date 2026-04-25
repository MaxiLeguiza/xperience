import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  auth: null,                // { id, email, nombre? }
  setAuth: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }) {
<<<<<<< HEAD
  const [auth, setAuthState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (userStr && token) {
        setAuthState(JSON.parse(userStr));
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);
=======
  const [auth, setAuthState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });
>>>>>>> 451ac5e6658109e4d7979ea01aa213003018e42f

  const setAuth = (user) => {
    setAuthState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
