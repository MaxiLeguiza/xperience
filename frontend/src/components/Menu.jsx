// Importamos hooks de React y los íconos de lucide-react
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import QrScanner from "@/features/qr/QrScanner";

// Componente principal Navbar
export default function Navbar() {
  // Estado para controlar si el sidebar está abierto o cerrado
  const [open, setOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // 👈 nuevo

  // Referencia al sidebar, nos permite detectar clicks fuera de él
  const sidebarRef = useRef(null);

  // Definimos los items del menú con su etiqueta y ruta
  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
    {
      label: "Escanear QR",
      href: null,
      action: () => {
        setShowScanner(true);
        setOpen(false);
      },
    },
  ];

  // useEffect para manejar clicks fuera del sidebar y cerrarlo
  useEffect(() => {
    // Función que detecta clicks fuera del sidebar
    function handleClickOutside(event) {
      // Si el click no está dentro del sidebar, cerramos el sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Si el sidebar está abierto, agregamos el listener para clicks
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Si no está abierto, nos aseguramos de remover el listener
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup: se ejecuta cuando el componente se desmonta o cambia 'open'
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // Dependencia: se ejecuta cada vez que cambia 'open'

  // Renderizamos el Navbar
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <div className="text-xl font-bold text-gray-800">Xperience</div>

          {/* BOTÓN HAMBURGUESA */}
          <button onClick={() => setOpen(true)}>
            <Menu size={24} /> {/* Ícono del menú */}
          </button>
        </div>
      </div>

      {/* SIDEBAR MENU */}
      <div
        ref={sidebarRef} // Referencia para detectar clicks fuera
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full" // Animación de entrada/salida
        }`}
      >
        {/* BOTÓN CERRAR */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-gray-800">Menú</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} /> {/* Ícono de cerrar */}
          </button>
        </div>

        {/* LINKS DEL MENÚ */}
        <div className="flex flex-col space-y-4 p-4">
          {menuItems.map((item, i) =>
            item.action ? (
              <button
                key={i}
                onClick={item.action}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <a
                key={i}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            )
          )}
        </div>
      </div>
      {/* MODAL: QR Scanner */}
      {showScanner && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowScanner(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Escanear QR</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-slate-500"
              >
                <X size={22} />
              </button>
            </div>

            {/* El componente del escáner */}
            <QrScanner />

            <div className="mt-3 text-xs text-slate-500">
              Tip: en móviles necesitás HTTPS (o localhost) para acceso a
              cámara.
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
