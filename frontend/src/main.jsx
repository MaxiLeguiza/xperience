// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";

import App from "./App.jsx";
import RedeemPage from "./routes/RedeemPage.jsx"; // ← asegúrate que existe
import { AuthProvider } from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta del QR (validación/canje) */}
          <Route path="/redeem" element={<RedeemPage />} />
          {/* Todo lo demás sigue como antes dentro de tu App */}
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
