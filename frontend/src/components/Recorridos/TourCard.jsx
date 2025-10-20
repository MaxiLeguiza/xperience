// TourCard.jsx
// -------------------------------------------------------------
// Tarjeta que muestra los datos de un recorrido.
// Incluye: título, autor, precio, duración, paquete y datos del influencer.
// -------------------------------------------------------------
import React from "react";

// Función utilitaria para mostrar duración
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function TourCardHorizontal({ tour, onSelect }) {
  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden flex"
      onClick={() => onSelect(tour)}
    >
      {/* Imagen a la izquierda */}
      {tour.image && (
        <div className="w-1/3 flex-shrink-0">
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Contenido a la derecha */}
      <div className="p-6 flex flex-col justify-between flex-1">
        {/* Encabezado: título, autor y duración */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{tour.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Por: {tour.author}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500">Duración</p>
            <p className="font-bold">{formatDuration(tour.durationMinutes)}</p>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Influencer y precio */}
        <div className="flex justify-between items-center">
          {tour.influencer && (
            <div className="flex items-center space-x-2">
              <img
                src={tour.influencer.avatar}
                alt={tour.influencer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{tour.influencer.name}</span>
            </div>
          )}
          <p className="text-2xl font-bold text-[#FF4500]">${tour.price}</p>
        </div>
      </div>
    </div>
  );
}
