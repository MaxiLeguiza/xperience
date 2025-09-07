// Importamos React y el hook useState para manejar el estado de los inputs
import React, { useState } from "react";
// useNavigate nos permite cambiar de página (navegar) con React Router
import { useNavigate } from "react-router-dom";

// El componente recibe como prop opcional "onSearch"
// Si existe, actualiza los resultados directamente en SearchResults
// Si no existe, hace la navegación hacia /resultados
const SearchBooking = ({ onSearch }) => {
  // Estados para guardar los valores ingresados por el usuario en el formulario
  const [checkIn, setCheckIn] = useState("");   // Fecha de ingreso
  const [checkOut, setCheckOut] = useState(""); // Fecha de salida
  const [personas, setPersonas] = useState(1);  // Número de personas

  // Hook de React Router para redirigir a otra ruta
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSearch = (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del form (recargar la página)

    // Creamos un objeto con los valores de la búsqueda
    const data = { checkIn, checkOut, personas };

    console.log("Buscando disponibilidad...", data);

    if (onSearch) {
      // 🔄 Caso cuando estamos en SearchResults.jsx
      // En vez de navegar, actualizamos directamente los resultados de la lista
      onSearch(data);
    } else {
      // 🚀 Caso inicial desde la pantalla principal
      // Navegamos hacia /resultados y enviamos los datos como "state"
      navigate("/resultados", { state: data });
    }
  };

  return (
    // Formulario principal con un espacio vertical entre inputs
    <form onSubmit={handleSearch} className="space-y-4">
      
      {/* Campo: fecha de ingreso */}
      <div>
        <label className="block text-gray-700 mb-1">Ingreso</label>
        <input
          type="date"
          value={checkIn} // Estado vinculado
          onChange={(e) => setCheckIn(e.target.value)} // Actualiza estado al cambiar input
          className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required // Campo obligatorio
        />
      </div>

      {/* Campo: fecha de salida */}
      <div>
        <label className="block text-gray-700 mb-1">Salida</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Campo: número de personas */}
      <div>
        <label className="block text-gray-700 mb-1">Personas</label>
        <input
          type="number"
          min="1" // No se permiten valores menores a 1
          value={personas}
          onChange={(e) => setPersonas(e.target.value)}
          className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botón de búsqueda */}
      <button
        type="submit"
        className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBooking;
