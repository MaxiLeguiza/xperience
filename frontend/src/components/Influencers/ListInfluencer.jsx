// ListInfluencer.jsx
// -------------------------------------------------------------
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../Navbar/Nav";
// 🔥 CORRECCIÓN: Agregamos UserPlus y Loader2 a la importación
import { Search, ChevronDown, Users, MapPin, Video, Map, Navigation, Plus, X, ImagePlus, UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const InfluencerCard = ({ influencer }) => (
  <Link
    to={`/Influencers/${influencer.id || influencer._id}`}
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
        {(influencer.tags || []).map((tag) => (
          <span key={tag} className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
            {tag}
          </span>
        ))}
      </div>
      {/*} <div className="border-t border-slate-100 mb-4"></div>
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5" title="Seguidores"><Users className="w-4 h-4 text-slate-400" /><span>{influencer.stats?.followers || "0"}</span></div>
        <div className="flex items-center gap-1.5" title="Países visitados"><MapPin className="w-4 h-4 text-slate-400" /><span>{influencer.stats?.countries || "0"}</span></div>
        <div className="flex items-center gap-1.5" title="Videos publicados"><Video className="w-4 h-4 text-slate-400" /><span>{influencer.stats?.videos || "0"}</span></div>
      </div>*/}
    </div>
  </Link>
);

function AddInfluencerModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "", handle: "@", description: "", mainCategories: []
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const AVAILABLE_CATEGORIES = [
    "Trekking",
    "Senderismo",
    "Andinismo",
    "Escalada",
    "Escalada en Roca",
    "Montañismo",
    "Alta Montaña",
    "Parapente",
    "Paracaidismo",
    "Rafting",
    "Kayak",
    "Canotaje",
    "Hidrospeed",
    "Mountain Bike",
    "Ciclismo de Montaña",
    "Downhill",
    "Enduro",
    "Trail Running",
    "Running",
    "Cabalgatas",
    "Rappel",
    "Tirolesa",
    "Puenting",
    "4x4 Off Road",
    "Sandboard",
    "Esquí",
    "Snowboard",
    "Freeride",
    "Heliski",
    "Patinaje sobre Hielo",
    "Pesca Deportiva",
    "Caza Deportiva",
    "Safari Fotográfico",
    "Vuelo en Globo",
    "MotoCross",
    "ATV",
    "Cuatriciclos",
    "Supervivencia",
    "Campamento",
    "Astroturismo",
    "Termalismo",
    "Enoturismo",
    "Turismo Aventura",
    "Ecoturismo",
    "Turismo Rural",
    "Turismo Cultural",
    "Turismo Gastronómico",
    "Relax",
    "Wellness",
    "Lujo"
  ];
  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const toggleCategory = (category) => {
    const current = formData.mainCategories || [];
    if (current.includes(category)) {
      setFormData({ ...formData, mainCategories: current.filter(c => c !== category) });
    } else if (current.length < 5) {
      setFormData({ ...formData, mainCategories: [...current, category] });
    }
  };

  const uploadToCloudinary = async (file) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) return null;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"; // Default
    let coverUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"; // Default

    try {
      if (avatarFile) {
        const uploadedUrl = await uploadToCloudinary(avatarFile);
        if (uploadedUrl) avatarUrl = uploadedUrl;
        else avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
      }

      if (coverFile) {
        const uploadedUrl = await uploadToCloudinary(coverFile);
        if (uploadedUrl) coverUrl = uploadedUrl;
        else coverUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
      }

      const newInfluencer = {
        name: formData.name,
        handle: formData.handle.startsWith("@") ? formData.handle : `@${formData.handle}`,
        description: formData.description,
        tags: formData.mainCategories && formData.mainCategories.length > 0 ? formData.mainCategories : ["Sin categoría"],
        mainCategories: formData.mainCategories || [],
        stats: { followers: "0", countries: 0, videos: 0 },
        avatar: avatarUrl,
        image: coverUrl,
        followers: [],
        countries: [],
        tours: []
      };

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${API_URL}/api/influencers`, newInfluencer);

      onAdd(response.data);

      setFormData({ name: "", handle: "@", description: "", mainCategories: [] });
      setAvatarFile(null); setAvatarPreview(null);
      setCoverFile(null); setCoverPreview(null);
      onClose();

    } catch (error) {
      console.error("Error guardando influencer:", error);
      alert("Hubo un error guardando el creador. Verifica tu conexión al servidor.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 max-w-2xl w-full relative overflow-hidden animate-in zoom-in-95 duration-200 my-8">

        {/* HEADER */}
        <div className="relative px-8 pt-8 pb-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">

          <button
            onClick={onClose}
            disabled={isUploading}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shadow-inner">
              <UserPlus className="w-7 h-7 text-orange-500" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Registrar Creador
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-md">
                Asocia un influencer a tu agencia y personaliza su perfil profesional.
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-7 max-h-[80vh] overflow-y-auto"
        >

          {/* IMÁGENES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Imagen de Perfil
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">

              {/* AVATAR */}
              <div className="col-span-1">
                <div className="relative aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center overflow-hidden cursor-pointer group">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                      alt="Avatar preview"
                    />
                  ) : (
                    <div className="text-center">
                      <UserPlus className="w-7 h-7 text-slate-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                      <span className="text-[11px] font-bold text-slate-400 block">
                        Avatar
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PORTADA */}
              <div className="col-span-2">
                <div className="relative h-full min-h-[140px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center overflow-hidden cursor-pointer group">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      className="w-full h-full object-cover"
                      alt="Cover preview"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                      <span className="text-xs font-bold text-slate-400 block">
                        Foto de portada
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Nombre Real
              </label>

              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                placeholder="Ej: Carlos Mendoza"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Usuario / Red Social
              </label>

              <input
                required
                type="text"
                value={formData.handle}
                onChange={(e) =>
                  setFormData({ ...formData, handle: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                placeholder="@usuario"
              />
            </div>
          </div>

          {/* CATEGORÍAS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Categorías Principales
              </label>

              <div className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full text-[11px] font-black">
                {formData.mainCategories?.length || 0}/5
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const active = formData.mainCategories?.includes(cat);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`
                px-4 py-3 rounded-2xl font-bold text-sm border transition-all duration-200
                ${active
                        ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 scale-[1.02]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                      }
              `}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Breve Biografía
            </label>

            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none resize-none transition-all"
              placeholder="Describe el perfil, experiencias y estilo de contenido del creador..."
            />
          </div>

          {/* FOOTER */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Creador"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ListInfluencer = () => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [influencersList, setInfluencersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAgency = auth?.role === "agencia" || auth?.user?.role === "agencia";

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await axios.get(`${API_URL}/api/influencers`);

        let fetchedData = response.data;
        if (!Array.isArray(fetchedData) && fetchedData && Array.isArray(fetchedData.data)) {
          fetchedData = fetchedData.data;
        }

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setInfluencersList(fetchedData);
        } else {
          setInfluencersList(initialInfluencersData);
        }
      } catch (error) {
        console.error("Error cargando BD, usando mocks locales:", error);
        const saved = localStorage.getItem("agencyInfluencersDB");

        try {
          const parsedSaved = saved ? JSON.parse(saved) : null;
          if (Array.isArray(parsedSaved)) {
            setInfluencersList(parsedSaved);
          } else {
            setInfluencersList(initialInfluencersData);
          }
        } catch {
          setInfluencersList(initialInfluencersData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  const safeInfluencersList = Array.isArray(influencersList) ? influencersList : [];

  const filteredInfluencers = safeInfluencersList.filter(inf => {
    const nameStr = inf.name || "";
    const handleStr = inf.handle || "";

    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || handleStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "" || (inf.tags && inf.tags.includes(category));
    return matchesSearch && matchesCategory;
  });

  const handleAddInfluencer = (newInfluencer) => {
    const updatedList = [newInfluencer, ...(Array.isArray(influencersList) ? influencersList : [])];
    setInfluencersList(updatedList);
    localStorage.setItem("agencyInfluencersDB", JSON.stringify(updatedList));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex-shrink-0 z-50"><Nav /></div>
      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 md:py-10 relative">

        <div className="text-center mb-10 relative">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Nuestros <span className="text-orange-500">Creadores</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Descubre a los aventureros y expertos locales que diseñan las rutas más increíbles.
          </p>

          {isAgency && (
            <div className="absolute top-0 right-0 hidden md:block">
              <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 text-sm rounded-full shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5">
                <Plus className="w-4 h-4" /> Registrar Creador
              </button>
            </div>
          )}
        </div>

        {isAgency && (
          <div className="md:hidden flex justify-center mb-6">
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 text-sm rounded-full shadow-md transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Registrar Creador
            </button>
          </div>
        )}

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
                <option value="Trekking">Trekking</option>
                <option value="Senderismo">Senderismo</option>
                <option value="Andinismo">Andinismo</option>
                <option value="Escalada">Escalada</option>
                <option value="Escalada en Roca">Escalada en Roca</option>
                <option value="Montañismo">Montañismo</option>
                <option value="Alta Montaña">Alta Montaña</option>
                <option value="Parapente">Parapente</option>
                <option value="Paracaidismo">Paracaidismo</option>
                <option value="Rafting">Rafting</option>
                <option value="Kayak">Kayak</option>
                <option value="Canotaje">Canotaje</option>
                <option value="Hidrospeed">Hidrospeed</option>
                <option value="Mountain Bike">Mountain Bike</option>
                <option value="Ciclismo de Montaña">Ciclismo de Montaña</option>
                <option value="Downhill">Downhill</option>
                <option value="Enduro">Enduro</option>
                <option value="Trail Running">Trail Running</option>
                <option value="Running">Running</option>
                <option value="Cabalgatas">Cabalgatas</option>
                <option value="Rappel">Rappel</option>
                <option value="Tirolesa">Tirolesa</option>
                <option value="Puenting">Puenting</option>
                <option value="4x4 Off Road">4x4 Off Road</option>
                <option value="Sandboard">Sandboard</option>
                <option value="Esquí">Esquí</option>
                <option value="Snowboard">Snowboard</option>
                <option value="Freeride">Freeride</option>
                <option value="Heliski">Heliski</option>
                <option value="Patinaje sobre Hielo">Patinaje sobre Hielo</option>
                <option value="Pesca Deportiva">Pesca Deportiva</option>
                <option value="Caza Deportiva">Caza Deportiva</option>
                <option value="Safari Fotográfico">Safari Fotográfico</option>
                <option value="Vuelo en Globo">Vuelo en Globo</option>
                <option value="MotoCross">MotoCross</option>
                <option value="ATV">ATV</option>
                <option value="Cuatriciclos">Cuatriciclos</option>
                <option value="Supervivencia">Supervivencia</option>
                <option value="Campamento">Campamento</option>
                <option value="Astroturismo">Astroturismo</option>
                <option value="Termalismo">Termalismo</option>
                <option value="Enoturismo">Enoturismo</option>
                <option value="Turismo Aventura">Turismo Aventura</option>
                <option value="Ecoturismo">Ecoturismo</option>
                <option value="Turismo Rural">Turismo Rural</option>
                <option value="Turismo Cultural">Turismo Cultural</option>
                <option value="Turismo Gastronómico">Turismo Gastronómico</option>
                <option value="Relax">Relax</option>
                <option value="Wellness">Wellness</option>
                <option value="Lujo">Lujo</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-4" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Cargando base de datos...</p>
          </div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredInfluencers.map((inf) => (
              <InfluencerCard key={inf._id || inf.id} influencer={inf} />
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

      <AddInfluencerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddInfluencer}
      />

    </div>
  );
};

export default ListInfluencer;