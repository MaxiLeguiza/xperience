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
import { useAuth } from "../hooks/useAuth";
import AuthSection from "../components/AuthSection";

function Home() {
  // -------------------------------
  // Estados locales con datos simulados
  // -------------------------------
  const [topTours, setTopTours] = useState([]);
  const [topExtremeSports, setTopExtremeSports] = useState([]);
  const [topInfluencers, setTopInfluencers] = useState([]);
  const { auth, logout } = useAuth();

  useEffect(() => {
    // Simulación de datos desde backend
    setTopTours([
      { id: 1, title: "Recorrido Histórico", author: "Ana", duration: "2h 30m" },
      { id: 2, title: "Aventura en Montaña", author: "Luis", duration: "4h 00m" },
      { id: 3, title: "City Tour Nocturno", author: "María", duration: "1h 45m" },
    ]);

    setTopExtremeSports([
      { id: 1, title: "Parapente", lugar: "Carhuaz", duration: "2h 30m" },
      { id: 2, title: "Rafting", lugar: "Río Mendoza", duration: "4h 00m" },
      { id: 3, title: "Trekking", lugar: "Cerro Arco", duration: "1h 45m" },
    ]);

    setTopInfluencers([
      {
        id: 1,
        nombre: "Carlos A.",
        usuario: "@carlos_aventura",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNzD-FcvpRdhM9ug8_GLJOuedf1AOgNikGAwtHQhPaBV529A1cHBdYwEJBoXMqWR6U7crUoi7jQ_iymGPpbrbBSY00Z5R24Y0fhIMVlPBro5Ys4qShv6sZ10iKiTjltuSxQLEDAbR2PXmQ9W7FRsroyZv_MnGO_D7MB9TOEqDBSTZKoi3JXHG_KhVrnVJrpjLcXajYpHptgwSEnXL7oUoevMzhPGSNAZJT9fotGaCcY68JZthiakdwRoZRRfxUWopxD7pK8MWoVLQ",
      },
      {
        id: 2,
        nombre: "Elena Viajera",
        usuario: "@elena_explora",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBM_4OzOG71nzIxtjfKUATPVoF3pzzUZjvrErvVcrI2EDewzo6BabR1KT_y0D6HZCIRmn7iwu0NLDIXlpQCBxoDWXL2OQxskKrUODPbetpWjOr1FLAwg4AxD8LjILBBmCpZBpFIJz5F3RCwtGyKs8vezmZ3sf8_ccPLIvui80uIr5BG72AAM0i3Ee0spuvTR7WqrhHbtvRSw4WTMr_Jfp7W3ZWS_g4Z1bxeba1M_qGzYFJDzKeWXDIwcFHKhrANws10g9LmagVvjQ4",
      },
      {
        id: 3,
        nombre: "Marco Polo",
        usuario: "@marcopolotrips",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCyHoxIYQO6wFjYi0Mn0i42LD9VSaPI3rL5PnyGE2nCv7FdOHSAqiSZxagEFgYSqZfkAoZC6BBiAborVIrcYKty1xrC118ypw09mhknzmW8fDXq1lkTN7TCzVcn4SHdspJc305YOhuaScDF0qXrPqtLldGIeTexgHsxqlrb2Ifjc9cZ5JWsNAeE3OF5fUsquiuC3w7Hy6g_u34TOdnKCHzwrqhGaH4G2yjTOTRcwCbPSeqCdkcZdfDNa6fks7r7j3lt9HOxDg6zG4",
      },
    ]);
  }, []);

  // ===========================================================
  // ESTRUCTURA PRINCIPAL
  // ===========================================================
  return (
    <div className="bg-gray-100 font-display text-gray-800 min-h-screen h-screen flex flex-col">
      {/* ====================================
          NAVBAR SUPERIOR
      ==================================== */}
      <header className="bg-card-light shadow-md z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo / título */}
          <h1 className="text-2xl font-bold text-primary">Xperience</h1>

          {/* Menú superior (sin componente externo) */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/recorridos"
              className="text-text-light hover:text-primary text-sm font-medium"
            >
              Recorridos
            </a>
            <a
              href="#deportes"
              className="text-text-light hover:text-primary text-sm font-medium"
            >
              Deportes
            </a>
            <a
              href="/listInfluencer"
              className="text-text-light hover:text-primary text-sm font-medium"
            >
              Influencers
            </a>
          </nav>

          {/* Botón de login */}
          <div >
          <AuthSection/>
            {/* <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition">
              Login
            </button> */}
          </div>
        </div>
      </header>

      {/* ====================================
          CONTENIDO PRINCIPAL
      ==================================== */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* =======================
              COLUMNA IZQUIERDA (buscador + influencers)
          ======================= */}
          <aside className="lg:col-span-3 flex flex-col justify-between space-y-8">
            {/* ---------- Buscador ---------- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Encuentra tu próxima aventura
              </h2>
              <SearchBooking />
            </div>

            {/* ---------- Influencers ---------- */}
            <div id="influencers" className="bg-white p-6 rounded-lg shadow-md flex-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Influencers</h3>
              <div className="space-y-4">
                {topInfluencers.map((inf) => (
                  <div
                    key={inf.id}
                    className="flex items-center space-x-4 bg-white text-gray-900 p-3 rounded-lg shadow-sm border"
                  >
                    <img
                      src={inf.img}
                      alt={`Foto de ${inf.nombre}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{inf.nombre}</h4>
                      <p className="text-sm text-gray-500">{inf.usuario}</p>
                    </div>
                  </div>
                ))}
                 
                
                <Link to="/ListInfluencer" >
                <button className="w-full text-orange-600 hover:underline text-sm font-medium">
                  Ver más
                </button>
                 </Link>
              </div>
            </div>
          </aside>

          {/* =======================
              MAPA CENTRAL
          ======================= */}
          <section className="lg:col-span-7">
            <div className="h-[86vh] w-full bg-white rounded-lg shadow-md overflow-hidden relative">
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
          <aside className="lg:col-span-2 space-y-8">
            {/* ---------- Mejores recorridos ---------- */}
            <div id="recorridos" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Mejores recorridos</h3>
              <div className="space-y-4">
                {topTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-semibold text-text-dark">
                      {tour.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Autor: {tour.author}
                    </p>
                    <p className="text-sm text-gray-400">
                      Duración: {tour.duration}
                    </p>
                  </div>
                ))}
                <Link to="/recorridos">
                  <button className="w-full text-primary hover:underline text-sm font-medium">
                    Ver más
                  </button>
                </Link>
              </div>
            </div>

            {/* ---------- Deportes Extremos ---------- */}
            <div id="deportes" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Deportes Extremos</h3>
              <div className="space-y-4">
                {topExtremeSports.map((sport) => (
                  <div
                    key={sport.id}
                    className="bg-gradient-to-r from-orange-500 via-red-600 to-black text-white p-4 rounded-lg shadow-md"
                  >
                    <h4 className="font-semibold">{sport.title}</h4>
                    <p className="text-sm opacity-90">Lugar: {sport.lugar}</p>
                    <p className="text-sm opacity-90">
                      Duración: {sport.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Home;
