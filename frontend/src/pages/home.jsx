// =========================================
// Home.jsx — Página principal de Xperience
// =========================================
// Diseño 100% Tailwind, responsive, sin menú lateral
// Usa MapView y SearchBooking como componentes funcionales
// Reproduce el estilo moderno del HTML proporcionado
import React, { useEffect, useState } from "react";
import MapView from "../components/MapView";
import Nav from "../components/Navbar/Nav";
import recorridosBase from "../data/recorridos.json";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function Home() {
  const [recorridos, setRecorridos] = useState(recorridosBase || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/api/recorrido`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;

        const mapped = (data || []).map((r) => ({
          ...r,
          id: r._id ?? r.id,
          pos: r.location ? [r.location.lat, r.location.lng] : r.pos ?? null,
        }));

        setRecorridos(mapped);
      } catch (err) {
        console.warn("Error cargando recorridos:", err);
        if (mounted) {
          setError("No se pudieron cargar los recorridos en vivo. Se muestran los de demo.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // descomentá cuando uses el backend:
    // fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-100 font-display text-gray-800 min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow w-full px-9 py-3 overflow-hidden">
        {/* ESTE div es el que le da altura real al mapa */}
        <div className="w-full h-[85vh] relative">
          <MapView items={recorridos} />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30 pointer-events-none">
              <span className="text-gray-50 bg-black/60 px-4 py-2 rounded-xl text-sm">
                Cargando recorridos...
              </span>
            </div>
          )}

          {error && (
            <div className="absolute top-4 left-4 bg-red-100 text-red-800 px-3 py-2 rounded-md z-40 shadow">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}