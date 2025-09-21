// TourRecorridos_App.jsx
// Componente principal con mocks y preparado para conectar con Nest + Mongo
// Todos los comentarios en español para guiarte

import React, { useEffect, useState, useRef } from "react";

// ------------------ Función utilitaria para mostrar duración ------------------
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

// ------------------ Tarjeta de Tour ------------------
function TourCard({ tour, onSelect }) {
  return (
    <div
      className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white"
      onClick={() => onSelect(tour)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          <p className="text-sm text-gray-500">Autor: {tour.author}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Duración</div>
          <div className="font-medium">
            {formatDuration(tour.durationMinutes)}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Paquete: {tour.packageName || "—"}
        </div>
        <div className="text-lg font-bold">${tour.price}</div>
      </div>
    </div>
  );
}

// ------------------ Filtros de búsqueda ------------------
function Filters({ filters, setFilters, applyFilters }) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Campo de búsqueda general */}
        <input
          placeholder="🔍 Buscar por título o autor"
          className="p-2 border rounded"
          value={filters.q}
          onChange={(e) =>
            setFilters((f) => ({ ...f, q: e.target.value }))
          }
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

// ------------------ Modal para crear nuevo Tour ------------------
function CreateTourModal({ open, onClose, onCreated, packages }) {
  // Estado local para manejar los valores del formulario
  const [form, setForm] = useState({
    title: "",
    author: "",
    durationMinutes: 60,
    price: 0,
    recommendedPackageId: "",
  });

  // Función que se ejecuta al enviar el formulario
  function submit(e) {
    e.preventDefault(); // evita que la página se recargue

    // Creamos un objeto con los datos del nuevo tour
    const newTour = {
      id: Date.now().toString(), // id único basado en la fecha
      title: form.title,
      author: form.author,
      durationMinutes: form.durationMinutes,
      price: form.price,
      // Si se seleccionó un paquete, se busca su título; si no, se pone "—"
      packageName:
        packages.find((p) => p.id === form.recommendedPackageId)?.title || "—",
    };

    onCreated(newTour); // avisamos al padre que se creó un tour
    onClose();          // cerramos el modal
  }

  // Si la prop "open" es false, no se renderiza nada
  if (!open) return null;

  return (
    // Overlay que cubre toda la pantalla
    // bg-white/30 = blanco semitransparente
    // backdrop-blur-sm = efecto vidrio (desenfoque)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/01 backdrop-bright"
      onClick={onClose} // si clickeamos fuera del modal, se cierra
    >
      {/* Contenedor del modal */}
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()} // evita que se cierre si clickeamos dentro
      >
        {/* Botón de cierre (X en la esquina) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ❌
        </button>

        {/* Título del modal */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-600">🆕</span> Crear nuevo recorrido
        </h2>

        {/* Formulario */}
        <form onSubmit={submit}>
          {/* Campo: Nombre del recorrido */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del recorrido
          </label>
          <input
            required
            placeholder="Ej: City Tour Nocturno"
            className="p-2 border rounded mb-3 w-full"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />

          {/* Campo: Autor */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autor / Responsable
          </label>
          <input
            required
            placeholder="Ej: Juan Pérez"
            className="p-2 border rounded mb-3 w-full"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          />

          {/* Campo: Duración */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración en minutos
          </label>
          <input
            required
            type="number"
            placeholder="Ej: 90"
            className="p-2 border rounded mb-3 w-full"
            value={form.durationMinutes}
            onChange={(e) =>
              setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))
            }
          />

          {/* Campo: Precio */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio en pesos
          </label>
          <input
            required
            type="number"
            placeholder="Ej: 5000"
            className="p-2 border rounded mb-3 w-full"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: Number(e.target.value) }))
            }
          />

          {/* Campo: Selección de paquete */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar paquete recomendado
          </label>
          <select
            className="p-2 border rounded mb-4 w-full"
            value={form.recommendedPackageId}
            onChange={(e) =>
              setForm((f) => ({ ...f, recommendedPackageId: e.target.value }))
            }
          >
            <option value="">Ninguno</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            {/* Botón cancelar */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            {/* Botón guardar */}
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Guardar recorrido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------------------ Slider de paquetes recomendados ------------------
function RecommendedPackages({ packages, onSelect }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // Cambio automático de paquete cada 3 segundos
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

// ------------------ Componente principal ------------------
export default function TourRecorridos() {
  const [tours, setTours] = useState([]); // Lista de tours completa
  const [filteredTours, setFilteredTours] = useState([]); // Lista filtrada
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    priceMin: "",
    priceMax: "",
  });
  const [createOpen, setCreateOpen] = useState(false);

  // Cargar datos mock al inicio
  useEffect(() => {
    // 🔥 Backend: fetch("/api/tours")
    const mockTours = [
      {
        id: "t1",
        title: "City Tour",
        author: "Juan Pérez",
        durationMinutes: 120,
        price: 5000,
        packageName: "Paquete Básico",
      },
      {
        id: "t2",
        title: "Tour Histórico",
        author: "Ana Gómez",
        durationMinutes: 90,
        price: 3500,
        packageName: "Paquete Premium",
      },
    ];
    setTours(mockTours);
    setFilteredTours(mockTours);

    // 🔥 Backend: fetch("/api/packages/recommended")
    setPackages([
      { id: "p1", title: "Paquete Básico", description: "Recorridos esenciales" },
      { id: "p2", title: "Paquete Premium", description: "Experiencias con extras" },
    ]);
  }, []);

  // ------------------ Aplicar filtros ------------------
  function applyFilters() {
    console.log("Aplicar filtros (mock)", filters);

    // Filtramos tours en base a lo que el usuario escribe o selecciona
    const results = tours.filter((tour) => {
      // Filtro por texto: título o autor (case-insensitive)
      const matchText =
        filters.q === "" ||
        tour.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        tour.author.toLowerCase().includes(filters.q.toLowerCase());

      // Filtro por precio mínimo
      const matchPriceMin =
        filters.priceMin === "" || tour.price >= Number(filters.priceMin);

      // Filtro por precio máximo
      const matchPriceMax =
        filters.priceMax === "" || tour.price <= Number(filters.priceMax);

      return matchText && matchPriceMin && matchPriceMax;
    });

    setFilteredTours(results);
  }

  return (
    <div className="h-screen w-screen bg-gray-50 p-4 md:p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📋 Gestor de Recorridos</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
          onClick={() => setCreateOpen(true)}
        >
          + Nuevo recorrido
        </button>
      </header>

      {/* Layout general */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {/* Columna izquierda: filtros + paquetes */}
        <div className="flex flex-col space-y-4 overflow-y-auto">
          <Filters
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
          />
          <RecommendedPackages
            packages={packages}
            onSelect={(p) => console.log("Seleccionado", p)}
          />
        </div>

        {/* Columna derecha: listado de tours */}
        <main className="md:col-span-2 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTours.length > 0 ? (
              filteredTours.map((t) => (
                <TourCard
                  key={t.id}
                  tour={t}
                  onSelect={(tour) =>
                    console.log("Tour seleccionado", tour)
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 p-4">
                ⚠️ No se encontraron recorridos con estos filtros
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modal de creación */}
      <CreateTourModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(newTour) => {
          // Agregamos el nuevo tour y aplicamos filtros de nuevo
          setTours((t) => {
            const updated = [newTour, ...t];
            setFilteredTours(updated);
            return updated;
          });
        }}
        packages={packages}
      />
    </div>
  );
}
