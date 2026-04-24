import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";

export default function Exito() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Inyectar Material Icons automáticamente
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const {
    title = "Expedición",
    date = "Sin fecha",
    travelers = "1 Persona",
    code = "#XP-00000",
    image = "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  } = state || {};

  return (
    <div className="bg-[#090e15] text-white min-h-screen">

      {/* HEADER */}
     <Nav />
      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">

        {/* HERO */}
        <section className="text-center mb-12">
          <div className="relative mb-6 flex justify-center">
            <div className="absolute w-24 h-24 bg-orange-500/30 blur-2xl rounded-full"></div>
            <div className="relative bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center">
              <Icon name="check_circle" className="text-black text-4xl" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3">
            ¡Reserva Confirmada!
          </h1>

          <p className="text-gray-400 max-w-lg mx-auto">
            Tu Xperiencia ha sido procesada con éxito. Prepárate para una aventura inolvidable.
          </p>
        </section>

        {/* GRID */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">

            {/* CARD */}
            <div className="bg-[#141a22] rounded-xl overflow-hidden">

              <div className="relative h-64">
                <img src={image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="bg-cyan-400 text-black text-xs px-3 py-1 rounded-full font-bold">
                    CONFIRMADO
                  </span>
                  <h2 className="text-xl font-bold mt-2">{title}</h2>
                </div>
              </div>

              <div className="p-6 grid grid-cols-3 text-sm">

                <Info icon="calendar_today" label="FECHA" value={date} />
                <Info icon="group" label="VIAJEROS" value={travelers} />
                <Info icon="qr_code" label="CÓDIGO" value={code} />

              </div>
            </div>

            {/* INFO */}
            <div className="bg-[#1f2630] p-5 rounded-xl border-l-4 border-cyan-400 flex gap-3">
              <Icon name="info" className="text-cyan-400" />
              <div>
                <h3 className="font-bold">Información de Preparación</h3>
                <p className="text-sm text-gray-400">
                  Te enviamos un correo con todos los detalles. Recuerda corroborar la información y confirma con la agencia para evitar cualquier inconveniente.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-[#1f2630] p-6 rounded-xl">
              <h3 className="font-bold mb-4">Gestionar mi Reserva</h3>

              <div className="space-y-4">

                <Action icon="edit_calendar" title="Modificar" subtitle="Cambiar datos" />
                <Action icon="cancel" title="Cancelar" subtitle="Políticas" />

              </div>
            </div>

            {/* MAP */}
            <div className="bg-[#141a22] h-40 rounded-xl flex items-center justify-center flex-col">
            </div>

          </div>

        </div>

        {/* BOTÓN */}
        <div className="fixed bottom-10 right-10 hidden md:block">
          <button
            onClick={() => navigate("/Home")}
            className="bg-orange-500 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Explorar más aventuras
          </button>
        </div>

      </main>
    </div>
  );
}

/* 🔥 COMPONENTES AUXILIARES */

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}

function Info({ icon, label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <Icon name={icon} className="text-orange-500" />
        {value}
      </div>
    </div>
  );
}

function Action({ icon, title, subtitle }) {
  return (
    <button className="w-full flex justify-between items-center bg-[#141a22] p-4 rounded-lg hover:bg-[#1a222c] transition">
      <div className="flex gap-3 items-center">
        <Icon name={icon} />
        <div className="text-left">
          <p className="font-bold">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <Icon name="chevron_right" />
    </button>
  );
}