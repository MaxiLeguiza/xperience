import React from "react";
// src/App.jsx
import MapView from "./components/MapView";

export default function App() {
  return (
    <div className="parent">
      {/* Cabecera centrada (Contenedor 2) */}
      <div className="div2">
        <div className="card">
          <h1 style={{ margin: 0, textAlign: "center" }}>Xperience</h1>
        </div>
      </div>

      {/* Columna izquierda alta (Contenedor 1) */}
      <div className="div1">
        <div className="card">Contenedor 1</div>
      </div>

      {/* Derecha arriba (Contenedor 3) */}
      <div className="div3">
        <div className="card">Contenedor 3</div>
      </div>

      {/* Centro grande: MAPA (Contenedor 4) */}
      <div className="div4">
        <div className="container4">
          <MapView />
        </div>
      </div>

      {/* Derecha media (Contenedor 6) */}
      <div className="div6">
        <div className="card">Contenedor 6</div>
      </div>
    </div>
    // 
    // Asi tendrian que estar las rutas
    // 
    // <Routes>
    //                     <Route path="/" element={<AuthLayout />}>
    //                         <Route index element={<Login />} />
    //                         <Route path="registrar" element={<Registrar />} />
    //                         <Route path="olvide-password" element={<OlvidePassword />} />
    //                         <Route path="olvide-password/:token" element={<NuevoPassword />} />
    //                         <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
    //                     </Route>
    //                 </Routes>
  );
}

