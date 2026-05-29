import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  auth: null,
  setAuth: () => { },
  logout: () => { },
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
        const parsedUser = JSON.parse(userStr);
        // 🔥 SOLUCIÓN: Unimos el usuario y el token en un solo objeto
        setAuthState({ ...parsedUser, token: token });
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔥 Modificamos setAuth para que también guarde el token si se lo pasamos
  const setAuth = (user, token) => {
    if (user && token) {
      // Si recibimos ambos (al hacer login)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setAuthState({ ...user, token: token });
    } else if (user && user.token) {
      // Por si desde Login.jsx ya le envías el objeto completo
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token);
      setAuthState(user);
    } else {
      // Para limpiar la sesión
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthState(null);
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