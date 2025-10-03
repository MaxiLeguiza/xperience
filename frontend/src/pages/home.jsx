// Home.jsx
// Página principal donde agregamos un listado de mejores recorridos
// y un botón "Ver más" que redirige al componente TourRecorridosApp

import React, { useState, useEffect } from 'react';
import activities from "../data/activities.json";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";
import SearchBooking from "../components/SearchBooking";
import Menu from "../components/Menu";
import { Notifications } from '../components/Notifications_standalone';
import HeaderRight from '../components/Header';



function Home() {
  // Estado local para guardar los mejores recorridos (mock o desde backend)
  const [topTours, setTopTours] = useState([]);

  // Simulamos obtener los mejores recorridos (puedes cambiarlo por un fetch a Nest)
  useEffect(() => {
    // Aquí podrías hacer fetch("/api/tours/top") si tu backend lo soporta
    setTopTours([
      { id: 1, title: "Recorrido Histórico", author: "Ana", duration: "2h 30m" },
      { id: 2, title: "Aventura en Montaña", author: "Luis", duration: "4h 00m" },
      { id: 3, title: "City Tour Nocturno", author: "María", duration: "1h 45m" }
    ]);
  }, []);

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
        <Menu />
        <br />
        <SearchBooking />
      </div>

      {/* Derecha arriba (Contenedor 3) */}
      <div className="div3 flex justify-between">
        {/* <div className="card">
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <Notifications />
        </div> */}
        <HeaderRight/>
      </div>

      {/* Centro grande: MAPA (Contenedor 4) */}
      <div className="div4">
        <div className="container4" style={{ height: "70vh" }}>
          <MapView items={activities} />
        </div>
      </div>

      {/* Derecha media (Contenedor 6) */}
      <div className="div6">
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2 text-orange-500">Mejores recorridos</h2>

          {/* Listado simple de los mejores recorridos */}
          <ul className="space-y-2">
            {topTours.map((tour) => (
              <li key={tour.id} className="border border-black rounded p-2 bg-gray-50">
                <p className="font-medium text-orange-500">{tour.title}</p>
                <p className="text-sm text-gray-600">Autor: {tour.author}</p>
                <p className="text-sm text-gray-600">Duración: {tour.duration}</p>
              </li>
            ))}
          </ul>

          {/* Botón que lleva al componente TourRecorridosApp */}
          <div className="mt-4 text-right">
            {/* Usamos Link de react-router-dom para navegar sin recargar */}
            <Link to="/recorridos">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Ver más
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Home;
