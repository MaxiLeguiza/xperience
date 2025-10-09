import React from "react";
import { Link } from "react-router-dom";
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>


// Array de influencers con todos los datos necesarios para mostrar en las tarjetas
const influencers = [
  {
    name: "Carlos Aventura",
    handle: "@carlos_aventura",
    description:
      "Apasionado por los deportes aéreos y de montaña. Comparto mis experiencias desde las cimas más altas.",
    tags: [
      { icon: "paragliding", label: "Parapente" },
      { icon: "kayaking", label: "Rafting" },
      { icon: "terrain", label: "Trekking" },
    ],
    stats: { followers: "1.2M", countries: "23 Países", videos: 78 },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNzD-FcvpRdhM9ug8_GLJOuedf1AOgNikGAwtHQhPaBV529A1cHBdYwEJBoXMqWR6U7crUoi7jQ_iymGPpbrbBSY00Z5R24Y0fhIMVlPBro5Ys4qShv6sZ10iKiTjltuSxQLEDAbR2PXmQ9W7FRsroyZv_MnGO_D7MB9TOEqDBSTZKoi3JXHG_KhVrnVJrpjLcXajYpHptgwSEnXL7oUoevMzhPGSNAZJT9fotGaCcY68JZthiakdwRoZRRfxUWopxD7pK8MWoVLQ",
  },
  // Puedes agregar más influencers aquí siguiendo la misma estructura
];


// Componente para una sola tarjeta de influencer
const InfluencerCard = ({ influencer }) => (

    

  <Link
    to="/Influencers" // En React Router, usamos Link para navegación interna
    className="group bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out"
  >
    {/* Contenedor de la imagen y el nombre encima */}
    <div className="relative">
      <img
        alt={`Foto de perfil de ${influencer.name}`}
        className="w-full h-56 object-cover"
        src={influencer.image}
      />
      {/* Gradiente negro para que el texto sea legible sobre la imagen */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-xl font-bold text-white">{influencer.name}</h3>
        <p className="text-sm text-gray-300">{influencer.handle}</p>
      </div>
    </div>

    {/* Información del influencer: descripción, tags y estadísticas */}
    <div className="p-4">
      {/* Descripción */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        {influencer.description}
      </p>

      {/* Tags (actividades/deportes) */}
      <div className="flex justify-start items-center gap-2 flex-wrap mb-3">
        {influencer.tags.map((tag) => (
          <span
            key={tag.label}
            className="bg-red-100 text-secondary text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
          >
            <span className="material-icons text-sm">{tag.icon}</span>{" "}
            {tag.label}
          </span>
        ))}
      </div>

      {/* Estadísticas: seguidores, países, videos */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="material-icons text-base text-primary">group</span>
          <span>{influencer.stats.followers}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-base text-primary">place</span>
          <span>{influencer.stats.countries}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-base text-primary">
            video_library
          </span>
          <span>{influencer.stats.videos}</span>
        </div>
      </div>
    </div>
  </Link>
);

// Componente principal que renderiza toda la página de influencers
const ListInfluencer = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      {/* Header / Navbar */}
      <header className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y menú hamburguesa */}
            <div className="flex items-center">
              <button className="text-text-light dark:text-text-dark mr-4 md:hidden">
                <span className="material-icons">menu</span>
              </button>
              <h1 className="text-2xl font-bold text-primary">
                <Link to="/">Xperience</Link> {/* Logo clicable */}
              </h1>
            </div>

            {/* Navegación desktop */}
            <div className="hidden md:block">
              <nav className="flex items-center space-x-4">
                <Link
                  to="#"
                  className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Recorridos
                </Link>
                <Link
                  to="#"
                  className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Deportes
                </Link>
                <Link
                  to="#"
                  className="text-primary dark:text-primary border-b-2 border-primary px-3 py-2 text-sm font-medium"
                >
                  Influencers
                </Link>
              </nav>
            </div>

            {/* Botón login */}
            <div className="flex items-center">
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buscador y filtro */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
            Explora Influencers
          </h2>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Buscador */}
              <div className="relative md:col-span-2">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Buscar por nombre, deporte..."
                  type="text"
                />
              </div>

              {/* Filtro */}
              <div className="relative">
                <select className="w-full pl-4 pr-10 py-2 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark rounded-md appearance-none focus:ring-primary focus:border-primary">
                  <option>Filtrar por categoría</option>
                  <option>Parapente</option>
                  <option>Trekking</option>
                  <option>Rafting</option>
                  <option>Ciclismo</option>
                  <option>Surf</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {influencers.map((inf) => (
            <InfluencerCard key={inf.name} influencer={inf} /> // Renderizamos cada tarjeta
          ))}
        </div>

        {/* Botón para cargar más */}
        <div className="text-center mt-12">
          <button className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
            Cargar más influencers
          </button>
        </div>
      </main>
    </div>
  );
};

export default ListInfluencer;
