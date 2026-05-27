// AdvancedTourManager.jsx
// 🔥 VERSIÓN MEJORADA CON CLOUDINARY Y BACKEND
// -------------------------------------------------
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import MapSelectorModal from "./MapSelectorModal";
import { useCloudinary } from "../../hooks/useCloudinary";
import { useAuth } from "../../hooks/useAuth";
import {
    ArrowLeft, ImagePlus, Save, MapPin, Plus, Trash2, GripVertical, UserPlus, Loader, AlertCircle, Check
} from "lucide-react";
import axios from "axios";

export default function AdvancedTourManager() {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { uploadMultiple, uploading: cloudinaryUploading, error: cloudinaryError } = useCloudinary();
    const fileInputRef = useRef(null);

    // 🔥 ESTADOS
    const [form, setForm] = useState({
        title: "",
        category: "Trekking",
        price: "",
        capacity: 10,
        difficulty: "media",
        description: "",
        influencerId: "none",
        durationMinutes: "",
        distanceKm: "",
    });

    const [waypoints, setWaypoints] = useState([
        { id: 1, name: "Punto de encuentro", lat: -32.8895, lng: -68.8458 }
    ]);

    const [images, setImages] = useState([]); // URLs de Cloudinary
    const [localFiles, setLocalFiles] = useState([]); // Files locales para preview
    const [myInfluencers, setMyInfluencers] = useState([]);
    const [influencersLoading, setInfluencersLoading] = useState(false);
    const [influencersError, setInfluencersError] = useState(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [editingWaypointId, setEditingWaypointId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // 🔥 NUEVO: Cargar influencers directamente de la base de datos
    useEffect(() => {
        const fetchInfluencers = async () => {
            setInfluencersLoading(true);
            setInfluencersError(null);
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const token = localStorage.getItem("token");

                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // Intento 1: Buscar en una ruta dedicada a influencers (si existe)
                let raw = [];
                try {
                    const response = await axios.get(`${API_URL}/api/influencers`, { headers });
                    raw = response.data;
                } catch (e) {
                    // Intento 2: Si falla, buscar en la ruta de usuarios y filtrar
                    try {
                        const response = await axios.get(`${API_URL}/api/user`, { headers });
                        raw = Array.isArray(response.data) ? response.data.filter(u => u.role === 'influencer') : response.data;
                    } catch (e2) {
                        throw e2;
                    }
                }

                // Si la respuesta viene envuelta (por ejemplo { data: [...], total: 10 } o { users: [...] }) manejarlo
                let data = raw;
                if (raw && typeof raw === 'object') {
                    if (Array.isArray(raw.data)) data = raw.data;
                    else if (Array.isArray(raw.users)) data = raw.users;
                    else if (Array.isArray(raw.docs)) data = raw.docs;
                }

                // Normalizar los datos recibidos
                const influencersData = (Array.isArray(data) ? data : []).map(inf => ({
                    id: String(inf._id || inf.id || inf._id_str || ''),
                    name: inf.nombre || inf.name || inf.username || 'Sin nombre',
                    avatar: inf.avatar || inf.imagen || inf.photo || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
                    social: inf.social || `@${(inf.nombre || inf.name || inf.username || '').toLowerCase().replace(/\s/g, '')}`
                }));

                setMyInfluencers(influencersData);
            } catch (error) {
                console.error("Error definitivo cargando influencers desde BD", error);
                setMyInfluencers([]);
                setInfluencersError(error.message || 'Error cargando influencers');
            } finally {
                setInfluencersLoading(false);
            }
        };

        fetchInfluencers();
    }, []);

    // 🔥 MANEJO DE IMÁGENES
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // Validar tamaño
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length) {
            setMessage({ type: "error", text: `${oversized.length} archivo(s) supera el límite de 5MB` });
            return;
        }

        try {
            const urls = await uploadMultiple(files);
            setImages([...images, ...urls]);
            setLocalFiles([]);
            setMessage({ type: "success", text: `Cantidad de imagenes cargadas: ${urls.length} ` });
            fileInputRef.current.value = "";
        } catch (err) {
            setMessage({ type: "error", text: cloudinaryError || "Error al subir imágenes" });
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // 🔥 MANEJO DE WAYPOINTS
    const addWaypoint = () => {
        setWaypoints([...waypoints, { id: Date.now(), name: "Nueva Parada", lat: 0, lng: 0 }]);
    };

    const removeWaypoint = (id) => {
        if (waypoints.length > 1) {
            setWaypoints(waypoints.filter(wp => wp.id !== id));
        }
    };

    const handleMapConfirm = (pos) => {
        setWaypoints(waypoints.map(wp => wp.id === editingWaypointId ? { ...wp, lat: pos.lat, lng: pos.lng } : wp));
        setIsMapOpen(false);
    };

    // 🔥 GUARDAR EN BACKEND
    const handleSave = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!form.title.trim()) {
            setMessage({ type: "error", text: "El título es requerido" });
            return;
        }
        if (!form.description.trim()) {
            setMessage({ type: "error", text: "La descripción es requerida" });
            return;
        }
        if (!form.price || form.price <= 0) {
            setMessage({ type: "error", text: "Ingresa un precio válido" });
            return;
        }
        if (images.length === 0) {
            setMessage({ type: "error", text: "Debes subir al menos una imagen" });
            return;
        }
        if (waypoints.some(wp => wp.lat === 0 && wp.lng === 0)) {
            setMessage({ type: "error", text: "Todos los waypoints deben tener coordenadas. Usa el mapa para marcar." });
            return;
        }

        setSaving(true);
        setMessage({ type: "info", text: "Guardando ruta en el servidor..." });

        try {
            // Buscamos el objeto completo del influencer seleccionado
            const selectedInfluencer = myInfluencers.find(inf => inf.id === form.influencerId);

            const payload = {
                name: form.title,
                title: form.title,
                category: form.category,
                difficulty: form.difficulty,
                price: parseFloat(form.price),
                capacity: parseInt(form.capacity),
                durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
                distanceKm: form.distanceKm ? parseFloat(form.distanceKm) : null,
                description: form.description,
                images: images,
                waypoints: waypoints,
                location: waypoints[0], // Primera parada como ubicación principal
                rating: 5,
                author: auth?.nombre || auth?.user?.nombre || "Agencia",
                authorId: auth?.id || auth?.user?.id || "",
                role: auth?.role || "agencia",
                influencerId: selectedInfluencer ? selectedInfluencer.id : undefined,

                // 🔥 ENVIAMOS TAMBIÉN EL OBJETO INFLUENCER COMPLETO PARA QUE QUEDE EN LA BD
                influencer: selectedInfluencer ? {
                    _id: selectedInfluencer.id,
                    name: selectedInfluencer.name,
                    avatar: selectedInfluencer.avatar,
                    social: selectedInfluencer.social
                } : undefined,

                isPackage: false,
                allowMultiRoute: true,
            };

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await axios.post(`${API_URL}/api/recorrido`, payload);

            setMessage({ type: "success", text: "¡Ruta creada exitosamente!" });
            setTimeout(() => navigate("/agencia/dashboard"), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Error al guardar la ruta";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <div className="flex-shrink-0 z-50"><Nav /></div>

            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-tight">Crear Ruta Profesional</h1>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || cloudinaryUploading}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                    >
                        {saving || cloudinaryUploading ? (
                            <><Loader className="w-4 h-4 animate-spin" /> Guardando...</>
                        ) : (
                            <><Save className="w-4 h-4" /> Publicar Ruta</>
                        )}
                    </button>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-6">

                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <h2 className="text-base font-black text-slate-800 mb-5">Información General</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Título de la actividad</label>
                                    <input type="text" placeholder="Ej: Expedición Cerro Aconcagua 3 Días" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Descripción detallada</label>
                                    <textarea rows="5" placeholder="Describe la experiencia, qué incluye y qué esperar..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <h2 className="text-base font-black text-slate-800 mb-5">Galería Visual</h2>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={cloudinaryUploading}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={cloudinaryUploading}
                                className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-orange-50/50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer group mb-4"
                            >
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {cloudinaryUploading ? (
                                        <Loader className="w-5 h-5 text-orange-500 animate-spin" />
                                    ) : (
                                        <ImagePlus className="w-5 h-5 text-orange-500" />
                                    )}
                                </div>
                                <p className="text-sm font-bold text-slate-700">
                                    {cloudinaryUploading ? "Realizando carga de imágenes..." : "Arrastra imágenes o haz clic aquí"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Sube fotos en alta resolución (Máx 5MB c/u)</p>
                            </button>

                            {images.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                                            <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white p-1.5 rounded-md text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-black text-slate-800">Itinerario y Paradas</h2>
                                <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-md uppercase tracking-wider">{waypoints.length} Puntos</span>
                            </div>
                            <div className="space-y-3">
                                {waypoints.map((wp, index) => (
                                    <div key={wp.id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                        <div className="cursor-grab text-slate-300 hover:text-slate-500"><GripVertical className="w-5 h-5" /></div>
                                        <div className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">{index + 1}</div>
                                        <div className="flex-1">
                                            <input type="text" placeholder="Nombre de la parada (Ej: Mirador Principal)" className="w-full bg-transparent border-none text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none" value={wp.name} onChange={(e) => {
                                                const newWp = [...waypoints];
                                                newWp[index].name = e.target.value;
                                                setWaypoints(newWp);
                                            }} />
                                        </div>
                                        <button onClick={() => { setEditingWaypointId(wp.id); setIsMapOpen(true); }} className="text-slate-400 hover:text-orange-500 p-2" title="Marcar en mapa"><MapPin className="w-4 h-4" /></button>
                                        <button onClick={() => removeWaypoint(wp.id)} className="text-slate-400 hover:text-rose-500 p-2" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addWaypoint} className="w-full mt-4 border border-dashed border-slate-300 text-slate-500 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Agregar nueva parada
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <h2 className="text-base font-black text-slate-800 mb-5">Configuración de Venta</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Precio (ARS)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                        <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 font-black focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Capacidad</label>
                                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Dificultad</label>
                                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                                            <option value="baja">Baja</option>
                                            <option value="media">Media</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Duración (minutos)</label>
                                        <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Distancia (km)</label>
                                        <input type="number" placeholder="0" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.distanceKm} onChange={e => setForm({ ...form, distanceKm: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Categoría Deportiva</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option>Trekking</option>
                                        <option>Senderismo</option>
                                        <option>Andinismo</option>
                                        <option>Escalada</option>
                                        <option>Escalada en Roca</option>
                                        <option>Montañismo</option>
                                        <option>Alta Montaña</option>
                                        <option>Parapente</option>
                                        <option>Paracaidismo</option>
                                        <option>Rafting</option>
                                        <option>Kayak</option>
                                        <option>Canotaje</option>
                                        <option>Hidrospeed</option>
                                        <option>Mountain Bike</option>
                                        <option>Ciclismo de Montaña</option>
                                        <option>Downhill</option>
                                        <option>Enduro</option>
                                        <option>Trail Running</option>
                                        <option>Running</option>
                                        <option>Cabalgatas</option>
                                        <option>Rappel</option>
                                        <option>Tirolesa</option>
                                        <option>Puenting</option>
                                        <option>4x4 Off Road</option>
                                        <option>Sandboard</option>
                                        <option>Esquí</option>
                                        <option>Snowboard</option>
                                        <option>Freeride</option>
                                        <option>Heliski</option>
                                        <option>Patinaje sobre Hielo</option>
                                        <option>Pesca Deportiva</option>
                                        <option>Caza Deportiva</option>
                                        <option>Safari Fotográfico</option>
                                        <option>Vuelo en Globo</option>
                                        <option>MotoCross</option>
                                        <option>ATV</option>
                                        <option>Cuatriciclos</option>
                                        <option>Supervivencia</option>
                                        <option>Campamento</option>
                                        <option>Astroturismo</option>
                                        <option>Termalismo</option>
                                        <option>Enoturismo</option>
                                        <option>Turismo Aventura</option>
                                        <option>Ecoturismo</option>
                                        <option>Turismo Rural</option>
                                        <option>Turismo Cultural</option>
                                        <option>Turismo Gastronómico</option>
                                        <option>Relax</option>
                                        <option>Wellness</option>
                                        <option>Lujo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <h2 className="text-base font-black text-slate-800 mb-2 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-orange-500" /> Patrocinio / Creador
                            </h2>
                            <p className="text-xs text-slate-500 mb-5">Asocia esta ruta a un influencer que colabore con tu agencia.</p>
                            <div>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                    value={influencersLoading ? "loading" : form.influencerId}
                                    onChange={e => setForm({ ...form, influencerId: e.target.value })}
                                    disabled={influencersLoading}
                                >
                                    {influencersLoading ? (
                                        <option value="loading">Cargando influencers...</option>
                                    ) : (
                                        <>
                                            <option value="none">Sin creador asociado</option>
                                            {influencersError && <option value="error" disabled>Error cargando influencers</option>}
                                            {(!influencersError && myInfluencers.length === 0) && <option value="none" disabled>No hay influencers registrados</option>}
                                            {myInfluencers.map(inf => (
                                                <option key={inf.id} value={inf.id}>Realizada por {inf.name}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <MapSelectorModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={handleMapConfirm}
            />

            {message.text && (
                <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                        message.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-700' :
                            'bg-blue-50 border border-blue-200 text-blue-700'
                    }`}>
                    {message.type === 'success' && <Check className="w-5 h-5 flex-shrink-0" />}
                    {message.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    {message.type === 'info' && <Loader className="w-5 h-5 flex-shrink-0 animate-spin" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}
        </div>
    );
}