// RecommendedInfluencers.jsx
// -------------------------------------------------------------
// Lista de influencers populares con su avatar y red social.
// -------------------------------------------------------------

// RecommendedInfluencers.jsx
import React, { useState } from "react";

export default function RecommendedInfluencers({ influencers, onSelect }) {
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const handleSelectInfluencer = (inf) => {
    setSelectedInfluencer(inf);
    if (onSelect) onSelect(inf);
  };

  return (
    <section className="card p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">🌟 Influencers recomendados</h3>

      {/* Listado dinámico */}
      <div className="space-y-4">
        {influencers.map((inf) => (
          <div
            key={inf.id}
            onClick={() => handleSelectInfluencer(inf)}
            className={`flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition ${
              selectedInfluencer?.id === inf.id
                ? "bg-gray-100 ring-1 ring-orange-400"
                : ""
            }`}
          >
            <img
              src={inf.avatar}
              alt={inf.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{inf.name}</p>
              <p className="text-xs text-gray-500">{inf.social}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón mostrar todos */}
      <button
        className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200"
        onClick={() => handleSelectInfluencer(null)}
      >
        Mostrar todos
      </button>
    </section>
  );
}
