// InfluencerProfile.jsx
// Componente React que representa el perfil de un influencer en la app "Xperience".
// Usa TailwindCSS para mantener el estilo moderno, responsive y coherente con el resto del proyecto.

import React from "react";
// Íconos de Google (material-icons) — asegúrate de incluir el link en tu index.html
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


function InfluencerProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      {/* ======================== NAVBAR SUPERIOR ======================== */}
      <header className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO + BOTÓN MENU (solo móvil) */}
            <div className="flex items-center">
              <button className="text-text-light dark:text-text-dark mr-4 md:hidden">
                <span className="material-icons">menu</span>
              </button>
              <h1 className="text-2xl font-bold text-primary">Xperience</h1>
            </div>

            {/* LINKS DE NAVEGACIÓN (solo escritorio) */}
            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="#"
                className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Recorridos
              </a>
              <a
                href="#"
                className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Deportes
              </a>
              <a
                href="#"
                className="text-primary dark:text-primary border-b-2 border-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Influencers
              </a>
            </nav>

            {/* BOTÓN DE LOGIN */}
            <div className="flex items-center">
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======================== CONTENIDO PRINCIPAL ======================== */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ----------- COLUMNA IZQUIERDA: PERFIL ----------- */}
          <aside className="lg:col-span-4">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-xl text-center sticky top-24">
              {/* FOTO DE PERFIL */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNzD-FcvpRdhM9ug8_GLJOuedf1AOgNikGAwtHQhPaBV529A1cHBdYwEJBoXMqWR6U7crUoi7jQ_iymGPpbrbBSY00Z5R24Y0fhIMVlPBro5Ys4qShv6sZ10iKiTjltuSxQLEDAbR2PXmQ9W7FRsroyZv_MnGO_D7MB9TOEqDBSTZKoi3JXHG_KhVrnVJrpjLcXajYpHptgwSEnXL7oUoevMzhPGSNAZJT9fotGaCcY68JZthiakdwRoZRRfxUWopxD7pK8MWoVLQ"
                alt="Foto de perfil de Carlos Aventura"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary"
              />

              {/* INFORMACIÓN PRINCIPAL */}
              <h2 className="text-2xl font-bold">Carlos Aventura</h2>
              <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
                @carlos_aventura
              </p>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex justify-center space-x-4 mb-6">
                <button className="bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                  <span className="material-icons">person_add</span>
                  Seguir
                </button>
                <button className="bg-secondary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                  <span className="material-icons">email</span>
                  Contactar
                </button>
              </div>

              {/* DESCRIPCIÓN */}
              <p className="text-sm text-gray-700 dark:text-gray-300 text-left mb-6">
                Amante de la adrenalina y los paisajes increíbles. Compartiendo
                mis experiencias en parapente, rafting y trekking alrededor del
                mundo. ¡Únete a la aventura!
              </p>

              {/* ESTADÍSTICAS */}
              <div className="border-t border-border-light dark:border-border-dark pt-6">
                <h3 className="text-lg font-semibold mb-4 text-left">
                  Estadísticas
                </h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    { label: "Recorridos", value: "78" },
                    { label: "Deportes", value: "12" },
                    { label: "Seguidores", value: "1.2M" },
                    { label: "Países", value: "23" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-background-light dark:bg-background-dark p-4 rounded-lg"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ----------- COLUMNA DERECHA: PUBLICACIONES DESTACADAS ----------- */}
          <section className="lg:col-span-8">
            <h3 className="text-2xl font-bold mb-6">
              Publicaciones Destacadas
            </h3>

            {/* GRID DE PUBLICACIONES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVLex25VZs0BkaaZNbwg0dt1a08iWn8FPSArrma2cdtQGCs9ve56q-98v8dtJyElO7f85nAvKIAUFg-Pd5q29dIadZIwNqUBQpdrRYC2AtOk7EmeX6uppr-pqkGE6nGrPwRE4jFV7VCGAV-G9FFVphyWSQBjcofYN04QttNkctoSltRgkva7Uc3UxZMX2SYfPCKGVE-7-rfWipdad89-dCfTP17xRABLFOOZpQgbUWroqzrWFJ1G85L2eq96WR0AKZv3W6R7l4Jp8",
                  title: "Amanecer en el Fitz Roy",
                  icon: "terrain",
                  likes: "15.2k",
                  comments: "345",
                },
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa6-_5AcDNvgGJ6X4K3XGcFjF2XHfdhKYqxO7Q0AtytEov_IgOrUwUqdg10XPBsMoqsEPl30RHt9fWX03UpKN-jkl_OxuwZ2AgOLCMC44Wqs4WJy7jwTr7JPSw5pwhBliF420xw9nmxNkahB3qp5Izl_KMfPKOUznuahFmchDfj-x6HlagKJ-3k3siDHMjeOHCn2iaNfaDYr9XQnbzaVpYH9sw37uxF73dy2cXxLK91eSjxU6cx_8kTcVXRLxcR8vDtM7GKY64A3o",
                  title: "Volando sobre los Alpes",
                  icon: "paragliding",
                  likes: "22.8k",
                  comments: "789",
                },
                {
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB58hb-7TInfKf5TCaOS468mY3EUS0FySMdTFisi6DL6fK_CrCGUVDdSU8P2ks803uebHuZLBVU1VE4eizsQsB1i3miBj5McSvCcEvkgoiok6c4kEsm3S_Khk7865WyAUD8F4EhenH0SJCTLO9mszUNNCQVD6XtPuJ6AIhU292eDcwolxFtwSLSIWqs9PN1wqbLizajq0-Tm0WTR57YiNNW-umFveDn6Pgfti_vL5g4YXZ2nUCIl8mT3yijht0MNR_7BkwQXGHwlzM",
                  title: "Rafting en el Río Mendoza",
                  icon: "kayaking",
                  likes: "18.1k",
                  comments: "512",
                },
              ].map((post, i) => (
                <div
                  key={i}
                  className="group bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden relative"
                >
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                  {/* Capa que aparece al pasar el mouse */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center p-4">
                      <p className="font-semibold">{post.title}</p>
                      <div className="flex justify-center items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="material-icons text-sm">
                            favorite
                          </span>{" "}
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-icons text-sm">
                            comment
                          </span>{" "}
                          {post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Ícono superior derecho */}
                  <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-2">
                    <span className="material-icons text-base">
                      {post.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN "CARGAR MÁS" */}
            <div className="text-center mt-8">
              <button className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                Cargar más
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default InfluencerProfile;
