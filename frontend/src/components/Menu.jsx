// Importamos hooks de React y los íconos de lucide-react
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

// Componente principal Navbar
export default function Navbar() {
  // Estado para controlar si el sidebar está abierto o cerrado
  const [open, setOpen] = useState(false);

  // Referencia al sidebar, nos permite detectar clicks fuera de él
  const sidebarRef = useRef(null);

  // Definimos los items del menú con su etiqueta y ruta
  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
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
          {menuItems.map((item, i) => (
            <a
              key={i} // Key única para cada link
              href={item.href} // Ruta del link
              className="text-gray-700 hover:text-blue-600 transition-colors" // Estilos con hover
              onClick={() => setOpen(false)} // Cierra el sidebar al hacer click
            >
              {item.label} {/* Texto del link */}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
