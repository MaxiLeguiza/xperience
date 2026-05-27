// InfluencerProfile.jsx
// 🔥 VERSIÓN ACTUALIZADA: Sin Followers, Countries (inglés) ni Videos

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import { useAuth } from "../../hooks/useAuth";
import {
  UserPlus, MapPin, Map, ArrowLeft, Loader2, Navigation, Check, Globe, Clock, Route
} from "lucide-react";

import clienteAxios from "../../config/axios";

const COUNTRIES_LIST = [
  { code: "AR", name: "Argentina" },
  { code: "CH", name: "Chile" },
  { code: "PE", name: "Perú" },
  { code: "CO", name: "Colombia" },
  { code: "BR", name: "Brasil" },
  { code: "MX", name: "México" },
  { code: "ES", name: "España" },
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "US", name: "Estados Unidos" },
  { code: "CA", name: "Canadá" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "Nueva Zelanda" },
  { code: "JP", name: "Japón" },
  { code: "TH", name: "Tailandia" },
];

function InfluencerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const currentUserId = auth?.id || auth?.user?.id || "default_user";
  const isAgency = auth?.role === "agencia" || auth?.user?.role === "agencia";

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        setLoading(true);
        const response = await clienteAxios.get(`/api/influencers/${id}`);
        setProfileData(response.data);

        // Determinar si el usuario actual está siguiendo
        const followers = response.data.followers || [];
        setIsFollowing(followers.includes(currentUserId));

        // Cargar países
        setSelectedCountries(response.data.countries || []);

        // Cargar tours: si el influencer tiene array 'tours' poblado, úsalo; si está vacío, buscar por influencerId/author
        if (response.data.tours && response.data.tours.length > 0) {
          fetchTours(response.data.tours);
        } else {
          // Fallback: buscar recorridos que tengan influencerId o authorId igual al influencer
          fetchToursByInfluencer(response.data._id || response.data.id);
        }
      } catch (error) {
        console.error("Error al obtener el influencer:", error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id, currentUserId]);

  const fetchTours = async (tourIds) => {
    try {
      setToursLoading(true);

      if (!Array.isArray(tourIds) || tourIds.length === 0) {
        setTours([]);
        return;
      }

      // Algunos endpoints devuelven ya los objetos completos, otros sólo IDs.
      const directTours = tourIds.filter(t => t && typeof t === 'object' && (t._id || t.id));
      const idsToFetch = tourIds.filter(t => !(t && typeof t === 'object' && (t._id || t.id)));

      // Normalizar tours directos
      const normalizedDirect = directTours.map(t => ({
        _id: t._id || t.id,
        id: t._id || t.id,
        name: t.name || t.title,
        title: t.title || t.name,
        description: t.description || t.summary || '',
        images: Array.isArray(t.images) ? t.images : (t.image ? [t.image] : []),
        image: (Array.isArray(t.images) && t.images[0]) || t.image || null,
        price: t.price,
        durationMinutes: t.durationMinutes,
        distanceKm: t.distanceKm,
        difficulty: t.difficulty,
        comments: Array.isArray(t.comments) ? t.comments : []
      }));

      // Traer por ID sólo los que faltan
      const fetched = await Promise.all(
        idsToFetch.map(id =>
          clienteAxios.get(`/api/recorrido/${id}`).then(res => res.data).catch(() => null)
        )
      );

      const fetchedClean = fetched.filter(Boolean).map(t => ({
        _id: t._id || t.id,
        id: t._id || t.id,
        name: t.name || t.title,
        title: t.title || t.name,
        description: t.description || t.summary || '',
        images: Array.isArray(t.images) ? t.images : (t.image ? [t.image] : []),
        image: (Array.isArray(t.images) && t.images[0]) || t.image || null,
        price: t.price,
        durationMinutes: t.durationMinutes,
        distanceKm: t.distanceKm,
        difficulty: t.difficulty,
        comments: Array.isArray(t.comments) ? t.comments : []
      }));

      // Unir, manteniendo el orden original: primero directTours (en el mismo orden), luego fetched
      const combined = [...normalizedDirect, ...fetchedClean];
      setTours(combined);
    } catch (error) {
      console.error("Error cargando tours:", error);
      setTours([]);
    } finally {
      setToursLoading(false);
    }
  };

  const fetchToursByInfluencer = async (influencerId) => {
    try {
      setToursLoading(true);
      const all = await clienteAxios.get('/api/recorrido').then(r => r.data).catch(() => []);
      if (!Array.isArray(all) || all.length === 0) {
        setTours([]);
        return;
      }

      const matched = all.filter(t => {
        return (t.influencerId && String(t.influencerId) === String(influencerId)) ||
               (t.influencer && (t.influencer._id === influencerId || t.influencer.id === influencerId)) ||
               (t.authorId && String(t.authorId) === String(influencerId)) ||
               (t.author && (t.author._id === influencerId || t.author.id === influencerId));
      }).map(t => ({
        _id: t._id || t.id,
        id: t._id || t.id,
        name: t.name || t.title,
        title: t.title || t.name,
        description: t.description || t.summary || '',
        images: Array.isArray(t.images) ? t.images : (t.image ? [t.image] : []),
        image: (Array.isArray(t.images) && t.images[0]) || t.image || null,
        price: t.price,
        durationMinutes: t.durationMinutes,
        distanceKm: t.distanceKm,
        difficulty: t.difficulty,
        comments: Array.isArray(t.comments) ? t.comments : []
      }));

      setTours(matched);
    } catch (error) {
      console.error('Error buscando tours por influencer:', error);
      setTours([]);
    } finally {
      setToursLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const response = await clienteAxios.post(
        `/api/influencers/${id}/toggle-follow`,
        { userId: currentUserId }
      );

      setProfileData(response.data);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
    }
  };

  const toggleCountry = (countryCode) => {
    setSelectedCountries(prev =>
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const saveCountries = async () => {
    try {
      const response = await clienteAxios.patch(
        `/api/influencers/${id}/countries`,
        { countries: selectedCountries }
      );

      setProfileData(response.data);
      setShowCountriesModal(false);
    } catch (error) {
      console.error("Error al actualizar países:", error);
    }
  };

  const getFollowerCount = () => {
    return profileData?.followers?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="font-bold text-slate-500">Cargando perfil...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-black text-slate-800 mb-2">404</h2>
        <p className="text-slate-500 mb-6">El creador que buscas no existe o ha sido eliminado.</p>
        <button onClick={() => navigate('/Influencers')} className="bg-orange-500 text-white font-bold px-6 py-2 rounded-full hover:bg-orange-600 transition shadow-md">
          Volver a la lista
        </button>
      </div>
    );
  }

  const getIconForStat = (label) => {
    switch (label?.toLowerCase()) {
      case 'seguidores': return <UserPlus className="w-5 h-5 text-slate-400 mb-2" />;
      case 'países': return <MapPin className="w-5 h-5 text-slate-400 mb-2" />;
      case 'deportes': return <Navigation className="w-5 h-5 text-slate-400 mb-2" />;
      case 'recorridos': return <Map className="w-5 h-5 text-slate-400 mb-2" />;
      default: return <Map className="w-5 h-5 text-slate-400 mb-2" />;
    }
  };

  // 🔥 LISTA NEGRA: Agregamos 'videos' y 'video' para ocultarlos del panel dinámico
  const excludedStats = ['seguidores', 'países', 'paises', 'followers', 'countries', 'country', 'videos', 'video'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex-shrink-0 z-50">
        <Nav />
      </div>

      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 md:py-10 relative">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2 text-white hover:text-black transition-colors font-bold text-sm bg-orange-500/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-100 mt-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10 lg:mt-0">

          {/* COLUMNA IZQUIERDA: PERFIL E INFO */}
          <aside className="lg:col-span-4 xl:col-span-4 sticky top-24 mt-4">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">

              {/* PORTADA DEL PERFIL */}
              <div className="h-32 bg-slate-200 relative">
                <img src={profileData.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>

              {/* CONTENIDO DEL PERFIL */}
              <div className="px-6 pb-6 relative flex-1 flex flex-col">
                <div className="flex justify-center">
                  <img
                    src={profileData.avatar}
                    alt={`Perfil de ${profileData.name}`}
                    className="w-28 h-28 rounded-full object-cover -mt-14 border-4 border-white shadow-lg relative z-10 bg-white"
                  />
                </div>

                <div className="text-center mt-3 mb-6">
                  <h2 className="text-2xl font-black text-slate-800">{profileData.name}</h2>
                  <p className="text-sm font-bold text-orange-500 tracking-wide mt-0.5">
                    {profileData.handle}
                  </p>
                </div>

                {/* BOTÓN SEGUIR/SIGUIENDO */}
                <div className="flex justify-center gap-3 mb-6">
                  <button
                    onClick={handleToggleFollow}
                    className={`flex-1 px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-gradient-to-r from-orange-500 to-[#d86015] text-white hover:shadow-lg hover:shadow-orange-500/30'
                      } hover:-translate-y-0.5`}
                  >
                    {isFollowing ? (
                      <><Check className="w-4 h-4" /> Siguiendo</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> +Seguir</>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-600 text-center mb-8 leading-relaxed">
                  {profileData.description}
                </p>

                {/* ESTADÍSTICAS */}
                <div className="border-t border-slate-100 pt-6 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Seguidores */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-400 transition-colors">
                      <UserPlus className="w-5 h-5 text-slate-400 mb-2" />
                      <p className="text-2xl font-black text-slate-800 leading-none mb-1">{getFollowerCount()}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Seguidores</p>
                    </div>

                    {/* Países */}
                    <div
                      onClick={() => isAgency && setShowCountriesModal(true)}
                      className={`bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center transition-colors ${
                        isAgency 
                          ? 'cursor-pointer hover:border-orange-400' 
                          : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-slate-400 mb-2" />
                      <p className="text-2xl font-black text-slate-800 leading-none mb-1">{selectedCountries?.length || 0}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Países</p>
                    </div>

                    {/* Recorridos y otras dinámicas filtradas */}
                    {profileData.stats && (
                      <>
                        {Array.isArray(profileData.stats) ? (
                          profileData.stats.map((stat, i) => {
                            // 🔥 Verifica contra la lista negra
                            if (!excludedStats.includes(stat.label?.toLowerCase())) {
                              return (
                                <div key={`arr-${i}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                  {getIconForStat(stat.label)}
                                  <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                                </div>
                              );
                            }
                            return null;
                          })
                        ) : (
                          Object.entries(profileData.stats)
                            // 🔥 Verifica contra la lista negra
                            .filter(([label]) => !excludedStats.includes(label?.toLowerCase()))
                            .slice(0, 2)
                            .map(([label, value], i) => (
                              <div key={`obj-${i}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                {getIconForStat(label)}
                                <p className="text-2xl font-black text-slate-800 leading-none mb-1">{value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                              </div>
                            ))
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMNA DERECHA: TOURS/RECORRIDOS */}
          <section className="lg:col-span-8 xl:col-span-8">
           <div className="mb-10">
  {/* Cabecera mejorada con mejor alineación y contraste en el badge */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
      Recorridos & Actividades
    </h3>
    <div className="bg-orange-50 text-orange-600 ring-1 ring-orange-500/20 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
      {tours?.length || 0} Rutas
    </div>
  </div>

  {toursLoading ? (
    /* Estado de carga con un toque más orgánico */
    <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-400 animate-pulse">Buscando recorridos...</p>
    </div>
  ) : tours?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {tours.map((tour) => (
        <div
          key={tour._id || tour.id}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedTour(tour)}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedTour(tour)}
          className="group bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden relative cursor-pointer hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-300 transition-all duration-300 p-3 sm:p-4 flex gap-4 sm:gap-5 items-center text-left"
        >
          {/* Contenedor de Imagen: Ligeramente más grande y proporcionado */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
            <img
              src={(tour.images && tour.images[0]) || tour.image || "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80"}
              alt={tour.name || tour.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Contenedor de Información */}
          <div className="flex-1 min-w-0 py-1">
            
            {/* Título y Precio: Llevamos el precio arriba a la derecha para jerarquía visual */}
            <div className="flex justify-between items-start gap-3 mb-1">
              <h4 className="font-bold text-base text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                {tour.name || tour.title}
              </h4>
              <span className="font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg text-sm tracking-tight border border-slate-200/60 shadow-sm flex-shrink-0">
                ${tour.price || '0'}
              </span>
            </div>

            {/* Descripción: line-clamp-2 es la forma nativa y perfecta de cortar texto en Tailwind */}
            <p className="text-sm text-slate-500 mb-3.5 line-clamp-2 leading-relaxed pr-2">
              {tour.description || tour.summary || 'Descubre esta increíble experiencia.'}
            </p>

            {/* Metadatos: Convertidos en pequeñas "píldoras" (badges) para mejor escaneabilidad */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-md">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {tour.difficulty || 'Media'}
              </span>
              {tour.durationMinutes && (
                <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {tour.durationMinutes}m
                </span>
              )}
              {tour.distanceKm && (
                <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-md">
                  <Route className="w-3.5 h-3.5 text-slate-400" />
                  {tour.distanceKm}km
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    /* Estado Vacío: Mejor ilustrado y con texto más amigable */
    <div className="bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 p-16 text-center transition-colors hover:bg-slate-50">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5">
        <Map className="w-8 h-8 text-slate-300" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-1">Aún no hay rutas</h4>
      <p className="text-slate-500 font-medium text-sm">Este creador está preparando nuevos recorridos increíbles.</p>
    </div>
  )}
</div>
          </section>
        </div>
      </main>

      {/* MODAL DE PAÍSES */}
      {showCountriesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">

          <div className="relative bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            {/* HEADER */}
            <div className="relative px-8 pt-8 pb-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">

              <button
                onClick={() => setShowCountriesModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
              >
                ✕
              </button>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shadow-inner">
                  <Globe className="w-7 h-7 text-orange-500" />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Países Visitados
                  </h2>

                  <p className="text-sm text-slate-500 mt-1 max-w-md leading-relaxed">
                    Selecciona los destinos internacionales explorados por este creador.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-8">

              {/* CONTADOR */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Selección actual
                </p>

                <div className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full text-xs font-black">
                  {selectedCountries.length} países
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {COUNTRIES_LIST.map((country) => {
                  const isSelected = selectedCountries.includes(country.code);

                  return (
                    <button
                      key={country.code}
                      onClick={() => toggleCountry(country.code)}
                      className={`
                  group relative px-4 py-3 rounded-2xl text-sm font-bold border transition-all duration-200 text-left
                  ${isSelected
                          ? "bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-500/20 scale-[1.02]"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                        }
                `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{country.name}</span>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">

                <button
                  onClick={() => setShowCountriesModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all"
                >
                  Cancelar
                </button>

                <button
                  onClick={saveCountries}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  Guardar Países
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTour && (
        <TourDetailModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </div>
  );
}

function TourDetailModal({ tour, onClose }) {
  if (!tour) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl rounded-[32px] bg-white shadow-2xl overflow-hidden border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          aria-label="Cerrar modal de recorrido"
        >
          ✕
        </button>

        <div className="overflow-hidden">
          <img
            src={(tour.images && tour.images[0]) || tour.image || "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80"}
            alt={tour.name || tour.title}
            className="h-72 w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {tour.name || tour.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                {tour.description || tour.summary || 'Sin descripción disponible.'}
              </p>
            </div>
            <div className="rounded-3xl bg-orange-50 px-4 py-3 text-right shadow-sm shadow-orange-500/10">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-600 font-black">Precio</p>
              <p className="mt-2 text-3xl font-black text-slate-900">${tour.price || '0'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">Dificultad</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{tour.difficulty || 'Media'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">Duración</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{tour.durationMinutes ? `${tour.durationMinutes} min` : 'N/A'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">Distancia</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{tour.distanceKm ? `${tour.distanceKm} km` : 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {tour.location && (
              <span className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                {tour.location}
              </span>
            )}
            {tour.language && (
              <span className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                <Globe className="h-4 w-4" />
                {tour.language}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerProfile;