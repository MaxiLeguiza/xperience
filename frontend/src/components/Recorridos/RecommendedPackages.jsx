// RecommendedPackages.jsx
// -------------------------------------------------------------
// Carrusel automático con los mejores recorridos (Top Rated).
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";

export default function RecommendedPackages({ tours = [], onSelectTour }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Filtramos los mejores recorridos (puedes ajustar la lógica de rating)
  // Como en el mock algunos no tienen rating, les asignamos uno alto por defecto para el ejemplo.
  const topTours = tours
    .filter(t => (t.rating || 5) >= 4.5)
    .slice(0, 5); // Tomamos los 5 mejores

  // 2. Lógica del carrusel automático (pasa cada 5 segundos)
  useEffect(() => {
    if (topTours.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === topTours.length - 1 ? 0 : prev + 1));
    }, 5000); // 5000ms = 5 segundos

    return () => clearInterval(interval);
  }, [topTours.length]);

  if (topTours.length === 0) return null;

  const currentTour = topTours[currentIndex];

  return (
    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex-shrink-0 relative overflow-hidden group">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          🔥 Top Recomendados
        </h3>
        {/* Indicadores (Puntitos) */}
        <div className="flex gap-1.5">
          {topTours.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Tarjeta del Carrusel */}
      <div 
        className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer shadow-inner"
        onClick={() => onSelectTour(currentTour)} // Abre el modal de detalles
      >
        {/* Imagen de fondo con transición suave */}
        <img 
          src={currentTour.image || currentTour.image2} 
          alt={currentTour.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Gradiente oscuro para que el texto sea legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

        {/* Contenido flotante sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end gap-2">
            <div>
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider mb-1 block">
                Selección Estrella
              </span>
              <h4 className="text-white font-bold text-base leading-tight line-clamp-2 shadow-sm">
                {currentTour.title}
              </h4>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30 text-white font-bold text-xs flex-shrink-0">
              ${currentTour.price}
            </div>
          </div>
        </div>
      </div>

      {/* Botón manual para ver */}
      <button 
        onClick={() => onSelectTour(currentTour)}
        className="w-full mt-4 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-100 font-bold py-2.5 rounded-xl transition-colors text-xs"
      >
        Ver detalles del recorrido
      </button>
    </div>
  );
}