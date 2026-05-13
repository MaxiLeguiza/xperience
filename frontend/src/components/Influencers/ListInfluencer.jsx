// ListInfluencer.jsx
// -------------------------------------------------------------
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Navbar/Nav";
import { Search, ChevronDown, Users, MapPin, Video, Map, Navigation } from "lucide-react";

// =========================================================
// 🛠️ MOCK: En el futuro, esto vendrá de un GET a /api/influencers
// =========================================================
const influencersData = [
  {
    id: "infl-1",
    name: "Carlos Aventura",
    handle: "@carlos_aventura",
    description: "Apasionado por los deportes aéreos y de montaña. Comparto mis experiencias desde las cimas más altas de Mendoza y el mundo.",
    tags: ["Parapente", "Rafting", "Trekking"],
    stats: { followers: "1.2M", countries: 23, videos: 78 },
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "infl-2",
    name: "Sofía Explora",
    handle: "@sofia_explora",
    description: "Amante del turismo enológico y las cabalgatas al atardecer. Descubriendo los rincones más exclusivos de la ruta del vino.",
    tags: ["Enoturismo", "Cabalgatas", "Relax"],
    stats: { followers: "850K", countries: 12, videos: 142 },
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  }
];

const InfluencerCard = ({ influencer }) => (
  <Link
    to={`/Influencers/${influencer.id}`} // 🔥 Este enlace pasa el ID a la URL
    className="group bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden flex flex-col"
  >
    <div className="relative h-64 overflow-hidden">
      <img alt={`Fondo de ${influencer.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={influencer.image} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent" />
      <div className="absolute top-4 right-4">
        <img src={influencer.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
      </div>
      <div className="absolute bottom-4 left-5 right-5">
        <h3 className="text-2xl font-black text-white leading-tight">{influencer.name}</h3>
        <p className="text-orange-400 font-bold text-sm tracking-wide">{influencer.handle}</p>
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed flex-1">{influencer.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {influencer.tags.map((tag) => (
          <span key={tag} className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
            {tag}
          </span>
        ))}
      </div>
      <div className="border-t border-slate-100 mb-4"></div>
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5" title="Seguidores"><Users className="w-4 h-4 text-slate-400" /><span>{influencer.stats.followers}</span></div>
        <div className="flex items-center gap-1.5" title="Países visitados"><MapPin className="w-4 h-4 text-slate-400" /><span>{influencer.stats.countries}</span></div>
        <div className="flex items-center gap-1.5" title="Videos publicados"><Video className="w-4 h-4 text-slate-400" /><span>{influencer.stats.videos}</span></div>
      </div>
    </div>
  </Link>
);

const ListInfluencer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const filteredInfluencers = influencersData.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchTerm.toLowerCase()) || inf.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "" || inf.tags.includes(category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex-shrink-0 z-50"><Nav /></div>
      {/* 🔥 Eliminamos max-w-7xl y mx-auto. Ajustamos los paddings a px-4 sm:px-8 lg:px-12 */}
      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 md:py-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Nuestros <span className="text-orange-500">Creadores</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Descubre a los aventureros y expertos locales que diseñan las rutas más increíbles.
          </p>
        </div>

        {/* El buscador central sí conserva max-w-4xl para que no sea absurdamente largo */}
        <div className="bg-slate-700 p-2 rounded-2xl md:rounded-full shadow-lg shadow-slate-200/50 border border-slate-200 mb-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full flex items-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl md:rounded-full px-4 py-3 border border-slate-100 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 ml-3" placeholder="Buscar por nombre o usuario..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="hidden md:block w-px h-8 bg-slate-200 mx-2"></div>
            <div className="w-full md:w-auto relative flex items-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl md:rounded-full px-4 py-3 border border-slate-100 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
              <Map className="w-4 h-4 text-slate-400 flex-shrink-0 absolute left-4" />
              <select className="w-full md:w-48 bg-transparent border-none outline-none text-sm font-bold text-slate-600 appearance-none pl-7 pr-6 cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Todas las categorías</option>
                <option value="Parapente">Parapente</option>
                <option value="Trekking">Trekking</option>
                <option value="Rafting">Rafting</option>
                <option value="Enoturismo">Enoturismo</option>
                <option value="Cabalgatas">Cabalgatas</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-4" />
            </div>
          </div>
        </div>

        {filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredInfluencers.map((inf) => (
              <InfluencerCard key={inf.id} influencer={inf} /> 
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><Navigation className="w-8 h-8 text-slate-400" /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron creadores</h3>
            <p className="text-slate-500 text-sm">Prueba ajustando los filtros de búsqueda.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default ListInfluencer;