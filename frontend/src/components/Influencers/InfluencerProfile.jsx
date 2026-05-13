// InfluencerProfile.jsx
// -------------------------------------------------------------
// UI/UX Premium Claro.
// Perfil de creador con banner, estadísticas limpias y galería con hover.
// -------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import { 
  UserPlus, Mail, MapPin, Video, Map, 
  Heart, MessageCircle, ArrowLeft, Loader2, Navigation 
} from "lucide-react";

// Descomentar esta línea cuando conectes tu base de datos
// import clienteAxios from "../../config/axios"; 

// =========================================================
// 🛠️ MOCK DATABASE: Simula lo que devolvería tu backend
// =========================================================
const mockDatabase = [
  {
    id: "infl-1",
    name: "Carlos Aventura",
    handle: "@carlos_aventura",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    description: "Amante de la adrenalina y los paisajes increíbles. Compartiendo mis experiencias en parapente, rafting y trekking alrededor del mundo. ¡Únete a la aventura!",
    stats: [
      { label: "Recorridos", value: "78" },
      { label: "Deportes", value: "12" },
      { label: "Seguidores", value: "1.2M" },
      { label: "Países", value: "23" },
    ],
    posts: [
      { id: 1, img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80", title: "Amanecer en el Fitz Roy", likes: "15.2k", comments: "345", category: "Trekking" },
      { id: 2, img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80", title: "Volando sobre los Alpes", likes: "22.8k", comments: "789", category: "Parapente" },
      { id: 3, img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80", title: "Rafting en el Río Mendoza", likes: "18.1k", comments: "512", category: "Rafting" },
    ]
  },
  {
    id: "infl-2",
    name: "Sofía Explora",
    handle: "@sofia_explora",
    coverImage: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    description: "Recorriendo las bodegas más exclusivas y disfrutando de paisajes relajantes. El turismo enológico es mi pasión.",
    stats: [
      { label: "Recorridos", value: "45" },
      { label: "Bodegas", value: "30" },
      { label: "Seguidores", value: "850K" },
      { label: "Países", value: "12" },
    ],
    posts: [
      { id: 4, img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80", title: "Cata en Valle de Uco", likes: "12k", comments: "120", category: "Enoturismo" },
    ]
  }
];

function InfluencerProfile() {
  const { id } = useParams(); // Lee el parámetro "id" desde la URL
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // =========================================================
    // 🔌 INTEGRACIÓN CON MONGODB (DESCOMENTAR CUANDO ESTÉ LISTO EL BACKEND)
    // =========================================================
    /*
    const fetchInfluencer = async () => {
      try {
        setLoading(true);
        // Ajusta la URL según tu backend
        const response = await clienteAxios.get(`/api/influencers/${id}`);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error al obtener el influencer:", error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencer();
    */

    // =========================================================
    // 🛠️ MOCK TEMPORAL: Simulamos el retraso de una API real
    // Cuando uses la API real, puedes borrar esta función loadMockData entera.
    // =========================================================
    const loadMockData = () => {
      setLoading(true);
      setTimeout(() => {
        const found = mockDatabase.find(inf => inf.id === id);
        setProfileData(found || null);
        setLoading(false);
      }, 600); // Simulamos 600ms de carga
    };
    
    loadMockData(); // Llamamos al mock por ahora
  }, [id]);

  // Pantalla de Carga
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="font-bold text-slate-500">Cargando perfil...</p>
      </div>
    );
  }

  // Pantalla de Error (No encontrado)
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

  // Mapeo dinámico de iconos para las estadísticas
  const getIconForStat = (label) => {
    switch(label.toLowerCase()) {
      case 'seguidores': return <UserPlus className="w-5 h-5 text-slate-400 mb-2" />;
      case 'países': return <MapPin className="w-5 h-5 text-slate-400 mb-2" />;
      case 'deportes': return <Navigation className="w-5 h-5 text-slate-400 mb-2" />;
      case 'recorridos': return <Map className="w-5 h-5 text-slate-400 mb-2" />;
      default: return <Map className="w-5 h-5 text-slate-400 mb-2" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex-shrink-0 z-50">
        <Nav />
      </div>

      {/* 🔥 Eliminamos max-w-7xl y mx-auto. Ajustamos los paddings a px-4 sm:px-8 lg:px-12 */}
      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 md:py-10 relative">
        
        {/* Botón Flotante para Volver (Ajustado el margin-left para acompañar el nuevo padding) */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-0 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2 text-slate-50 text-white hover:text-black transition-colors font-bold text-sm bg-orange-500/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-100 mt-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10 lg:mt-0">
          
          {/* ----------- COLUMNA IZQUIERDA: PERFIL E INFO ----------- */}
          <aside className="lg:col-span-4 xl:col-span-4 sticky top-24 mt-4">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              
              <div className="h-32 bg-slate-200 relative">
                <img src={profileData.coverImage} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>

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

                <div className="flex justify-center gap-3 mb-6">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-[#d86015] text-white px-4 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Seguir
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Contacto
                  </button>
                </div>

                <p className="text-sm text-slate-600 text-center mb-8 leading-relaxed">
                  {profileData.description}
                </p>

                <div className="border-t border-slate-100 pt-6 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {profileData.stats.map((stat, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                          {getIconForStat(stat.label)}
                          <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ----------- COLUMNA DERECHA: PUBLICACIONES DESTACADAS ----------- */}
          <section className="lg:col-span-8 xl:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                Rutas Destacadas
              </h3>
              <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                {profileData.posts?.length || 0} Actividades
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profileData.posts?.map((post) => (
                <div key={post.id} className="group bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden relative cursor-pointer">
                  <div className="overflow-hidden h-72 w-full relative">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="absolute top-4 left-4 z-20">
                       <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
                          {post.category}
                       </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-bold text-xl text-white mb-3 leading-tight drop-shadow-lg">{post.title}</h4>
                        <div className="flex items-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          <div className="flex items-center gap-1.5 text-white/90">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span className="text-sm font-bold">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/90">
                            <MessageCircle className="w-4 h-4 text-blue-400 fill-blue-400" />
                            <span className="text-sm font-bold">{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profileData.posts?.length > 0 && (
              <div className="text-center mt-12">
                <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-10 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5">
                  Cargar más actividades
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default InfluencerProfile;