// AdvancedTourManager.jsx
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import {
    ArrowLeft, ImagePlus, Save, MapPin, Plus, Trash2, GripVertical, UserPlus
} from "lucide-react";

export default function AdvancedTourManager() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        category: "Trekking",
        price: "",
        capacity: 10,
        difficulty: "media",
        description: "",
        influencerId: "none",
    });

    const [waypoints, setWaypoints] = useState([
        { id: 1, name: "Punto de encuentro", lat: "", lng: "" }
    ]);

    const [images, setImages] = useState([
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]);

    // 🔥 CORRECCIÓN: Leemos los influencers guardados desde localStorage
    const [myInfluencers, setMyInfluencers] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("agencyInfluencersDB");
        if (saved) {
            setMyInfluencers(JSON.parse(saved));
        } else {
            // Fallback si no hay nada guardado
            setMyInfluencers([
                { id: "infl-1", name: "Carlos Aventura" },
                { id: "infl-2", name: "Sofía Explora" }
            ]);
        }
    }, []);

    const addWaypoint = () => {
        setWaypoints([...waypoints, { id: Date.now(), name: "", lat: "", lng: "" }]);
    };

    const removeWaypoint = (id) => {
        if (waypoints.length > 1) {
            setWaypoints(waypoints.filter(wp => wp.id !== id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Ruta Profesional Guardada:", { form, waypoints, images });
        navigate("/agencia/dashboard");
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
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Modo Agencia</p>
                        </div>
                    </div>
                    <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm">
                        <Save className="w-4 h-4" /> Publicar Ruta
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
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-orange-50/50 hover:border-orange-300 transition-colors cursor-pointer group mb-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <ImagePlus className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">Arrastra imágenes o haz clic aquí</p>
                                <p className="text-xs text-slate-400 mt-1">Sube fotos en alta resolución (Máx 5MB)</p>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-md text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                        <button className="text-slate-400 hover:text-orange-500 p-2" title="Marcar en mapa"><MapPin className="w-4 h-4" /></button>
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

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Categoría Deportiva</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option>Trekking</option>
                                        <option>Rafting</option>
                                        <option>Enoturismo</option>
                                        <option>Paracaidismo</option>
                                        <option>Mountain Bike</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <h2 className="text-base font-black text-slate-800 mb-2 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-orange-500" /> Patrocinio / Creador
                            </h2>
                            <p className="text-xs text-slate-500 mb-5">Asocia esta ruta a un influencer que colabore con tu agencia para aumentar su visibilidad.</p>

                            <div>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                    value={form.influencerId}
                                    onChange={e => setForm({ ...form, influencerId: e.target.value })}
                                >
                                    <option value="none">Sin creador asociado (Ruta de agencia)</option>
                                    {myInfluencers.map(inf => (
                                        <option key={inf.id} value={inf.id}>Realizada por {inf.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}