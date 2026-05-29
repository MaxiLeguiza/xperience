import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  auth: null,                // Ahora será { id, email, nombre, role, token }
  setAuth: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión guardada al recargar la página
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (userStr && token) {
        const parsedUser = JSON.parse(userStr);
        // Unimos el usuario y el token en el estado global
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

  // Función corregida y compatible con tu Login.jsx
  const setAuth = (user) => {
    if (user) {
      // 1. Guardamos el string del usuario en el navegador
      localStorage.setItem("user", JSON.stringify(user));
      
      // 2. Buscamos el token (tu Login.jsx ya lo guardó una línea antes de llamar a esta función)
      const token = localStorage.getItem("token");
      
      // 3. Fusionamos ambos en el estado de React para que el Dashboard pueda leer auth.token
      setAuthState({ ...user, token: token });
    } else {
      // 4. Si pasamos null, limpiamos toda la sesión
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