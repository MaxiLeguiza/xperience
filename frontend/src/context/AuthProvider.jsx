import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  auth: null,                // { id, email, nombre? }
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);

  // Cargar sesión guardada (opcional)
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) setAuthState(JSON.parse(userStr));
    } catch {}
  }, []);

  const setAuth = (user) => {
    setAuthState(user);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
