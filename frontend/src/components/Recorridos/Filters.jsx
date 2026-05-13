// Filters.jsx
// -------------------------------------------------------------
// Barra de filtros y búsqueda (Diseño Horizontal Premium / Flotante).
// Optimizado: Solo aplica la búsqueda al presionar "Aplicar".
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";

export default function Filters({ filters, setFilters, applyFilters }) {
  // 1. Estado local "borrador" para guardar los cambios mientras se escribe
  const [localFilters, setLocalFilters] = useState(filters);

  // 2. Efecto para sincronizar el estado si se reinician los filtros desde afuera
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleNumberChange = (key, value) => {
    const numberValue = value === "" ? "" : Number(value);
    setLocalFilters((f) => ({ ...f, [key]: numberValue }));
  };

  // 3. Función que transfiere el borrador al estado global solo al hacer clic
  const handleApplyClick = () => {
    setFilters(localFilters);
    // (Nota: como en tu TourRecorridos.jsx tienes un useEffect escuchando 'filters', 
    // al hacer setFilters aquí, la búsqueda se disparará sola).
  };

  // Opcional: Permitir aplicar filtros presionando la tecla "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyClick();
    }
  };

  return (
    // Contenedor principal: sticky para que flote, forma de píldora (rounded-full) en PC
    <section className="sticky top-0 z-30 bg-slate-700/90 backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl md:rounded-full p-2 md:p-3 w-full transition-all">
      <div className="flex flex-col md:flex-row items-center gap-3">
        
        {/* 1. Búsqueda por Título */}
        <div className="flex-1 w-full flex items-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-full px-4 py-2.5 border border-slate-100 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="title"
            type="text"
            placeholder="Buscar destino o actividad..."
            className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 ml-3"
            value={localFilters.q}
            onChange={(e) => setLocalFilters((f) => ({ ...f, q: e.target.value }))}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Separador vertical (solo PC) */}
        <div className="hidden md:block w-px h-8 bg-slate-200"></div>

        {/* 2. Rango de Precios */}
        <div className="w-full md:w-auto flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors rounded-full px-4 py-2.5 border border-slate-100 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
          <span className="text-sm font-bold text-slate-400 mr-2">$</span>
          <input
            type="number"
            placeholder="Mín"
            className="w-16 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={localFilters.priceMin || ""}
            onChange={(e) => handleNumberChange("priceMin", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="text-slate-300 mx-2">-</span>
          <input
            type="number"
            placeholder="Máx"
            className="w-16 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={localFilters.priceMax || ""}
            onChange={(e) => handleNumberChange("priceMax", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Separador vertical (solo PC) */}
        <div className="hidden md:block w-px h-8 bg-slate-200"></div>

        {/* 3. Ordenar por Precio (Toggle Switch en lugar de Checkbox) */}
        <label className="w-full md:w-auto flex items-center justify-between md:justify-center gap-3 cursor-pointer px-2 py-2 md:py-0">
          <span className="text-sm font-bold text-white whitespace-nowrap">
            Más baratos
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={localFilters.sortPriceAsc}
              onChange={(e) => setLocalFilters((f) => ({ ...f, sortPriceAsc: e.target.checked }))}
            />
            {/* Fondo del Toggle */}
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
          </div>
        </label>

        {/* 4. Botón Aplicar */}
        <button
          onClick={handleApplyClick}
          className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-6 rounded-full text-sm font-bold transition-colors whitespace-nowrap"
        >
          Aplicar
        </button>

      </div>
    </section>
  );
}