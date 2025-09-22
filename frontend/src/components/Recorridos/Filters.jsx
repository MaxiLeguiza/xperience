// Filters.jsx
// -------------------------------------------------------------
// Barra de filtros y búsqueda.
// Permite: buscar por texto, filtrar por rango de precios y ordenar por precio ascendente.
// -------------------------------------------------------------

import React from "react";

export default function Filters({ filters, setFilters, applyFilters }) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Campo de búsqueda general */}
        <input
          placeholder="🔍 Buscar por título o autor"
          className="p-2 border rounded"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />

        {/* Precio mínimo */}
        <input
          type="number"
          placeholder="💲 Precio mínimo"
          className="p-2 border rounded"
          value={filters.priceMin}
          onChange={(e) =>
            setFilters((f) => ({ ...f, priceMin: e.target.value }))
          }
        />

        {/* Precio máximo */}
        <input
          type="number"
          placeholder="💲 Precio máximo"
          className="p-2 border rounded"
          value={filters.priceMax}
          onChange={(e) =>
            setFilters((f) => ({ ...f, priceMax: e.target.value }))
          }
        />
      </div>

      {/* Ordenar por precio */}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.sortPriceAsc}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortPriceAsc: e.target.checked }))
          }
        />
        <label className="text-sm text-gray-700">Ordenar por precio (ascendente)</label>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={applyFilters}
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
