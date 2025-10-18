// TourRecorridos.jsx
// -------------------------------------------------------------
// Versión actualizada: vuelve a mostrar los influencers en la UI
// - Influencers clickeables en la columna izquierda
// - Filtrado por influencer (puede deseleccionarse con "Mostrar todos")
// - TourCard sigue abriendo el modal de detalle y permite reservar
// -------------------------------------------------------------

import React, { useEffect, useState } from "react";
import TourCard from "./TourCard"; // Asumo que ya lo tenés en tu proyecto
import Filters from "./Filters"; // Asumo que ya lo tenés
import CreateTourModal from "./CreateTourModal"; // Asumo que ya lo tenés
import RecommendedPackages from "./RecommendedPackages"; // Asumo que ya lo tenés

/* ------------------------------------------------------------------
   Componente interno: RecommendedInfluencers
   Lo dejo aquí dentro para que NO necesites crear un archivo nuevo.
   Muestra una fila scrollable de influencers, clickeables.
   onSelect(null) -> limpia el filtro.
   ------------------------------------------------------------------ */
function RecommendedInfluencers({ influencers = [], onSelect, selectedId }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Influencers recomendados</h3>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {influencers.map((inf) => (
          <button
            key={inf.id}
            onClick={() => onSelect(inf)}
            className={`flex-shrink-0 w-40 p-3 rounded-xl border transition-transform transform hover:scale-[1.02] text-left flex gap-3 items-center ${{
              true: "",
            }} ${selectedId === inf.id ? "ring-2 ring-indigo-400 border-indigo-200" : "border-gray-200"}`}
          >
            <img
              src={inf.avatar}
              alt={inf.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{inf.name}</p>
              <p className="text-xs text-gray-400">{inf.social}</p>
            </div>
          </button>
        ))}

        {/* Botón para borrar filtro */}
        <button
          onClick={() => onSelect(null)}
          className="flex-shrink-0 px-3 py-2 bg-gray-100 rounded-full text-sm font-medium"
        >
          Mostrar todos
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Modal de detalle (inline)
   - Muestra info del tour
   - Botón reservar (mock)
   ------------------------------------------------------------------ */
function TourDetailModal({ tour, onClose, onReserve }) {
  if (!tour) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-orange-200 p-6 rounded-2xl shadow-xl max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      > {/*Fondo de tarjeta */ */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h1 className="text-6xl font-bold mb-9">{tour.title}</h1>
        <p className="text-gray-500 mb-1">Autor: {tour.author}</p> 
        <p className="text-gray-500 mb-5">
          Duración: {tour.durationMinutes} min · {tour.distanceKm} km
        </p>
        <p className="text-gray-800 font-semibold mb-9">💲 {tour.price} ARS</p>

        {/* Carrusel simple de imágenes mock: Aca tendriamos que ver que IA puede traer iamgenes del lugar*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <img
            src={tour.image || "https://picsum.photos/600/300"}
            alt="imagen recorrido"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src={tour.image2 || "https://picsum.photos/601/300"}
            alt="imagen recorrido 2"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <h3 className="text-black mt-5 mb-5 font-bold">Descripción:</h3>
        <p className="text-gray-600 mb-4">{tour.description}</p>

        <div className="flex gap-2 items-center mb-3">
          <img
            src={tour.influencer?.avatar || "https://via.placeholder.com/40"}
            alt={tour.influencer?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{tour.influencer?.name}</p>
            <p className="text-xs text-gray-400">{tour.influencer?.social}</p>
          </div>
        </div>

        <button
          onClick={() => onReserve(tour)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
        >
          Reservar este recorrido
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Componente principal
   - Maneja tours, filtros y selección de influencer
   ------------------------------------------------------------------ */
export default function TourRecorridos() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [filters, setFilters] = useState({ q: "", priceMin: "", priceMax: "", sortPriceAsc: false });
  const [createOpen, setCreateOpen] = useState(false);

  // Estado del tour seleccionado y del influencer seleccionado
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);

  // Mock de confirmación de reserva
  const [reservation, setReservation] = useState(null);

  // ------------------ Cargar datos mock al inicio ------------------
  useEffect(() => {
    const mockTours = [
      {
        id: "t1",
        title: "City Tour",
        author: "Juan Pérez",
        durationMinutes: 120,
        distanceKm: 10,
        price: 5000,
        description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "https://picsum.photos/id/1018/1000/600/",
        image2: "https://picsum.photos/id/1015/1000/600/",
        influencer: { id: "i1", name: "Luisito Comunica", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj", social: "@luisitocomunica" },
      },
      {
        id: "t2",
        title: "Tour Histórico",
        author: "Ana Gómez",
        durationMinutes: 90,
        distanceKm: 6,
        price: 3500,
        description: "Sumérgete en la historia con guías expertos.",
        image: "https://picsum.photos/id/1025/1000/600/",
        image2: "https://picsum.photos/id/1020/1000/600/",
        influencer: { id: "i2", name: "Drew Binsky", avatar: "https://yt3.googleusercontent.com/VCZmgTUILsHKyibr4m9W-bYkDhWPZtjcq3cksdTgtM3iVDMqHnXh0_M5hQoXLlFHRBeK9q7I=s160-c-k-c0x00ffffff-no-rj", social: "@drewbinsky" },
      },
      {
        id: "t3",
        title: "Escapada a la playa",
        author: "María Luna",
        durationMinutes: 180,
        distanceKm: 40,
        price: 8000,
        description: "Relax total en playas paradisíacas.",
        influencer: { id: "i1", name: "Luisito Comunica", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj", social: "@luisitocomunica" },
      },
    ];

    setTours(mockTours);
    setFilteredTours(mockTours);

    setPackages([
      { id: "p1", title: "Paquete Básico", description: "Recorridos esenciales" },
      { id: "p2", title: "Paquete Premium", description: "Experiencias con extras" },
    ]);

    setInfluencers([
      { id: "i1", name: "Luisito Comunica", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj", social: "@luisitocomunica" },
      { id: "i2",  name: "Drew Binsky", avatar: "https://yt3.googleusercontent.com/VCZmgTUILsHKyibr4m9W-bYkDhWPZtjcq3cksdTgtM3iVDMqHnXh0_M5hQoXLlFHRBeK9q7I=s160-c-k-c0x00ffffff-no-rj", social: "@drewbinsky"},
      { id: "i3", name: "Charly Sinewan", avatar: "https://yt3.googleusercontent.com/XJLr0QWEyjktFrSi9HXh7GxUYAB3kMHlsy81uxxPofqwk3iD03WeYDTEq3e5t11ncdi8uEEyWA=s160-c-k-c0x00ffffff-no-rj", social: "@charlysinewan" },
    ]);
  }, []);

  // ------------------ Aplicar filtros (ahora incluye influencer) ------------------
  function applyFilters() {
    let results = tours.filter((tour) => {
      const matchText =
        filters.q === "" ||
        tour.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        tour.author.toLowerCase().includes(filters.q.toLowerCase());

      const matchPriceMin = filters.priceMin === "" || tour.price >= Number(filters.priceMin);
      const matchPriceMax = filters.priceMax === "" || tour.price <= Number(filters.priceMax);

      // Filtrado por influencer si hay uno seleccionado
      const matchInfluencer =
        !selectedInfluencerId || (tour.influencer && tour.influencer.id === selectedInfluencerId);

      return matchText && matchPriceMin && matchPriceMax && matchInfluencer;
    });

    if (filters.sortPriceAsc) {
      results = [...results].sort((a, b) => a.price - b.price);
    }

    setFilteredTours(results);
  }

  // Recalcular siempre que cambien filtros, tours o influencer seleccionado
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, tours, selectedInfluencerId]);

  return (
    <div className="h-screen w-screen bg-gray-50 p-4 md:p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📋 Gestor de Recorridos</h1>
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded-xl"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo recorrido
        </button>
      </header>

      {/* Layout general */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {/* Columna izquierda: filtros + paquetes + influencers (re-sumado) */}
        <div className="flex flex-col space-y-4 overflow-y-auto">
          <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} />

          <RecommendedPackages packages={packages} onSelect={(p) => console.log("Paquete seleccionado", p)} />

          {/* Influencers: componente inline */}
          <RecommendedInfluencers
            influencers={influencers}
            onSelect={(inf) => setSelectedInfluencerId(inf ? inf.id : null)}
            selectedId={selectedInfluencerId}
          />

          {/* Indicador de filtro activo */}
          {selectedInfluencerId && (
            <div className="bg-white p-3 rounded-xl shadow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={influencers.find((i) => i.id === selectedInfluencerId)?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">
                    Filtrando por: {influencers.find((i) => i.id === selectedInfluencerId)?.name}
                  </p>
                  <p className="text-xs text-gray-400">Haz clic en "Mostrar todos" para limpiar</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfluencerId(null)}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {/* Columna derecha: listado de tours */}
        <main className="md:col-span-2 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTours.length > 0 ? (
              filteredTours.map((t) => (
                <div key={t.id} className="relative">
                  {/* Si el tour pertenece al influencer seleccionado, destacarlo */}
                  <div className={`${t.influencer?.id === selectedInfluencerId ? "ring-2 ring-indigo-300 rounded-xl p-1" : ""}`}>
                    <TourCard
                      tour={t}
                      onSelect={() => setSelectedTour(t)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-4">⚠️ No se encontraron recorridos con estos filtros</p>
            )}
          </div>
        </main>
      </div>

      {/* Modal: crear tour */}
      <CreateTourModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(newTour) => {
          setTours((t) => {
            const updated = [newTour, ...t];
            setFilteredTours(updated);
            return updated;
          });
        }}
        packages={packages}
      />

      {/* Modal de detalle */}
      <TourDetailModal
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
        onReserve={(tour) => {
          setSelectedTour(null);
          setReservation(tour);

          // Mock: confirmación visual
          setTimeout(() => {
            alert(`✅ Reserva confirmada para: ${tour.title}`);
            setReservation(null);
          }, 500);
        }}
      />
    </div>
  );
}
