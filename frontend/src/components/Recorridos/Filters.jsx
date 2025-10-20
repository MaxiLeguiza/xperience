// Filters.jsx
// -------------------------------------------------------------
// Barra de filtros y búsqueda.
// Permite: buscar por texto, filtrar por rango de precios y ordenar por precio ascendente.
// -------------------------------------------------------------
// Filters.jsx
import React from "react";

export default function Filters({ filters, setFilters, applyFilters }) {
  const handleNumberChange = (key, value) => {
    const numberValue = value === "" ? "" : Number(value);
    setFilters((f) => ({ ...f, [key]: numberValue }));
  };

  return (
    <section className="card p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>

      {/* Campo título */}
      <div className="mb-4">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="title"
          type="text"
          placeholder="Buscar por título..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={filters.q}
          onChange={(e) =>
            setFilters((f) => ({ ...f, q: e.target.value }))
          }
        />
      </div>

      {/* Precio mínimo/máximo */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="priceMin" className="text-sm font-medium text-gray-700">
            Precio Mín.
          </label>
          <input
            id="priceMin"
            type="number"
            placeholder="$0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={filters.priceMin}
            onChange={(e) => handleNumberChange("priceMin", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="priceMax" className="text-sm font-medium text-gray-700">
            Precio Máx.
          </label>
          <input
            id="priceMax"
            type="number"
            placeholder="$1000"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={filters.priceMax}
            onChange={(e) => handleNumberChange("priceMax", e.target.value)}
          />
        </div>
      </div>

      {/* Ordenar por precio */}
      <div className="flex items-center mb-4">
        <input
          id="sortPriceAsc"
          type="checkbox"
          checked={filters.sortPriceAsc}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortPriceAsc: e.target.checked }))
          }
          className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="sortPriceAsc" className="ml-2 text-sm text-gray-700">
          Ordenar por precio (ascendente)
        </label>
      </div>

      {/* Botón aplicar */}
      <button
        onClick={applyFilters}
        className="w-full bg-[#FF4500] hover:bg-[#E03E00] text-white py-2 px-4 rounded-md text-sm font-medium"
      >
        Aplicar filtros
      </button>
    </section>
  );
}
