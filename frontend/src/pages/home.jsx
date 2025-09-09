import React from 'react'
import activities from "../data/activities.json";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";
import SearchBooking from "../components/SearchBooking";
import Menu from "../components/Menu";
// import Notifications from '../components/Notifications';
import { NotificationIcon, Notifications } from '../components/Notifications_standalone';

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
        <Menu/>
        <br />
        <SearchBooking />
      </div>

      {/* Derecha arriba (Contenedor 3) */}
      <div className="div3 flex justify-between">
        <div className="card">
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <Notifications/>
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