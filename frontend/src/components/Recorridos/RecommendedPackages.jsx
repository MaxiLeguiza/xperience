// RecommendedPackages.jsx
// -------------------------------------------------------------
// Slider automático que muestra paquetes recomendados.
// Cambia de paquete cada 3 segundos.
// -------------------------------------------------------------

// RecommendedPackages.jsx
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

  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="card p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">📦 Paquetes recomendados</h3>

      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {packages.map((p) => (
            <div key={p.id} className="min-w-full flex-shrink-0 p-2">
              <button
                onClick={() => onSelect(p)}
                className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left hover:shadow-md transition"
              >
                <h4 className="text-xl font-bold">{p.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  {p.price && (
                    <span className="text-2xl font-bold text-[#FF4500]">
                      ${p.price}
                    </span>
                  )}
                  <span className="text-sm font-medium text-[#FF4500] hover:underline">
                    Ver detalles
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
