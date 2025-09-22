// RecommendedPackages.jsx
// -------------------------------------------------------------
// Slider automático que muestra paquetes recomendados.
// Cambia de paquete cada 3 segundos.
// -------------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";

export default function RecommendedPackages({ packages, onSelect }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (packages.length === 0) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % packages.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [packages.length]);

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm h-full flex flex-col select-none">
      <h4 className="font-semibold mb-2">📦 Paquetes recomendados</h4>

      {packages.length > 0 && (
        <div className="relative w-full overflow-hidden flex-1">
          <div
            className="flex transition-transform duration-500 h-full"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {packages.map((p) => (
              <div key={p.id} className="min-w-full flex-shrink-0 p-4">
                <button
                  onClick={() => onSelect(p)}
                  className="w-full h-full border rounded-xl p-4 text-left bg-gray-50 hover:bg-gray-100"
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.description}</div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
