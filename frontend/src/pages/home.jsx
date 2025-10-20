// =========================================
// Home.jsx — Página principal de Xperience
// =========================================
// Diseño 100% Tailwind, responsive, sin menú lateral
// Usa MapView y SearchBooking como componentes funcionales
// Reproduce el estilo moderno del HTML proporcionado

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MapView from "../components/MapView";
import SearchBooking from "../components/SearchBooking";
import activities from "../data/activities.json";
import AuthSection from "../components/Autenticacion/AuthSection";
import Nav from "../components/Navbar/Nav";
import DeportesExtremos from "../components/DeportesExtremos/DeportesExtremos";
import InfluencerCard from "../components/Influencers/InfluencerCard";

function Home() {
  // -------------------------------
  // Estados locales con datos simulados
  // -------------------------------
  const [topTours, setTopTours] = useState([]);



  useEffect(() => {
    // Simulación de datos desde backend
    setTopTours([
      { id: 1, title: "Recorrido Histórico", author: "Ana", duration: "2h 30m" },
      { id: 2, title: "Aventura en Montaña", author: "Luis", duration: "4h 00m" },
      { id: 3, title: "City Tour Nocturno", author: "María", duration: "1h 45m" },
    ]);

  }, []);

  // ===========================================================
  // ESTRUCTURA PRINCIPAL
  // ===========================================================
  return (
    <div className="bg-gray-100 font-display text-gray-800 min-h-screen h-screen flex flex-col ">
      {/* ==================================== NAVBAR SUPERIOR ==================================== */}
      <Nav />

      {/* ====================================
          CONTENIDO PRINCIPAL
      ==================================== */}
      <main className="flex-grow w-full px-9 py-3"> {/* Se modifica  py de 8 a o para poder reducir margen entre el nav y el cuerpo-*/ }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[86vh] items-stretch">
          {/* =======================
              COLUMNA IZQUIERDA (buscador + influencers)
          ======================= */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3 h-full">
            {/* ---------- Buscador ---------- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Encuentra tu próxima aventura
              </h2>
              <SearchBooking />
            </div>

            {/* ---------- Influencers ---------- */}
            <InfluencerCard />
          </div>

          {/* =======================
              MAPA CENTRAL
          ======================= */}
          <section className="lg:col-span-7 h-full">
            <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden relative z-10">
              <MapView items={activities} />

              {/* Indicador */}
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm text-gray-800">Seleccioná un punto para ver detalles.</p>
              </div>
            </div>
          </section>

          {/* =======================
              COLUMNA DERECHA (recorridos + deportes)
          ======================= */}
          <div className="lg:col-span-2 space-y-8 h-full">
            {/* ---------- Mejores recorridos ---------- */}
            <div id="recorridos" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Mejores recorridos</h3>
              <div className="space-y-4">
                {topTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-semibold text-text-light">
                      {tour.title}
                    </h4>
                    <p className="text-sm text-black-400">
                      Autor: {tour.author}
                    </p>
                    <p className="text-sm text-black-400">
                      Duración: {tour.duration}
                    </p>
                  </div>
                ))}
                <Link to="/recorridos">
                  <button className="w-full text-orange-600 hover:underline text-sm font-medium mt-6">
                    Ver más
                  </button>
                </Link>
              </div>
            </div>

          {/* ---------- Deportes Extremos ---------- */}
            <DeportesExtremos />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
