// AgencyDashboard.jsx
// 🔥 VERSIÓN MEJORADA CON CARGA DESDE API
// -----------------------------------------------
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import { useAuth } from "../../hooks/useAuth";
import {
    TrendingUp, Map, Users, Edit3, Trash2, Plus,
    MoreVertical, Calendar, DollarSign, Loader
} from "lucide-react";
import axios from "axios";

export default function AgencyDashboard() {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [myTours, setMyTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 CARGAR RUTAS DESDE LA API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const response = await axios.get(`${API_URL}/api/recorrido`);
                
                // Filtrar solo las rutas del usuario autenticado
                const authorId = auth?.id || auth?.user?.id;
                const authorName = auth?.nombre || auth?.user?.nombre;
                
                const userTours = response.data.filter(tour => 
                    tour.authorId === authorId || tour.author === authorName
                );
                
                setMyTours(userTours);
                setError(null);
            } catch (err) {
                console.error("Error cargando rutas:", err);
                setError("No se pudieron cargar las rutas");
                setMyTours([]);
            } finally {
                setLoading(false);
            }
        };

        if (auth?.id || auth?.user?.id || auth?.nombre || auth?.user?.nombre) {
            fetchTours();
        } else {
            setLoading(false);
        }
    }, [auth]);

    // Cálculos de Resumen
    const stats = useMemo(() => {
        let totalEarnings = 0;
        let totalReservations = 0;
        let activeRoutes = 0;

        myTours.forEach(tour => {
            const price = Number(tour.price) || 0;
            const reserved = Number(tour.reserved) || 0;
            
            totalEarnings += (price * reserved);
            totalReservations += reserved;
            
            // Asumimos que si no tiene status, está activa por defecto
            if (tour.status === "active" || tour.status === "sold_out" || !tour.status) {
                activeRoutes++;
            }
        });

        return { totalEarnings, totalReservations, activeRoutes };
    }, [myTours]);

    const formatPrice = (val) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(val || 0);

    const handleDelete = async (tourId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            await axios.delete(`${API_URL}/api/recorrido/${tourId}`);
            setMyTours(myTours.filter(t => t._id !== tourId && t.id !== tourId));
        } catch (err) {
            console.error("Error eliminando ruta:", err);
            alert("Error al eliminar la ruta");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
            <div className="flex-shrink-0 z-50"><Nav /></div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">

                {/* Cabecera del Dashboard */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Dashboard <span className="text-orange-500">Agencia</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Resumen de tus operaciones y gestión de rutas.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/agencia/crear-ruta')}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Nueva Ruta Profesional
                    </button>
                </div>

                {/* Tarjetas de Resumen (Stats) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ingresos Totales</p>
                            <p className="text-2xl font-black text-slate-800">{formatPrice(stats.totalEarnings)}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reservas Activas</p>
                            <p className="text-2xl font-black text-slate-800">{stats.totalReservations} pax</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                            <Map className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rutas Publicadas</p>
                            <p className="text-2xl font-black text-slate-800">{stats.activeRoutes}</p>
                        </div>
                    </div>

                </div>

                {/* Tabla / Lista de Rutas */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Mis Rutas</h2>
                        <button onClick={() => window.location.reload()} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                            {loading ? "Cargando..." : "Actualizar"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="px-6 py-12 text-center">
                            <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">Cargando tus rutas...</p>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-rose-500 font-bold mb-3">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-sm font-bold text-orange-500 hover:text-orange-600"
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    ) : myTours.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Map className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">Aún no has creado ninguna ruta</p>
                            <button 
                                onClick={() => navigate('/agencia/crear-ruta')}
                                className="text-sm font-bold text-orange-500 hover:text-orange-600 mt-3"
                            >
                                Crear tu primera ruta
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ruta / Actividad</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ocupación (Stock)</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ingreso Est.</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {myTours.map((tour) => {
                                        const tourId = tour._id || tour.id;
                                        const percent = tour.capacity ? Math.round(((tour.reserved || 0) / tour.capacity) * 100) : 0;
                                        return (
                                            <tr key={tourId} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-slate-800">{tour.title || tour.name}</p>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{tour.category}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tour.status === 'active' && <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">Activa</span>}
                                                    {tour.status === 'sold_out' && <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-100">Agotada</span>}
                                                    {tour.status === 'draft' && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">Borrador</span>}
                                                    {!tour.status && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">Publicada</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                                                            <div className={`h-2 rounded-full ${percent >= 100 ? 'bg-rose-500' : 'bg-orange-500'}`} style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600">{tour.reserved || 0}/{tour.capacity || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-slate-800">{formatPrice(tour.price * (tour.reserved || 0))}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => navigate(`/agencia/crear-ruta?edit=${tourId}`)} 
                                                            className="p-2 text-slate-400 hover:text-orange-500 transition-colors bg-white hover:bg-orange-50 rounded-lg" 
                                                            title="Editar"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(tourId)}
                                                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white hover:bg-rose-50 rounded-lg" 
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}