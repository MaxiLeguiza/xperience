import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  auth: null,                // { id, email, nombre? }
  setAuth: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }) {
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
