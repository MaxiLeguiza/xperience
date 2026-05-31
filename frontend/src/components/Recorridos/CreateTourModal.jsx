import React, { useState, useEffect } from "react";

// Constante para limitar las imágenes
const MAX_IMAGES = 5;

export default function CreateTourModal({ open, onClose, onCreated, packages, existingTours = [], currentUser }) {
  // Verificar si es usuario básico
  const isBasicUser = currentUser?.role === "user";

  // Estado para saber qué estamos creando
  const [creationType, setCreationType] = useState("actividad"); // 'actividad' | 'paquete'

  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    durationMinutes: 0,
    distanceKm: 0,
    price: 0,
    recommendedPackageId: "",
    allowMultiRoute: true,
    selectedToursForPackage: []
  });

  // Estados para manejar MÚLTIPLES imágenes reales
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Si es agencia, no permitir abrir
  if (!isBasicUser && open) {
    return null;
  }

  useEffect(() => {
    if (open && isBasicUser) {
      setForm({
        title: "",
        description: "",
        author: currentUser?.nombre || currentUser?.name || "",
        durationMinutes: 0,
        distanceKm: 0,
        price: 0,
        recommendedPackageId: "",
        allowMultiRoute: true,
        selectedToursForPackage: []
      });
      setCreationType("actividad");
      setImageFiles([]);
      setImagePreviews([]);
      setIsUploading(false);
    }
  }, [open, currentUser, isBasicUser]);

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

  // Función para manejar la selección de MÚLTIPLES imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imageFiles.length + files.length;

    if (totalImages > MAX_IMAGES) {
      alert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
      e.target.value = null;
      return;
    }

    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Función para quitar una imagen específica de la lista antes de subir
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function submit(e) {
    e.preventDefault();
    setIsUploading(true);

    const duration = form.durationMinutes || Math.round(form.distanceKm * 12);
    
    let uploadedImageUrls = [];
    const defaultImagesArray = ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"];

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    // Subida de imágenes a Cloudinary (Mantenida intacta)
    if (imageFiles.length > 0 && uploadPreset && cloudName) {
      try {
        const uploadPromises = imageFiles.map(file => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);
          
          return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
          }).then(res => res.json()); 
        });

        const results = await Promise.all(uploadPromises);

        uploadedImageUrls = results
          .filter(data => data.secure_url)
          .map(data => data.secure_url);

      } catch (error) {
        console.error("Error subiendo imágenes a Cloudinary:", error);
      }
    }

    let finalImageUrls = [];

    if (uploadedImageUrls.length > 0) {
      finalImageUrls = uploadedImageUrls;
    } else if (imagePreviews.length > 0) {
      finalImageUrls = imagePreviews; 
    } else {
      finalImageUrls = defaultImagesArray;
    }

    // Armamos el objeto con la data final de la ruta
    const tourData = {
      title: form.title,
      description: form.description,
      author: form.author,
      durationMinutes: duration,
      distanceKm: form.distanceKm,
      price: form.price,
      images: finalImageUrls,
      waypoints: [],
      allowMultiRoute: form.allowMultiRoute,
      isPackage: creationType === "paquete",
      includedTours: form.selectedToursForPackage
    };

    // 🔥 NUEVO: Enviar datos al componente padre para guardar en BD
    try {
      if (onCreated) {
        await onCreated(tourData); // Esto debe comunicarse con tu endpoint POST en el padre
      }
      onClose(); // Cerramos el modal si la publicación fue exitosa
    } catch (error) {
      console.error("Error al publicar la ruta:", error);
      alert("Hubo un problema al guardar la ruta. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  }

  if (!open || !isBasicUser) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all" onClick={onClose}>
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
            Crear Mi Ruta
          </h2>
          <p className="text-sm text-slate-400 mt-2">Publica tu recorrido para que otros lo descubran.</p>
        </div>

        {/* TABS: Seleccionar qué crear */}
        <div className="flex bg-slate-950/50 p-1 rounded-xl mb-6 flex-shrink-0">
          <button 
            onClick={() => setCreationType("actividad")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${creationType === "actividad" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            Actividad Individual
          </button>
          <button 
            onClick={() => setCreationType("paquete")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${creationType === "paquete" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            Paquete de Rutas
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto no-scrollbar space-y-5 relative z-10 pr-2">
          
          {/* ZONA DE CARGA DE IMÁGENES */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
              Galería de Fotos ({imagePreviews.length}/{MAX_IMAGES})
            </label>
            
            {imagePreviews.length < MAX_IMAGES && (
              <div className="relative border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors cursor-pointer group mb-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-sm text-slate-300 font-medium">Haz clic o arrastra tus fotos</p>
                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG hasta 5MB por foto</p>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4 max-h-40 overflow-y-auto no-scrollbar p-1">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 group shadow-lg">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors shadow-xl"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nombre de la Ruta */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Nombre de la Ruta</label>
            <input required placeholder="Ej: Mi ruta favorita por el centro" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Descripción</label>
            <input required maxLength="100" placeholder="Ej: Disfruta de un atardecer inolvidable..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Creador y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Creador / Guía</label>
              <input required placeholder="Ej: Juan Pérez" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Precio Sugerido (ARS)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input type="number" min="0" placeholder="5000" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-8 pr-5 py-3.5 text-sm text-slate-100 outline-none focus:border-orange-500" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
              </div>
            </div>
          </div>

          {/* Distancia y Duración */}
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

          {/* SECCIÓN EXCLUSIVA DE PAQUETES */}
          {creationType === "paquete" && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
              <label className="block text-xs font-bold tracking-wider text-orange-400 uppercase mb-3">Seleccionar Rutas a Unir</label>
              
              <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2 mb-3">
                {existingTours.filter(t => !t.isPackage).length > 0 ? (
                  existingTours.filter(t => !t.isPackage).map(tour => (
                    <label key={tour.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-700">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-orange-500 rounded bg-slate-900 border-slate-700"
                        checked={form.selectedToursForPackage.includes(tour.id)}
                        onChange={() => toggleTourSelection(tour.id)}
                      />
                      <img src={tour.images?.[0] || tour.image2 || tour.image} alt="" className="w-8 h-8 rounded-md object-cover" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-slate-200 truncate">{tour.title}</p>
                        <p className="text-[10px] text-slate-500">${tour.price || "0"}</p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">Aún no hay rutas individuales. Crea una actividad primero.</p>
                )}
              </div>

              {form.selectedToursForPackage.length > 0 && (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-300">
                    <span className="font-bold text-orange-400">{form.selectedToursForPackage.length}</span> ruta{form.selectedToursForPackage.length !== 1 ? 's' : ''} seleccionada{form.selectedToursForPackage.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info Actualizada */}
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-2xl p-4">
            <p className="text-xs text-blue-300">
              💡 <strong>Nota:</strong> Tu ruta será publicada y visible en la sección de Recorridos.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-800/70">
            <button type="button" onClick={onClose} disabled={isUploading} className="px-6 py-3 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isUploading} className="px-8 py-3 rounded-full bg-orange-500 text-slate-950 text-sm font-bold hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] disabled:opacity-50 flex items-center gap-2">
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Publicando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Publicar Ruta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}