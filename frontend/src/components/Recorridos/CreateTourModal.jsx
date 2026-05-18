// CreateTourModal.jsx
// -------------------------------------------------------------
// Permite crear actividades individuales o armar PAQUETES.
// AHORA: Detecta si el usuario es influencer o normal para etiquetar.
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";

export default function CreateTourModal({ open, onClose, onCreated, packages, existingTours = [], currentUser }) {
  // Estado para saber qué estamos creando
  const [creationType, setCreationType] = useState("actividad"); // 'actividad' | 'paquete'

  const [form, setForm] = useState({
    title: "",
    author: "",
    durationMinutes: 0,
    distanceKm: 0,
    price: 0,
    recommendedPackageId: "",
    allowMultiRoute: true,
    selectedToursForPackage: [] // Guarda los IDs de las actividades unidas
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: "", 
        author: currentUser?.nombre || currentUser?.name || "", // Pre-cargamos el nombre del usuario
        durationMinutes: 0, 
        distanceKm: 0,
        price: 0, 
        recommendedPackageId: "", 
        allowMultiRoute: true,
        selectedToursForPackage: []
      });
      setCreationType("actividad");
    }
  }, [open, currentUser]);

  // Manejar selección de múltiples actividades para el paquete
  const toggleTourSelection = (tourId) => {
    setForm(prev => {
      const isSelected = prev.selectedToursForPackage.includes(tourId);
      return {
        ...prev,
        selectedToursForPackage: isSelected 
          ? prev.selectedToursForPackage.filter(id => id !== tourId) 
          : [...prev.selectedToursForPackage, tourId]
      };
    });
  };

  function submit(e) {
    e.preventDefault();
    const duration = form.durationMinutes || Math.round(form.distanceKm * 12);
    
    // 🔥 LÓGICA DE ROLES (Simulando MongoDB)
    // Verificamos si el usuario actual tiene rol de influencer
    const isInfluencer = currentUser?.role === 'influencer';
    
    // Si es influencer, armamos su objeto de etiqueta. Si no, va nulo (Guía local)
    const influencerData = isInfluencer ? {
        id: currentUser?.id || "infl-new",
        name: currentUser?.nombre || currentUser?.name || "Influencer",
        avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        social: currentUser?.social || "@creador"
    } : null;

    const newTourOrPackage = {
      id: Date.now().toString(),
      title: form.title,
      author: form.author,
      durationMinutes: duration,
      distanceKm: form.distanceKm,
      price: form.price,
      allowMultiRoute: form.allowMultiRoute,
      isPackage: creationType === "paquete", 
      includedTours: form.selectedToursForPackage, 
      packageName: packages?.find((p) => p.id === form.recommendedPackageId)?.title || "—",
      influencer: influencerData, // 🔥 Asignamos la etiqueta generada
      rating: 5.0, // Los nuevos arrancan con 5 estrellas en esta simulación
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" 
    };

    onCreated(newTourOrPackage);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all" onClick={onClose}>
      <div className="w-full max-w-lg bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl shadow-black/50 relative overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full z-20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            Gestor de Rutas
          </h2>
          <p className="text-sm text-slate-400 mt-2">Crea una actividad individual o une varias en un paquete.</p>
        </div>

        {/* 🔥 TABS: Seleccionar qué crear */}
        <div className="flex bg-slate-950/50 p-1 rounded-xl mb-6 flex-shrink-0">
          <button 
            onClick={() => setCreationType("actividad")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${creationType === "actividad" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            Nueva Actividad
          </button>
          <button 
            onClick={() => setCreationType("paquete")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${creationType === "paquete" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            Armar Paquete Múltiple
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto no-scrollbar space-y-5 relative z-10 pr-2">
          
          {/* Campos Generales */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Nombre del {creationType}</label>
            <input required placeholder={creationType === "paquete" ? "Ej: Paquete Extremo Mendoza" : "Ej: City Tour Nocturno"} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Creador / Guía</label>
              <input required placeholder="Ej: Juan Pérez" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Precio (ARS)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input required type="number" min="0" placeholder="5000" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-8 pr-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
              </div>
            </div>
          </div>

          {/* 🔥 SECCIÓN EXCLUSIVA DE PAQUETES */}
          {creationType === "paquete" && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
              <label className="block text-xs font-bold tracking-wider text-orange-400 uppercase mb-3">Seleccionar Actividades a Unir</label>
              
              <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2 mb-3">
                {existingTours.filter(t => !t.isPackage).map(tour => (
                  <label key={tour.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-700">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-orange-500 rounded bg-slate-900 border-slate-700"
                      checked={form.selectedToursForPackage.includes(tour.id)}
                      onChange={() => toggleTourSelection(tour.id)}
                    />
                    <img src={tour.image || tour.image2} alt="" className="w-8 h-8 rounded-md object-cover" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-200 truncate">{tour.title}</p>
                      <p className="text-[10px] text-slate-500">${tour.price}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* 🔥 MEJORA: Ayuda para cargar actividad inexistente */}
              <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-slate-400">¿Falta alguna actividad en la lista?</span>
                <button type="button" onClick={() => setCreationType("actividad")} className="text-[10px] font-bold text-orange-400 hover:text-orange-300">
                  + Crear nueva actividad
                </button>
              </div>

            </div>
          )}

          {/* SECCIÓN EXCLUSIVA DE ACTIVIDAD */}
          {creationType === "actividad" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Distancia (km)</label>
                  <input type="number" min="0" step="0.1" placeholder="Ej: 10" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.distanceKm || ""} onChange={(e) => setForm((f) => ({ ...f, distanceKm: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Minutos</label>
                  <input type="number" min="0" placeholder="Ej: 90" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.durationMinutes || ""} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))} />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-100">Permitir unir con otras rutas</p>
                  <p className="text-xs text-slate-500">Deja que los usuarios lo añadan a su itinerario.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={form.allowMultiRoute} onChange={(e) => setForm(f => ({...f, allowMultiRoute: e.target.checked}))} />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-800/70">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Cancelar</button>
            <button type="submit" className="px-8 py-3 rounded-full bg-orange-500 text-slate-950 text-sm font-bold hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              {creationType === "paquete" ? "Crear Paquete" : "Crear Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}