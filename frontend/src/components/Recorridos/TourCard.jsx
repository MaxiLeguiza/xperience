// TourCard.jsx
// -------------------------------------------------------------
// Tarjeta que muestra los datos de un recorrido (Diseño Premium Claro).
// Mejorado para coincidir exactamente con el diseño de la captura proporcionada.
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
      // Contenedor principal: Bordes súper redondeados (32px), sombra suave que crece al hacer hover
      className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden cursor-pointer w-full"
    >
      {/* Imagen a la izquierda: Ancho fijo para mantener la tarjeta mediana y armoniosa */}
      {tour.image && (
        <div className="w-full sm:w-[320px] flex-shrink-0 relative overflow-hidden min-h-[220px]">
          <img
            src={tour.image}
            alt={tour.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Degradado oscuro sutil abajo para dar profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Contenido a la derecha */}
      <div className="p-6 flex flex-col justify-between flex-1">
        
        <div>
          {/* Fila 1: Título y Duración */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">
              {tour.title}
            </h2>
            
            {/* Duración (Estilo texto con ícono naranja, como en la imagen) */}
            <div className="flex items-center gap-1.5 text-slate-500 flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold">{formatDuration(tour.durationMinutes)}</span>
            </div>
          </div>
          
          {/* Descripción de una oración */}
          {tour.description && (
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {tour.description}
            </p>
          )}

          {/* Autor (Naranja y Mayúsculas, como en la imagen) */}
          <p className="text-[11px] font-bold text-orange-500 mt-4 flex items-center gap-1.5 uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Por: {tour.author}
          </p>
        </div>

        {/* Fila Base: Influencer, Precio y Botón */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mt-6">
          
          {/* Bloque Influencer */}
          <div className="w-full sm:w-auto min-h-[40px]">
            {tour.influencer ? (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Recomendado por
                </p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-full w-max">
                  <img
                    src={tour.influencer.avatar}
                    alt={tour.influencer.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {tour.influencer.name}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Bloque Precio + Botón */}
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Precio</p>
              <p className="text-2xl font-black text-orange-500 leading-none">
                <span className="text-sm font-bold mr-0.5">$</span>
                {tour.price}
              </p>
            </div>
            
            <button
              onClick={handleReservar}
              // Botón "Reservar ->" exacto al de la captura
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:-translate-y-0.5 flex items-center gap-2 text-sm"
            >
              Reservar
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
        
      </div>
    </div>
  );
}