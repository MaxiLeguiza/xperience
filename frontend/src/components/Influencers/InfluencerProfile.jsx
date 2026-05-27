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

        // Cargar tours
        if (response.data.tours && response.data.tours.length > 0) {
          fetchTours(response.data.tours);
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
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Obtener detalles de cada tour
      const toursData = await Promise.all(
        tourIds.map(tourId =>
          clienteAxios.get(`${API_URL}/api/recorrido/${tourId}`).catch(() => null)
        )
      );

      setTours(toursData.filter(t => t && t.data).map(t => t.data));
    } catch (error) {
      console.error("Error cargando tours:", error);
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
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Recorridos & Actividades
              </h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                {tours?.length || 0} Rutas
              </div>
            </div>

            {toursLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : tours?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tours.map((tour) => (
                  <div key={tour._id || tour.id} className="group bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="overflow-hidden h-72 w-full relative">
                      <img
                        src={(tour.images && tour.images[0]) || "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80"}
                        alt={tour.name || tour.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
                          {tour.category || "Actividad"}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="font-bold text-xl text-white mb-3 leading-tight drop-shadow-lg">{tour.name || tour.title}</h4>
                          <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-white/90">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="text-xs font-bold">{tour.difficulty || "Media"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">${tour.price || "0"}</span>
                            </div>
                            {tour.durationMinutes && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span className="text-xs font-bold">{tour.durationMinutes} min</span>
                              </div>
                            )}
                            {tour.distanceKm && (
                              <div className="flex items-center gap-1.5">
                                <Route className="w-4 h-4 flex-shrink-0" />
                                <span className="text-xs font-bold">{tour.distanceKm} km</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center">
                <Map className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Este creador aún no tiene recorridos publicados.</p>
              </div>
            )}
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
    </div>
  );
}

export default InfluencerProfile;