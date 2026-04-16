import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  auth: null,                // { id, email, nombre? }
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });

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
