// CreateTourModal.jsx
// -------------------------------------------------------------
// Permite crear actividades individuales (SOLO PARA USUARIOS BÁSICOS).
// No guarda en BD - solo comparte por WhatsApp.
// Detecta país automáticamente y permite seleccionar manualmente.
// Formatea mensaje de forma estética para WhatsApp.
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";

// Constante para limitar las imágenes
const MAX_IMAGES = 5;

// 🔥 NUEVO: Diccionario de códigos de país
const COUNTRY_CODES = {
  "Argentina": "+54",
  "Chile": "+56",
  "Uruguay": "+598",
  "Paraguay": "+595",
  "Brasil": "+55",
  "Colombia": "+57",
  "Perú": "+51",
  "Bolivia": "+591",
  "Ecuador": "+593",
  "Venezuela": "+58",
  "Mexico": "+52",
  "España": "+34",
  "USA": "+1",
  "Otros": "+"
};

const COUNTRY_LIST = Object.keys(COUNTRY_CODES);

// 🔥 NUEVO: Detectar país por número de teléfono
function detectCountryByPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.startsWith("54")) return "Argentina";
  if (cleaned.startsWith("56")) return "Chile";
  if (cleaned.startsWith("598")) return "Uruguay";
  if (cleaned.startsWith("595")) return "Paraguay";
  if (cleaned.startsWith("55")) return "Brasil";
  if (cleaned.startsWith("57")) return "Colombia";
  if (cleaned.startsWith("51")) return "Perú";
  if (cleaned.startsWith("591")) return "Bolivia";
  if (cleaned.startsWith("593")) return "Ecuador";
  if (cleaned.startsWith("58")) return "Venezuela";
  if (cleaned.startsWith("52")) return "Mexico";
  if (cleaned.startsWith("34")) return "España";
  if (cleaned.startsWith("1")) return "USA";
  
  return null;
}

// 🔥 NUEVO: Modal para compartir por WhatsApp (usa teléfono del usuario)
function WhatsAppShareModal({ open, onClose, tourData, currentUser }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    // Obtener el teléfono del usuario conectado
    const userPhone = currentUser?.telefono || currentUser?.phone || currentUser?.phoneNumber;

    if (!userPhone) {
      alert("No tenemos tu número de teléfono. Por favor, actualiza tu perfil primero.");
      return;
    }

    const cleaned = userPhone.replace(/\D/g, "");
    
    // Detectar país automáticamente
    let countryCode = "+54"; // Default Argentina
    if (cleaned.startsWith("54")) countryCode = "+54";
    else if (cleaned.startsWith("56")) countryCode = "+56";
    else if (cleaned.startsWith("598")) countryCode = "+598";
    else if (cleaned.startsWith("595")) countryCode = "+595";
    else if (cleaned.startsWith("55")) countryCode = "+55";
    else if (cleaned.startsWith("57")) countryCode = "+57";
    else if (cleaned.startsWith("51")) countryCode = "+51";
    else if (cleaned.startsWith("34")) countryCode = "+34";
    else if (cleaned.startsWith("1")) countryCode = "+1";

    const fullPhone = countryCode === "+1" || cleaned.startsWith(countryCode.replace("+", ""))
      ? cleaned
      : countryCode.replace("+", "") + cleaned;

    // 🔥 Formatear mensaje estético
    const isPackage = tourData.isPackage;
    
    let message = "";
    
    if (isPackage && tourData.includedTours && tourData.includedTours.length > 0) {
      // Mensaje para paquete
      const toursList = tourData.includedTours.map((tourId, idx) => `${idx + 1}. ${tourId}`).join("\n");
      message = `
📦 *Paquete: ${tourData.title}*

📝 ${tourData.description}

💰 Precio Total: $${tourData.price}

🎯 *Actividades Incluidas:*
${toursList}

👤 Creado por: ${tourData.author}

🔗 Descarga nuestra app: https://xperience-tours.com

¡Comparte este increíble paquete con amigos! 🎉✨
      `.trim();
    } else {
      // Mensaje para actividad individual
      const waypointsText = tourData.waypoints && tourData.waypoints.length > 0
        ? tourData.waypoints.map((wp, idx) => `${idx + 1}. ${wp.name} (${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)})`).join("\n")
        : "Sin waypoints especificados";

      message = `
📍 *Ruta: ${tourData.title}*

📝 ${tourData.description}

💰 Precio: $${tourData.price}

🛤️ *Paradas del Recorrido:*
${waypointsText}

👤 Creado por: ${tourData.author}

🔗 Descarga nuestra app: https://xperience-tours.com

¡Comparte esta increíble ruta con amigos! 🗺️✨
      `.trim();
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;

    setIsSharing(true);
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setIsSharing(false);
      onClose();
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-slate-900 rounded-[24px] border border-slate-800 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-1">Compartir por WhatsApp</h3>
        <p className="text-sm text-slate-400 mb-6">Se enviará a tu número registrado</p>

        <div className="space-y-4">
          {/* Resumen de lo que se enviará */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Detalles a compartir:</p>
            <div className="space-y-1 text-sm text-slate-200">
              <p><span className="text-orange-400 font-bold">Título:</span> {tourData?.title}</p>
              <p><span className="text-orange-400 font-bold">Tipo:</span> {tourData?.isPackage ? "Paquete" : "Ruta Individual"}</p>
              <p><span className="text-orange-400 font-bold">Precio:</span> ${tourData?.price}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSharing}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSharing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Abriendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-5.038 5.55-5.038 9.176 0 3.072.60 6.057 1.706 8.622l-1.828 6.695 6.868-1.802c2.536 1.423 5.467 2.37 8.382 2.37 3.072 0 6.057-.6 8.622-1.706l6.695 1.828-1.802-6.868c1.424-2.537 2.369-5.467 2.369-8.382 0-9.289-7.521-16.81-16.81-16.81zm0 0" /></svg>
                  Compartir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateTourModal({ open, onClose, onCreated, packages, existingTours = [], currentUser }) {
  // 🔥 NUEVO: Verificar si es usuario básico
  const isBasicUser = currentUser?.role === "user";

  // Estado para el modal de WhatsApp
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [pendingTourData, setPendingTourData] = useState(null);

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

  // 🔥 NUEVO: Si es agencia, no permitir abrir
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
    
    // 🔥 ACTUALIZADO: Para usuarios básicos, preparar datos para WhatsApp
    // No guardar en BD, solo enviar por WhatsApp
    
    let uploadedImageUrls = [];
    const defaultImagesArray = ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"];

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

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

    // 🔥 NUEVO: Preparar datos para WhatsApp (sin guardar en BD)
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

    setPendingTourData(tourData);
    setWhatsappModalOpen(true);
    setIsUploading(false);
  }

  if (!open || !isBasicUser) return null;

  return (
    <>
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
            <p className="text-sm text-slate-400 mt-2">Comparte tu recorrido favorito por WhatsApp.</p>
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

            {/* Info */}
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-2xl p-4">
              <p className="text-xs text-blue-300">
                💡 <strong>Nota:</strong> Tu ruta será compartida por WhatsApp. No se guardará en nuestra base de datos.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-800/70">
              <button type="button" onClick={onClose} disabled={isUploading} className="px-6 py-3 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={isUploading} className="px-8 py-3 rounded-full bg-orange-500 text-slate-950 text-sm font-bold hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-wait flex items-center gap-2">
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Preparando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-5.038 5.55-5.038 9.176 0 3.072.60 6.057 1.706 8.622l-1.828 6.695 6.868-1.802c2.536 1.423 5.467 2.37 8.382 2.37 3.072 0 6.057-.6 8.622-1.706l6.695 1.828-1.802-6.868c1.424-2.537 2.369-5.467 2.369-8.382 0-9.289-7.521-16.81-16.81-16.81zm0 0" /></svg>
                    Compartir por WhatsApp
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de WhatsApp */}
      <WhatsAppShareModal 
        open={whatsappModalOpen}
        onClose={() => {
          setWhatsappModalOpen(false);
          setPendingTourData(null);
          onClose();
        }}
        tourData={pendingTourData}
        currentUser={currentUser}
      />
    </>
  );
}