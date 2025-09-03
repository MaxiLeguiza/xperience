import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null); // Referencia al sidebar

  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ];

  // Detecta clicks fuera del sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <div className="text-xl font-bold text-gray-800">logo</div>

          {/* BOTÓN HAMBURGUESA */}
          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* SIDEBAR MENU */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* BOTÓN CERRAR */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-gray-800">Menú</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* LINKS DEL MENÚ */}
        <div className="flex flex-col space-y-4 p-4">
          {menuItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
