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
import AuthSection from "../components/Autenticacion/AuthSection";
import Nav from "../components/Navbar/Nav";
import DeportesExtremos from "../components/DeportesExtremos/DeportesExtremos";
import InfluencerCard from "../components/Influencers/InfluencerCard";
import recorridos from "../data/recorridos.json";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Home() {
  const [topTours, setTopTours] = useState([]);
  // const [recorridos, setRecorridos] = useState([]);//Ahora no esta en el backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   setTopTours([
  //     { id: 1, title: "Recorrido Histórico", author: "Ana", duration: "2h 30m" },
  //     { id: 2, title: "Aventura en Montaña", author: "Luis", duration: "4h 00m" },
  //     { id: 3, title: "City Tour Nocturno", author: "María", duration: "1h 45m" },
  //   ]);
  // }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${API}/api/recorrido`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        // Map DB documents to the structure MapView expects
        const mapped = (data || []).map((r) => ({
          ...r,
          id: r._id ?? r.id,
          pos: r.location ? [r.location.lat, r.location.lng] : r.pos ?? null,
        }));

        setRecorridos(mapped);
      } catch (err) {
        if (mounted) setError(err.message || "Error cargando recorridos");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-100 font-display text-gray-800 min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow w-full px-9 py-3 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Encuentra tu próxima aventura
              </h2>
              <SearchBooking />
            </div>

            <InfluencerCard />
          </div>

          <section className="lg:col-span-7">
            {/* dar una altura concreta para que MapContainer (height:100%) tenga referencia */}
            <div className="w-full h-[80vh] lg:h-[85vh] bg-white rounded-lg shadow-md overflow-hidden relative z-10">
              <MapView items={recorridos} />

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/30 pointer-events-none">
                  <span className="text-gray-700 bg-white/70 px-3 py-1 rounded">Cargando recorridos...</span>
                </div>
              )}

              {error && (
                <div className="absolute top-4 left-4 bg-red-100 text-red-800 px-3 py-2 rounded-md z-40">
                  {error}
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm text-gray-800">Seleccioná un punto para ver detalles.</p>
              </div>
            </div>
          </section>

          <div className="lg:col-span-2 space-y-8">
            <div id="recorridos" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Mejores recorridos</h3>
              <div className="space-y-4">
                {topTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500"
                  >
                    <h4 className="font-semibold text-text-light">{tour.title}</h4>
                    <p className="text-sm text-black-400">Autor: {tour.author}</p>
                    <p className="text-sm text-black-400">Duración: {tour.duration}</p>
                  </div>
                ))}
                <Link to="/recorridos">
                  <button className="w-full text-orange-600 hover:underline text-sm font-medium mt-6">
                    Ver más
                  </button>
                </Link>
              </div>
            </div>

            <DeportesExtremos />
          </div>
        </div>
      </main>
    </div>
  );
}
