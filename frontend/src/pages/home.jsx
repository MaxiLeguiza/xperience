import React from 'react'
import activities from "../data/activities.json";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";


function Home() {
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
        <div className="card">menu</div>
      </div>

      {/* Derecha arriba (Contenedor 3) */}
      <div className="div3">
        <div className="card">
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>

      {/* Centro grande: MAPA (Contenedor 4) */}
      <div className="div4">
        <div className="container4" style={{ height: "70vh" }}>
          <MapView items={activities} />
        </div>
      </div>

      {/* Derecha media (Contenedor 6) */}
      <div className="div6">
        <div className="card">Mejores recorridos</div>
      </div>
    </div>
  )
}

export default Home