// CreateTourModal.jsx
// -------------------------------------------------------------
// Modal que permite crear un nuevo recorrido.
// Incluye: título, autor, duración, distancia, precio y paquete recomendado.
// Calcula la duración estimada si no se ingresa manualmente.
// -------------------------------------------------------------

import React, { useState } from "react";

export default function CreateTourModal({ open, onClose, onCreated, packages }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    durationMinutes: 0,
    distanceKm: 0,
    price: 0,
    recommendedPackageId: "",
  });

  function submit(e) {
    e.preventDefault();

    // Si no se ingresó duración, la calculamos en base a la distancia (5 km/h = 12 min/km aprox)
    const duration = form.durationMinutes || Math.round(form.distanceKm * 12);

    const newTour = {
      id: Date.now().toString(),
      title: form.title,
      author: form.author,
      durationMinutes: duration,
      distanceKm: form.distanceKm,
      price: form.price,
      packageName:
        packages.find((p) => p.id === form.recommendedPackageId)?.title || "—",
      influencer: {
        name: "Influencer Demo",
        avatar: "https://via.placeholder.com/50",
        social: "@demoInfluencer",
      },
    };

    onCreated(newTour);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ❌
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-600">🆕</span> Crear nuevo recorrido
        </h2>

        <form onSubmit={submit}>
          {/* Título */}
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

          {/* Autor */}
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

          {/* Distancia */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distancia (km)
          </label>
          <input
            type="number"
            placeholder="Ej: 10"
            className="p-2 border rounded mb-3 w-full"
            value={form.distanceKm}
            onChange={(e) =>
              setForm((f) => ({ ...f, distanceKm: Number(e.target.value) }))
            }
          />

          {/* Duración */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración en minutos (opcional)
          </label>
          <input
            type="number"
            placeholder="Ej: 90"
            className="p-2 border rounded mb-3 w-full"
            value={form.durationMinutes}
            onChange={(e) =>
              setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))
            }
          />

          {/* Precio */}
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

          {/* Selección de paquete */}
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

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
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
