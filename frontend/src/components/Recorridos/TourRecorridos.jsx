// TourRecorridos.jsx
// -------------------------------------------------------------
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TourCard from "./TourCard";
import Filters from "./Filters";
import CreateTourModal from "./CreateTourModal";
import RecommendedPackages from "./RecommendedPackages";
import Nav from "../Navbar/Nav";
import useAuth from "../../hooks/useAuth";

function RecommendedInfluencers({ influencers = [], onSelect, selectedId }) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Influencers top</h3>
        {selectedId && (
          <button onClick={() => onSelect(null)} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">Limpiar filtro</button>
        )}
      </div>
      <div className="flex items-center gap-4 overflow-x-auto pb-2 snap-x no-scrollbar">
        {influencers.map((inf) => {
          const isSelected = selectedId === inf.id;
          return (
            <button key={inf.id} onClick={() => onSelect(inf)} className={`snap-start flex-shrink-0 w-48 p-3 rounded-2xl border transition-all duration-300 text-left flex gap-3 items-center group ${isSelected ? "ring-2 ring-orange-500 border-transparent bg-orange-50/50 shadow-md shadow-orange-500/10" : "border-slate-100 hover:border-orange-200 hover:shadow-sm hover:bg-slate-50"}`}>
              <img src={inf.avatar} alt={inf.name} className={`w-12 h-12 rounded-full object-cover transition-transform duration-300 ${isSelected ? 'scale-105 ring-2 ring-orange-500 ring-offset-2 ring-offset-orange-50' : 'group-hover:scale-105'}`} />
              <div className="flex-1 overflow-hidden">
                <p className={`text-sm font-bold truncate ${isSelected ? 'text-orange-700' : 'text-slate-700'}`}>{inf.name}</p>
                <p className="text-xs text-slate-400 truncate">{inf.social}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TourDetailModal({ tour, onClose, onReserve, auth, itinerary, onToggleRoute }) {
  if (!tour) return null;

  const baseComments = useMemo(() => tour.comments && Array.isArray(tour.comments) && tour.comments.length ? tour.comments : [
    { user: "Carlos A.", rating: 4, text: "¡Una experiencia increíble! Muy recomendable." },
    { user: "Ana L.", rating: 5, text: "Todo estuvo excelente, me encantó el recorrido." }
  ], [tour]);

  const [comments, setComments] = useState(baseComments);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const storageKey = "tourComments";
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const map = raw ? JSON.parse(raw) : {};
      const stored = map[tour.id] || [];
      setComments([...baseComments, ...stored]);
    } catch { setComments(baseComments); } finally { setInitialized(true); }
  }, [baseComments, tour.id]);

  const totalVotes = comments.length || 1;
  const averageRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / totalVotes;
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => comments.filter((comment) => comment.rating === rating).length);
  const gallery = [tour.image, tour.image2, ...(tour.images || [])].filter(Boolean);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) return;
    const entry = { user: auth?.nombre || "Visitante", rating: newRating, text: newComment.trim() };
    setComments((prev) => {
      const next = [entry, ...prev];
      if (initialized) {
        try {
          const raw = localStorage.getItem(storageKey);
          const map = raw ? JSON.parse(raw) : {};
          map[tour.id] = next.filter((c) => !baseComments.some((b) => b.text === c.text && b.user === c.user));
          localStorage.setItem(storageKey, JSON.stringify(map));
        } catch { }
      }
      return next;
    });
    setNewComment(""); setNewRating(0);
  };

  const isInRoute = itinerary.some(t => t.id === tour.id);
  const canBeJoined = tour.allowMultiRoute !== false;

  return (
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
                {/* Etiqueta Visual de Paquete */}
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
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Acerca del {tour.isPackage ? "paquete" : "recorrido"}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">{tour.description}</p>
                </div>
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

            {gallery.length > 1 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Galería</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x no-scrollbar">
                  {gallery.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt={`Vista ${idx + 2}`} className="snap-start w-40 h-28 object-cover rounded-xl border border-slate-100 shadow-sm" />
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 my-8"></div>

            {/* Reseñas */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Reseñas</h3>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center justify-center md:w-1/3">
                  <p className="text-6xl font-black text-slate-800">{averageRating.toFixed(1)}</p>
                  <div className="text-orange-400 text-xl tracking-widest my-2">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</div>
                  <p className="text-xs font-bold text-slate-400">{totalVotes} calificaciones</p>
                </div>
                <div className="flex-1 space-y-2.5">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage = (ratingCounts[rating - 1] / totalVotes) * 100;
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
                        <input id={`star${rating}`} type="radio" name="rating" value={rating} hidden checked={newRating === rating} onChange={() => setNewRating(rating)} />
                        <label htmlFor={`star${rating}`} className={`cursor-pointer transition-colors ${newRating >= rating ? "text-orange-400" : "text-slate-300 hover:text-orange-200"}`}>★</label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <textarea className="w-full p-4 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-sm" placeholder="¿Qué te pareció esta expedición?..." rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                <div className="flex justify-end"><button type="submit" disabled={!newComment.trim() || !newRating} className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors text-sm">Publicar reseña</button></div>
              </form>
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-base flex-shrink-0">{comment.user.charAt(0).toUpperCase()}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-bold text-slate-800">{comment.user}</p>
                        <span className="text-orange-400 text-xs tracking-widest">{"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

  // 🔥 SIMULAMOS EL CURRENT USER (En producción vendrá de useAuth/Mongo)
  const simulatedCurrentUser = {
    ...auth,
    id: auth?.id || "u999",
    nombre: auth?.nombre || "Usuario Influencer",
    role: "influencer", // <-- Cambia a "user" para probar el comportamiento normal
    social: "@mi_instagram",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
  };

  useEffect(() => {
    // 🔥 MOCK DATA ACTUALIZADA CON 2 PAQUETES (Uno Influencer, Uno Normal)
    const mockTours = [
      { id: "pkg1", title: "Aventura Extrema V.I.P", author: "Luisito Comunica", durationMinutes: 0, distanceKm: 0, price: 58000, description: "Paquete exclusivo que une Rafting y Canopy en un solo día.", image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: false, isPackage: true, influencer: { id: "i1", name: "Luisito Comunica", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80", social: "@luisitocomunica" }, rating: 5.0 },
      { id: "pkg2", title: "Ruta del Vino y Relax", author: "Maxi Leguiza", durationMinutes: 0, distanceKm: 0, price: 45000, description: "Un paquete relajante creado por nuestro guía local para disfrutar de las mejores termas y bodegas.", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, isPackage: true, influencer: null, rating: 4.8 },
      { id: "t1", title: "Kayak en Potrerillos", author: "Dante Ruiz", durationMinutes: 150, distanceKm: 8, price: 22000, description: "Remada guiada en el dique con vistas abiertas...", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, influencer: null, rating: 4.8 },
      { id: "t2", title: "Rafting Río Mendoza", author: "Maxi Leguiza", durationMinutes: 210, distanceKm: 15, price: 36000, description: "Salida con rápidos...", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, influencer: { id: "i2", name: "Drew Binsky", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", social: "@drewbinsky" }, rating: 5.0 },
      { id: "t3", title: "Cabalgata en Uspallata", author: "Ema Caceres", durationMinutes: 180, distanceKm: 12, price: 18000, description: "Recorrido amable...", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: false, influencer: { id: "i3", name: "Charly Sinewan", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80", social: "@charlysinewan" }, rating: 4.2 },
      { id: "t4", title: "Termas de Cacheuta Full Day", author: "Maria Luna", durationMinutes: 300, distanceKm: 18, price: 26000, description: "Día completo de termas...", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, influencer: null, rating: 4.6 },
      { id: "t5", title: "Trekking en Vallecitos", author: "Ana Gomez", durationMinutes: 320, distanceKm: 18, price: 24000, description: "Ascenso con tramos exigentes...", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, influencer: { id: "i1", name: "Luisito Comunica", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80", social: "@luisitocomunica" } },
      { id: "t6", title: "Canopy en Potrerillos", author: "Sofia Ramirez", durationMinutes: 110, distanceKm: 5, price: 21000, description: "Circuito aéreo con buenas vistas...", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80", image2: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", allowMultiRoute: true, influencer: { id: "i3", name: "Charly Sinewan", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80", social: "@charlysinewan" } },
    ];

    setTours(mockTours);
    setFilteredTours(mockTours);
    setInfluencers([
      { id: "i1", name: "Luisito Comunica", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80", social: "@luisitocomunica" },
      { id: "i2", name: "Drew Binsky", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", social: "@drewbinsky" },
      { id: "i3", name: "Charly Sinewan", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80", social: "@charlysinewan" }
    ]);
  }, []);

  function applyFilters() {
    let results = tours.filter((tour) => {
      const matchText = filters.q === "" || tour.title.toLowerCase().includes(filters.q.toLowerCase());
      const matchPriceMin = filters.priceMin === "" || tour.price >= Number(filters.priceMin);
      const matchInfluencer = !selectedInfluencerId || (tour.influencer && tour.influencer.id === selectedInfluencerId);
      return matchText && matchPriceMin && matchInfluencer;
    });
    if (filters.sortPriceAsc) results = [...results].sort((a, b) => a.price - b.price);
    setFilteredTours(results);
  }

  useEffect(() => { applyFilters(); }, [filters, tours, selectedInfluencerId]);

  const handleToggleRoute = (tour) => {
    setItinerary(prev => prev.some(t => t.id === tour.id) ? prev.filter(t => t.id !== tour.id) : [...prev, tour]);
  };

  const normalizeForCart = (rawTourArray) => {
    return rawTourArray.map(tour => ({
      id: tour.id,
      nombre: tour.title || tour.name,
      precio: tour.price,
      capacidad: tour.capacity || 10,
      image: tour.image || tour.image2,
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
            <button onClick={() => setCreateOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 text-sm rounded-full shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]">
              Crear Ruta
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col gap-6 min-h-0">
        <div className="flex-shrink-0">
          <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-6 pr-2">

            {/* 🔥 CARRUSEL AUTOMÁTICO DE PAQUETES/TOURS 🔥 */}
            <RecommendedPackages tours={tours} onSelectTour={setSelectedTour} />

            <RecommendedInfluencers influencers={influencers} onSelect={(inf) => setSelectedInfluencerId(inf ? inf.id : null)} selectedId={selectedInfluencerId} />
          </div>

          <main className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-32 pr-2">
            {filteredTours.length > 0 ? (
              filteredTours.map((t) => (
                <div key={t.id} className="relative transition-transform duration-300 flex-shrink-0">

                  {/* Etiquetas Superiores */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1">
                    {t.isPackage && (
                      <div className="bg-slate-900/90 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md border border-slate-700/50 backdrop-blur-sm">
                        Paquete Múltiple
                      </div>
                    )}
                    {t.influencer ? (
                      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                        Recomendación Influencer
                      </div>
                    ) : (
                      <div className="bg-slate-800/90 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg border border-slate-700/50 backdrop-blur-sm">
                        Guía Local Oficial
                      </div>
                    )}
                  </div>

                  <div className={`rounded-[26px] p-1 h-full ${t.influencer ? 'bg-gradient-to-br from-orange-200 to-orange-50' : 'bg-transparent'}`}>
                    <TourCard tour={t} onSelect={() => setSelectedTour(t)} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center shadow-sm">No encontramos resultados</div>
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
              <p className="text-base font-black text-white leading-none">${itinerary.reduce((acc, t) => acc + (t.price || 0), 0)}</p>
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

      {/* 🔥 PASAMOS EL CURRENT USER AL MODAL DE CREACIÓN */}
      <CreateTourModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(newTour) => { setTours((t) => [newTour, ...t]); setFilteredTours((t) => [newTour, ...t]); }}
        existingTours={tours}
        currentUser={simulatedCurrentUser}
      />

      <TourDetailModal
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
        onReserve={(tour) => navigate("/carrito", { state: { selectedItems: normalizeForCart([tour]) } })}
        auth={auth}
        itinerary={itinerary}
        onToggleRoute={handleToggleRoute}
      />
    </div>
  );
}