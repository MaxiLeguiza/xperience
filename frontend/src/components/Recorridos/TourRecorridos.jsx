// TourRecorridos.jsx
// -------------------------------------------------------------
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import TourCard from "./TourCard";
import Filters from "./Filters";
import CreateTourModal from "./CreateTourModal";
import RecommendedPackages from "./RecommendedPackages";
import Nav from "../Navbar/Nav";
import useAuth from "../../hooks/useAuth";

const customMarker = new L.divIcon({
  className: "custom-marker",
  html: `<div style="width: 18px; height: 18px; background-color: #f97316; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const waypointIcon = (index) => new L.divIcon({
  className: "waypoint-marker",
  html: `<div style="width: 32px; height: 32px; background-color: #1e293b; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${index}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function RecommendedInfluencers({ influencers = [], onSelect, selectedId }) {
  if (!influencers || influencers.length === 0) return null;

  const containerRef = useRef(null);

  const scrollBy = (amount) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Influencers top</h3>
        {selectedId && (
          <button onClick={() => onSelect(null)} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="relative group">
        <button
          aria-label="Anterior"
          onClick={() => containerRef.current?.scrollBy({ left: -Math.max(160, Math.floor((containerRef.current?.clientWidth || 320) / 3)), behavior: 'smooth' })}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-500 hover:text-orange-500 hover:bg-orange-50 hover:border-orange-200 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div ref={containerRef} className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 px-2 mt-2 no-scrollbar scroll-smooth">
          {influencers.map((inf) => {
            const isSelected = selectedId === inf.id;
            return (
              <button
                key={inf.id}
                onClick={() => onSelect(inf)}
                className={`flex-shrink-0 w-60 p-3.5 rounded-2xl border transition-all duration-300 text-left flex gap-4 items-center group/card ${isSelected
                    ? "ring-2 ring-orange-500 border-transparent bg-orange-50/50 shadow-md shadow-orange-500/10"
                    : "border-slate-100 hover:border-orange-200 hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5"
                  }`}
              >
                <img
                  src={inf.avatar}
                  alt={inf.name}
                  className={`w-14 h-14 rounded-full object-cover transition-transform duration-300 shadow-sm ${isSelected
                      ? 'scale-105 ring-2 ring-orange-500 ring-offset-2 ring-offset-orange-50'
                      : 'group-hover/card:scale-105'
                    }`}
                />
                <div className="flex-1 overflow-hidden">
                  <p className={`text-base font-bold truncate transition-colors ${isSelected ? 'text-orange-700' : 'text-slate-800 group-hover/card:text-orange-600'}`}>
                    {inf.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate mt-0.5">{inf.social}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          aria-label="Siguiente"
          onClick={() => containerRef.current?.scrollBy({ left: Math.max(160, Math.floor((containerRef.current?.clientWidth || 320) / 3)), behavior: 'smooth' })}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-500 hover:text-orange-500 hover:bg-orange-50 hover:border-orange-200 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TourDetailModal({ tour, onClose, onReserve, auth, itinerary, onToggleRoute }) {
  if (!tour) return null;

  // Estados para comentarios integrados con NestJS
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  // 🔥 NUEVO ESTADO PARA LA IMAGEN AMPLIADA
  const [expandedImage, setExpandedImage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Cargar comentarios frescos desde el backend al abrir el modal
  useEffect(() => {
    if (!tour || !tour.id) return;

    const fetchFreshTour = async () => {
      setIsLoadingComments(true);
      try {
        const response = await fetch(`${API_URL}/api/recorrido/${tour.id}`);
        if (!response.ok) throw new Error("Error al cargar datos del recorrido");

        const data = await response.json();
        const sortedComments = (data.comments || []).sort((a, b) => b.timestamp - a.timestamp);
        setComments(sortedComments);
      } catch (error) {
        console.error("Error obteniendo reseñas:", error);
        const initialSorted = (tour.comments || []).sort((a, b) => b.timestamp - a.timestamp);
        setComments(initialSorted);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchFreshTour();
  }, [tour, API_URL]);

  const totalVotes = comments.length || 1;
  const averageRating = comments.length > 0 ? comments.reduce((sum, c) => sum + c.rating, 0) / totalVotes : 0;
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => comments.filter((c) => c.rating === rating).length);

  const gallery = Array.from(new Set([
    tour.image,
    tour.image2,
    ...(Array.isArray(tour.images) ? tour.images : [])
  ].filter(Boolean)));

  // ENVIAR NUEVO COMENTARIO AL BACKEND
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newRating || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      user: auth?.nombre || "Visitante",
      userId: String(auth?.id || "anon"),
      rating: newRating,
      text: newComment.trim()
    };

    const endpoint = `${API_URL}/api/recorrido/${tour.id}/comment`;
    console.log("Enviando POST a:", endpoint);
    console.log("Payload:", payload);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Respuesta de error de NestJS:", errorData);
        throw new Error(errorData?.message || "Endpoint no encontrado o ID inválido");
      }

      const updatedTour = await response.json();
      const sortedComments = (updatedTour.comments || []).sort((a, b) => b.timestamp - a.timestamp);
      setComments(sortedComments);

      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Error capturado:", error);
      alert(`Error al publicar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isInRoute = itinerary.some(t => t.id === tour.id);
  const canBeJoined = tour.allowMultiRoute !== false;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all" onClick={onClose}>
        <div className="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[90vh] relative flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

          <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 p-2.5 rounded-full shadow-sm backdrop-blur transition-all z-20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="overflow-y-auto no-scrollbar flex-1 pb-10">
            {gallery.length > 0 && (
              <div className="relative w-full h-64 md:h-80 bg-slate-100">
                <img src={gallery[0]} alt={tour.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  {tour.isPackage && <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2 inline-block shadow-md border border-white">Paquete de Actividades</span>}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-md leading-tight">{tour.title}</h1>
                </div>
              </div>
            )}

            <div className="px-6 md:px-10 pt-8 space-y-8">
              <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="text-xl">👤</span> {tour.author}</span>
                    {!tour.isPackage && <span className="flex items-center gap-1.5"><span className="text-xl">⏱️</span> {tour.durationMinutes} min</span>}
                    {!tour.isPackage && <span className="flex items-center gap-1.5"><span className="text-xl">📍</span> {tour.distanceKm} km</span>}
                  </div>

                  {(tour.influencerId || tour.influencer) && (
                    <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-2xl border border-orange-100/50 shadow-sm mt-4">
                      <div className="relative">
                        <img
                          src={tour.influencer?.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80"}
                          alt="Influencer"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 uppercase tracking-widest mb-0.5">
                          Recomendado por
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {tour.influencer?.name || tour.author}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 mt-4">Acerca del {tour.isPackage ? "paquete" : "recorrido"}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">{tour.description}</p>
                  </div>

                  {!tour.isPackage && (
                    <div className="mt-6 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {tour.waypoints && tour.waypoints.length > 1 ? "Ruta del Recorrido" : "Ubicación del evento"}
                        </h4>
                      </div>
                      <div className="h-48 w-full relative z-0">
                        <MapContainer
                          center={
                            tour.waypoints && tour.waypoints.length > 0
                              ? [tour.waypoints[0].lat, tour.waypoints[0].lng]
                              : tour.pos || [-32.8895, -68.8458]
                          }
                          zoom={12}
                          scrollWheelZoom={false}
                          style={{ height: "100%", width: "100%", zIndex: 0 }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                          {tour.waypoints && tour.waypoints.length > 0 ? (
                            <>
                              {tour.waypoints.length > 1 && (
                                <Polyline
                                  positions={tour.waypoints.map(wp => [wp.lat, wp.lng])}
                                  color="#f97316"
                                  weight={3}
                                  opacity={0.7}
                                  dashArray="5, 5"
                                />
                              )}
                              {tour.waypoints.map((wp, idx) => (
                                <Marker
                                  key={`wp-${wp.id}-${idx}`}
                                  position={[wp.lat, wp.lng]}
                                  icon={waypointIcon(idx + 1)}
                                  title={wp.name}
                                />
                              ))}
                            </>
                          ) : (
                            <Marker position={tour.pos || [-32.8895, -68.8458]} icon={customMarker} />
                          )}
                        </MapContainer>
                      </div>

                      {tour.waypoints && tour.waypoints.length > 0 && (
                        <div className="bg-slate-50/50 border-t border-slate-100 p-3 max-h-28 overflow-y-auto">
                          <div className="space-y-2">
                            {tour.waypoints.map((wp, idx) => (
                              <div key={`wp-list-${wp.id}`} className="flex items-start gap-2 text-sm">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-slate-800 text-xs truncate">{wp.name}</p>
                                  <p className="text-slate-500 text-[10px]">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full md:w-[260px] shadow-sm flex-shrink-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Precio total</p>
                  <p className="text-3xl font-black text-orange-500 mb-6"><span className="text-lg mr-1">$</span>{tour.price}</p>

                  <div className="space-y-3">
                    <button onClick={() => onReserve(tour)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:-translate-y-0.5 text-sm">
                      Reservar {tour.isPackage ? "Paquete Completo" : "Solo Esto"}
                    </button>

                    {canBeJoined ? (
                      <button onClick={() => onToggleRoute(tour)} className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 border text-sm ${isInRoute ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"}`}>
                        {isInRoute ? "- Quitar de itinerario" : "+ Unir a itinerario"}
                      </button>
                    ) : (
                      <p className="text-xs text-center text-slate-400 mt-2 italic">⚠️ Creador no permite unir.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 🔥 GALERÍA MEJORADA CON CARROUSEL INTERACTIVO */}
              {gallery.length > 1 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Galería</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x no-scrollbar">
                    {gallery.slice(1).map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`Vista ${idx + 2}`} 
                        onClick={() => setExpandedImage(img)}
                        className="snap-start w-40 h-28 object-cover rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 my-8"></div>

              {/* SECCIÓN DE RESEÑAS */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Reseñas</h3>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center justify-center md:w-1/3">
                    <p className="text-6xl font-black text-slate-800">{averageRating.toFixed(1)}</p>
                    <div className="text-orange-400 text-xl tracking-widest my-2">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</div>
                    <p className="text-xs font-bold text-slate-400">{comments.length} calificaciones</p>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const percentage = comments.length > 0 ? (ratingCounts[rating - 1] / totalVotes) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-500 w-3">{rating}</span>
                          <span className="text-orange-400 text-xs">★</span>
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden"><div style={{ width: `${percentage}%` }} className="bg-orange-500 h-full rounded-full transition-all duration-1000"></div></div>
                          <span className="text-xs font-bold text-slate-400 w-8 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4 mb-8" onSubmit={handleSubmitComment}>
                  <h4 className="text-base font-bold text-slate-800">Deja tu experiencia</h4>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-500">Tu calificación:</span>
                    <div className="flex flex-row-reverse gap-1 text-2xl">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <React.Fragment key={rating}>
                          <input id={`star${rating}`} type="radio" name="rating" value={rating} hidden checked={newRating === rating} onChange={() => setNewRating(rating)} disabled={isSubmitting} />
                          <label htmlFor={`star${rating}`} className={`cursor-pointer transition-colors ${newRating >= rating ? "text-orange-400" : "text-slate-300 hover:text-orange-200"}`}>★</label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="w-full p-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-sm disabled:opacity-50"
                    placeholder="¿Qué te pareció esta expedición?..."
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || !newRating || isSubmitting}
                      className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors text-sm flex items-center gap-2"
                    >
                      {isSubmitting ? "Publicando..." : "Publicar reseña"}
                    </button>
                  </div>
                </form>

                {isLoadingComments ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-sm text-slate-500 font-bold">Cargando reseñas...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-4 italic">No hay reseñas aún. ¡Sé el primero en opinar!</p>
                    ) : (
                      comments.map((comment, index) => {
                        const currentCommentId = comment._id || index;
                        return (
                          <div key={currentCommentId} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-base flex-shrink-0">
                              {comment.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2 sm:gap-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-base font-bold text-slate-800">{comment.user}</p>
                                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                                    {formatDateTime(comment.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-orange-400 text-xs tracking-widest block mb-1">
                                {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                              </span>
                              <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 OVERLAY TIPO LIGHTBOX PARA IMAGEN AMPLIADA */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 transition-all"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setExpandedImage(null)} 
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full transition-colors z-50 backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img 
              src={expandedImage} 
              alt="Vista ampliada" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function TourRecorridos({ onRouteBuilt }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [filters, setFilters] = useState({ q: "", priceMin: "", priceMax: "", sortPriceAsc: false });
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);

  const [itinerary, setItinerary] = useState([]);

  let storedRole = "user";
  try {
    const localAuthRaw = localStorage.getItem('user') || localStorage.getItem('auth');
    if (localAuthRaw) {
      const localData = JSON.parse(localAuthRaw);
      storedRole = localData?.role || localData?.user?.role || "user";
    }
  } catch (error) { }

  const currentRole = String(auth?.role || auth?.user?.role || storedRole).toLowerCase().trim();
  const isCreatorOrAgency = currentRole === "agencia" || currentRole === "influencer";

  const currentUserObj = {
    ...auth,
    id: auth?.id || auth?.user?.id || "u999",
    nombre: auth?.nombre || auth?.user?.nombre || "Usuario",
    role: currentRole,
    social: "@user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/api/recorrido`);

        if (!response.ok) {
          throw new Error(`Error fetching tours: ${response.statusText}`);
        }

        const data = await response.json();

        const dbTours = Array.isArray(data) ? data.map(tour => ({
          id: tour._id || tour.id,
          title: tour.title || tour.name || "Sin título",
          name: tour.name || tour.title || "Sin título",
          author: tour.author || "Guía Local",
          authorId: tour.authorId,
          durationMinutes: tour.durationMinutes || 0,
          distanceKm: tour.distanceKm || 0,
          price: Number(tour.price) || 0,
          capacity: tour.capacity || 10,
          description: tour.description || "",
          images: Array.isArray(tour.images) ? tour.images : [],
          image: Array.isArray(tour.images) && tour.images.length > 0 ? tour.images[0] : (tour.image || null),
          image2: Array.isArray(tour.images) && tour.images.length > 1 ? tour.images[1] : (tour.image2 || null),
          waypoints: tour.waypoints || [],
          allowMultiRoute: tour.allowMultiRoute !== false,
          isPackage: tour.isPackage === true,
          influencerId: tour.influencerId || (tour.influencer && tour.influencer._id),
          influencer: tour.influencer && tour.influencer._id
            ? {
              id: tour.influencer._id || tour.influencer.id,
              name: tour.influencer.name || tour.influencer.nombre,
              avatar:
                tour.influencer.avatar ||
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
              social: tour.influencer.social || "@influencer",
            }
            : null,
          rating: tour.rating || 4.5,
          pos: tour.location ? [tour.location.lat, tour.location.lng] : [tour.waypoints?.[0]?.lat || -32.8895, tour.waypoints?.[0]?.lng || -68.8458],
          category: tour.category,
          difficulty: tour.difficulty,
          role: tour.role,
          comments: Array.isArray(tour.comments) ? tour.comments : []
        })) : [];

        setTours(dbTours);
        setFilteredTours(dbTours);

        const uniqueInfluencers = [];
        const influencerIds = new Set();
        dbTours.forEach(tour => {
          const infId = tour.influencerId || (tour.influencer && tour.influencer.id);
          if (infId && !influencerIds.has(infId)) {
            influencerIds.add(infId);
            uniqueInfluencers.push({
              id: infId,
              name: (tour.influencer && (tour.influencer.name || tour.influencer.nombre)) || tour.author,
              avatar:
                (tour.influencer && (tour.influencer.avatar || tour.influencer.image || tour.influencer.photo)) ||
                tour.image ||
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
              social: (tour.influencer && (tour.influencer.social || tour.influencer.handle)) || "@influencer"
            });
          }
        });

        setInfluencers(uniqueInfluencers);
      } catch (error) {
        console.error("Error loading tours:", error);
        setTours([]);
        setFilteredTours([]);
        setInfluencers([]);
      }
    };

    fetchTours();
  }, []);

  const applyFilters = useCallback(() => {
    if (!tours || tours.length === 0) return;

    try {
      let results = tours.filter((tour) => {
        const searchTerm = (filters.q || "").trim().toLowerCase();
        const tourTitle = (tour.title || tour.name || "").toLowerCase();
        const matchText = searchTerm === "" || tourTitle.includes(searchTerm);

        const tourPrice = Number(tour.price) || 0;
        const minPrice = (filters.priceMin !== "" && filters.priceMin !== null) ? Number(filters.priceMin) : null;
        const maxPrice = (filters.priceMax !== "" && filters.priceMax !== null) ? Number(filters.priceMax) : null;

        const matchPriceMin = minPrice === null || tourPrice >= minPrice;
        const matchPriceMax = maxPrice === null || tourPrice <= maxPrice;

        const matchInfluencer = !selectedInfluencerId ||
          tour.influencerId === selectedInfluencerId ||
          (tour.influencer && tour.influencer.id === selectedInfluencerId);

        return matchText && matchPriceMin && matchPriceMax && matchInfluencer;
      });

      if (filters.sortPriceAsc) {
        results = [...results].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      }

      setFilteredTours(results);
    } catch (error) {
      console.error("Error crítico procesando filtros:", error);
      setFilteredTours(tours);
    }
  }, [tours, filters, selectedInfluencerId]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleToggleRoute = (tour) => {
    setItinerary(prev => prev.some(t => t.id === tour.id) ? prev.filter(t => t.id !== tour.id) : [...prev, tour]);
  };

  const normalizeForCart = (rawTourArray) => {
    return rawTourArray.map(tour => ({
      id: tour.id,
      nombre: tour.title || tour.name,
      precio: tour.price,
      capacidad: tour.capacity || 10,
      image: tour.image || tour.image2 || (Array.isArray(tour.images) ? tour.images[0] : null),
      durationMinutes: tour.durationMinutes,
      author: tour.author,
      influencer: tour.influencer || null
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
      <div className="flex-shrink-0"><Nav /></div>

      <header className="bg-white shadow-sm border-b border-slate-100 flex-shrink-0 z-10">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Encuentra actividades y experiencias <span className="text-orange-500">inolvidables</span>
            </h1>

            <div className="flex items-center gap-3">
              {isCreatorOrAgency && (
                <button onClick={() => navigate('/agencia/dashboard')} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 text-sm rounded-full shadow-md transition-all hidden sm:block">
                  Mi Panel de Agencia
                </button>
              )}
              {currentRole === "user" && (
                <button onClick={() => setCreateOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 text-sm rounded-full shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]">
                  Crear Mi Ruta
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      <div className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col gap-6 min-h-0">
        <div className="flex-shrink-0">
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-6 pr-2">
            <RecommendedPackages tours={tours} onSelectTour={setSelectedTour} />
            <RecommendedInfluencers influencers={influencers} onSelect={(inf) => setSelectedInfluencerId(inf ? inf.id : null)} selectedId={selectedInfluencerId} />
          </div>

          <main className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-32 pr-2">
            {filteredTours.length > 0 ? (
              filteredTours.map((t) => (
                <div key={t.id} className="relative transition-transform duration-300 flex-shrink-0">

                  <div className="absolute top-6 left-6 z-[30] flex flex-col items-start gap-1 pointer-events-none">
                    {t.isPackage && (
                      <div className="bg-slate-900/90 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md border border-slate-700/50 backdrop-blur-sm">
                        Paquete Múltiple
                      </div>
                    )}
                    {t.influencerId || t.influencer ? (
                      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                        Recomendación Influencer
                      </div>
                    ) : (
                      <div className="bg-slate-800/90 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-slate-700/50 backdrop-blur-sm">
                        Guía Local Oficial
                      </div>
                    )}
                  </div>

                  <div className={`rounded-[26px] p-1 h-full ${t.influencerId || t.influencer ? 'bg-gradient-to-br from-orange-200 to-orange-50' : 'bg-transparent'}`}>
                    <TourCard
                      tour={{
                        ...t,
                        image: t.image || t.image2 || (Array.isArray(t.images) ? t.images[0] : null)
                      }}
                      onSelect={() => setSelectedTour(t)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center shadow-sm">No encontramos resultados en la base de datos</div>
            )}
          </main>
        </div>
      </div>

      {itinerary.length > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[40] bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full px-4 py-3 flex items-center gap-6 animate-slide-up pointer-events-auto w-max">
          <div className="flex items-center gap-4 pl-2">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-inner">{itinerary.length}</div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ruta múltiple</p>
              <p className="text-base font-black text-white leading-none">${itinerary.reduce((acc, t) => acc + (Number(t.price) || 0), 0)}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <button
            onClick={() => {
              const itemsNormalizados = normalizeForCart(itinerary);
              if (onRouteBuilt) {
                onRouteBuilt(itemsNormalizados);
              } else {
                navigate("/carrito", { state: { selectedItems: itemsNormalizados } });
              }
            }}
            className="text-sm font-bold text-slate-900 bg-orange-400 hover:bg-orange-300 px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
          >
            Confirmar ruta
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <CreateTourModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(newTour) => { setTours((t) => [newTour, ...t]); setFilteredTours((t) => [newTour, ...t]); }}
        existingTours={tours}
        currentUser={currentUserObj}
        influencer={{
          id: currentUserObj.id,
          name: currentUserObj.nombre,
          avatar: currentUserObj.avatar,
          social: currentUserObj.social
        }}
      />

      <TourDetailModal
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
        onReserve={(tour) => navigate("/carrito", { state: { selectedItems: normalizeForCart([tour]) } })}
        auth={currentUserObj}
        itinerary={itinerary}
        onToggleRoute={handleToggleRoute}
      />
    </div>
  );
}