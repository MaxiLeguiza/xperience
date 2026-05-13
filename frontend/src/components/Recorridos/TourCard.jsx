// TourCard.jsx
// -------------------------------------------------------------
// Tarjeta que muestra los datos de un recorrido (Diseño Premium Claro).
// Lógica intacta. UI/UX actualizada con sombras suaves, bordes redondeados y micro-interacciones.
// -------------------------------------------------------------
import React from "react";
import { useNavigate } from "react-router-dom";

// Función utilitaria para mostrar duración
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function TourCardHorizontal({ tour, onSelect }) {
  const navigate = useNavigate();

  const handleReservar = (e) => {
    e.stopPropagation();

    const normalizedTour = {
      id: tour.id,
      nombre: tour.title,
      precio: tour.price,
      capacidad: tour.capacity || 10,
      image: tour.image,
      durationMinutes: tour.durationMinutes,
      author: tour.author,
      influencer: tour.influencer,
    };

    navigate("/carrito", {
      state: {
        selectedItems: [normalizedTour],
      },
    });
  };

  return (
    <div
      onClick={() => onSelect(tour)}
      // Contenedor principal: Fondo blanco, bordes redondeados premium, sombra suave y efecto hover en grupo
      className="group bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden cursor-pointer"
    >
      {/* Imagen a la izquierda (con zoom sutil en hover) */}
      {tour.image && (
        <div className="sm:w-2/5 md:w-1/3 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Pequeño degradado oscuro abajo para que la imagen tenga profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Contenido a la derecha */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
        
        {/* Encabezado: título, autor y duración */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {tour.title}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Por: {tour.author}
            </p>
          </div>

          {/* Badge de Duración Premium */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-700 px-4 py-2 rounded-full flex-shrink-0">
            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold">{formatDuration(tour.durationMinutes)}</span>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="border-t border-slate-100 my-5"></div>

        <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
          {/* Influencer: Diseño en "píldora" */}
          <div className="w-full sm:w-auto">
            {tour.influencer && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recomendado por
                </p>
                <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2 pr-4 rounded-full w-max">
                  <img
                    src={tour.influencer.avatar}
                    alt={tour.influencer.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <span className="text-sm font-bold text-slate-800">
                    {tour.influencer.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Precio y Botón */}
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Precio</p>
              <p className="text-3xl font-black text-orange-500 leading-none">
                <span className="text-lg font-bold mr-1">$</span>
                {tour.price}
              </p>
            </div>
            
            <button
              onClick={handleReservar}
              // Botón rediseñado: Naranja de la marca, sombra de brillo, y animación al hacer hover
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              Reservar
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}