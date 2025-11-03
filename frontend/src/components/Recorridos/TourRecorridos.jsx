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
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Influencers recomendados</h3>

      <div className="flex items-center gap-3 overflow-x-auto p-2 pr-6">
        {influencers.map((inf) => (
          <button
            key={inf.id}
            onClick={() => onSelect(inf)}
            className={`flex-shrink-0 w-40 p-3 rounded-xl border transition-transform transform hover:scale-[1.02] text-left flex gap-3 items-center ${selectedId === inf.id
                ? "ring-2 ring-indigo-400 border-indigo-200"
                : "border-gray-200"
              }`}
          >
            <img
              src={inf.avatar}
              alt={inf.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{inf.name}</p>
              <p className="text-xs text-gray-400 truncate">{inf.social}</p>
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

  // Datos de ejemplo para comentarios y puntuaciones
  const comments = [
    {
      user: "Carlos A.",
      rating: 4,
      text: "¡Una experiencia increíble! Muy recomendable.",
    },
    {
      user: "Ana L.",
      rating: 5,
      text: "Todo estuvo excelente, me encantó el recorrido.",
    },
    {
      user: "Juan P.",
      rating: 2,
      text: "No fue lo que esperaba, el guía no estaba tan preparado.",
    },
    {
      user: "Lucía M.",
      rating: 3,
      text: "Estuvo bien, pero podría mejorar en algunos aspectos.",
    },
  ];

  // Calcular la puntuación promedio
  const averageRating =
    comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length;

  // Calcular el porcentaje de cada calificación
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) =>
    comments.filter((comment) => comment.rating === rating).length
  );

  const totalVotes = comments.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        {/* Contenido scrollable */}
        <div className="p-6 overflow-y-auto mt-10 mb-4 px-6 space-y-6">
          <h1 className="text-4xl font-bold">{tour.title}</h1>
          <p className="text-gray-500">Autor: {tour.author}</p>
          <p className="text-gray-500">
            Duración: {tour.durationMinutes} min · {tour.distanceKm} km
          </p>
          <p className="text-gray-800 font-semibold">💲 {tour.price} ARS</p>

          {/* Carrusel de imágenes */}
          {/* Aquí iría el carrusel como te lo pasé antes */}

          <h3 className="text-black font-bold">Descripción:</h3>
          <p className="text-gray-600">{tour.description}</p>

          {/* Influencer */}
          {/* Aquí iría la sección de influencer */}

          {/* BOTÓN Reservar */}
          {/* Aquí iría el botón de reserva */}

          {/* Sección de Comentarios y Puntuaciones */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold">Comentarios y Puntuaciones</h3>

            {/* Puntuación promedio */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-semibold">Puntuación promedio:</span>
              <span className="text-xl text-yellow-500">
                {averageRating.toFixed(1)} ★
              </span>
            </div>

            {/* Distribución porcentual de las calificaciones */}
            <div className="mt-6">
              <h4 className="font-semibold">Distribución de las calificaciones</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage = (ratingCounts[rating - 1] / totalVotes) * 100;
                  return (
                    <div key={rating} className="flex items-center justify-between">
                      <span>{rating} Estrella(s)</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="bg-yellow-500 h-full rounded-full"
                        ></div>
                      </div>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulario de comentarios */}
            <form className="space-y-4 mt-6">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Escribe aquí tu experiencia..."
                rows="3"
              ></textarea>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label className="mr-2 text-sm">Calificación</label>
                  <div className="flex flex-row-reverse gap-1 text-2xl text-gray-300">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <React.Fragment key={rating}>
                        <input
                          id={`star${rating}`}
                          type="radio"
                          name="rating"
                          value={rating}
                          hidden
                        />
                        <label htmlFor={`star${rating}`} className="cursor-pointer">
                          ★
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Enviar
                </button>
              </div>
            </form>

            {/* Comentarios existentes */}
            <div className="mt-6 space-y-4 max-h-60 overflow-y-auto pr-2">
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src="https://via.placeholder.com/40"
                    className="w-10 h-10 rounded-full"
                    alt="Usuario"
                  />
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{comment.user}</p>
                      <span className="text-yellow-500 text-sm">
                        {"★".repeat(comment.rating)}{" "}
                        {"☆".repeat(5 - comment.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  const [filters, setFilters] = useState({
    q: "",
    priceMin: "",
    priceMax: "",
    sortPriceAsc: false,
  });
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
        influencer: {
          id: "i1",
          name: "Luisito Comunica",
          avatar:
            "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj",
          social: "@luisitocomunica",
        },
      },
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
        influencer: {
          id: "i1",
          name: "Luisito Comunica",
          avatar:
            "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj",
          social: "@luisitocomunica",
        },
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
        influencer: {
          id: "i2",
          name: "Drew Binsky",
          avatar:
            "https://yt3.googleusercontent.com/VCZmgTUILsHKyibr4m9W-bYkDhWPZtjcq3cksdTgtM3iVDMqHnXh0_M5hQoXLlFHRBeK9q7I=s160-c-k-c0x00ffffff-no-rj",
          social: "@drewbinsky",
        },
      },
      {
        id: "t3",
        title: "Escapada a la playa",
        author: "María Luna",
        durationMinutes: 180,
        distanceKm: 40,
        price: 8000,
        description: "Relax total en playas paradisíacas.",
        influencer: {
          id: "i1",
          name: "Luisito Comunica",
          avatar:
            "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj",
          social: "@luisitocomunica",
        },
      },
    ];

    setTours(mockTours);
    setFilteredTours(mockTours);

    setPackages([
      {
        id: "p1",
        title: "Paquete Básico",
        description: "Recorridos esenciales",
      },
      {
        id: "p2",
        title: "Paquete Premium",
        description: "Experiencias con extras",
      },
    ]);

    setInfluencers([
      {
        id: "i1",
        name: "Luisito Comunica",
        avatar:
          "https://yt3.googleusercontent.com/ytc/AIdro_nyXrAAt-FJ5azOAUoNd5Iw0aGQb-_b-SLSOkW0B_N2md4=s160-c-k-c0x00ffffff-no-rj",
        social: "@luisitocomunica",
      },
      {
        id: "i2",
        name: "Drew Binsky",
        avatar:
          "https://yt3.googleusercontent.com/VCZmgTUILsHKyibr4m9W-bYkDhWPZtjcq3cksdTgtM3iVDMqHnXh0_M5hQoXLlFHRBeK9q7I=s160-c-k-c0x00ffffff-no-rj",
        social: "@drewbinsky",
      },
      {
        id: "i3",
        name: "Charly Sinewan",
        avatar:
          "https://yt3.googleusercontent.com/XJLr0QWEyjktFrSi9HXh7GxUYAB3kMHlsy81uxxPofqwk3iD03WeYDTEq3e5t11ncdi8uEEyWA=s160-c-k-c0x00ffffff-no-rj",
        social: "@charlysinewan",
      },
    ]);
  }, []);

  // ------------------ Aplicar filtros (ahora incluye influencer) ------------------
  function applyFilters() {
    let results = tours.filter((tour) => {
      const matchText =
        filters.q === "" ||
        tour.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        tour.author.toLowerCase().includes(filters.q.toLowerCase());

      const matchPriceMin =
        filters.priceMin === "" || tour.price >= Number(filters.priceMin);
      const matchPriceMax =
        filters.priceMax === "" || tour.price <= Number(filters.priceMax);

      // Filtrado por influencer si hay uno seleccionado
      const matchInfluencer =
        !selectedInfluencerId ||
        (tour.influencer && tour.influencer.id === selectedInfluencerId);

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestor de Recorridos
            </h1>
            <button
              className="btn-primary px-4 py-2 rounded-md text-sm font-medium flex items-center bg-[#FF4500] text-white hover:bg-[#E03E00]"
              onClick={() => setCreateOpen(true)}
            >
              <span className="material-icons mr-2">add</span>+ Nuevo recorrido
            </button>
          </div>
        </div>
      </header>

      {/* Layout general */}
      <div className="flex-grow max-w-full mx-auto px-4 sm:px-6 lg:px-1q py-2 w-full">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {/* Columna izquierda: filtros + paquetes + influencers (re-sumado) */}
          <div className="flex flex-col  space-y-8 overflow-y-auto">

            <Filters
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
            />

            <RecommendedPackages
              packages={packages}
              onSelect={(p) => console.log("Paquete seleccionado", p)}
            />

            {/* Influencers: componente inline */}
            <RecommendedInfluencers
              influencers={influencers}
              onSelect={(inf) => setSelectedInfluencerId(inf ? inf.id : null)}
              selectedId={selectedInfluencerId}
            />
          </div>

          {/* Columna derecha: listado de tours
            - Con esto puedo space-y-6 h-[calc(100vh-8rem)] hacer scroll en el listado unicamente 
          */}
          <main className="md:col-span-2 space-y-6 h-[calc(100vh-8rem)]  overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              {filteredTours.length > 0 ? (
                filteredTours.map((t) => (
                  <div key={t.id} className="relative">
                    <div
                      className={`${t.influencer?.id === selectedInfluencerId
                          ? "ring-2 ring-indigo-300 rounded-xl p-1"
                          : ""
                        }`}
                    >
                      <TourCard tour={t} onSelect={() => setSelectedTour(t)} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  ⚠️ No se encontraron recorridos con estos filtros
                </p>
              )}
            </div>
          </main>
        </div>
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
