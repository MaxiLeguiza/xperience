// TourCard.jsx
// -------------------------------------------------------------
// Tarjeta que muestra los datos de un recorrido.
// Incluye: título, autor, precio, duración, paquete y datos del influencer.
// -------------------------------------------------------------

import React from "react";

// ------------------ Función utilitaria para mostrar duración ------------------
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function TourCard({ tour, onSelect }) {
  return (
    <div
      className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white"
      onClick={() => onSelect(tour)}
    >
      {/* Encabezado: título y duración */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          <p className="text-sm text-gray-500">Autor: {tour.author}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Duración</div>
          <div className="font-medium">
            {formatDuration(tour.durationMinutes)}
          </div>
        </div>
      </div>

      {/* Precio y paquete */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Paquete: {tour.packageName || "—"}
        </div>
        <div className="text-lg font-bold">${tour.price}</div>
      </div>

      {/* Influencer asociado */}
      {tour.influencer && (
        <div className="mt-4 flex items-center gap-3 border-t pt-3">
          <img
            src={tour.influencer.avatar}
            alt={tour.influencer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{tour.influencer.name}</div>
            <div className="text-sm text-gray-500">{tour.influencer.social}</div>
          </div>
        </div>
      )}
    </div>
  );
}
