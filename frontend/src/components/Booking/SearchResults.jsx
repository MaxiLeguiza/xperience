// Importamos React y los hooks necesarios
import React, { useState, useEffect } from "react";
// useLocation para obtener datos de la ruta anterior, useNavigate para redireccionar
import { useLocation, useNavigate } from "react-router-dom";
// Importamos el buscador reutilizable
import SearchBooking from "../SearchBooking";


const SearchResults = () => {
  const navigate = useNavigate(); // Para navegar a otra página (ej: carrito)
  const location = useLocation(); // Para obtener filtros enviados desde otra página
  const { checkIn, checkOut, personas } = location.state || {}; // Filtros iniciales

  // Estado que guarda los filtros actuales
  const [filters, setFilters] = useState({
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    personas: personas || 1,
  });

  // Estado que guarda los resultados filtrados
  const [results, setResults] = useState([]);

  // Estado que guarda los items seleccionados por el usuario
  const [selectedItems, setSelectedItems] = useState([]);

  // Estado para el modal de "Ver más"
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Datos simulados antes de conectar al backend
  const mockResults = [
    {
      id: 1,
      nombre: "Aventura en la montaña",
      precio: "$100",
      capacidad: 2,
      descripcion: "Explora senderos únicos rodeados de paisajes increíbles.",
    },
    {
      id: 2,
      nombre: "Tour por la selva",
      precio: "$150",
      capacidad: 4,
      descripcion: "Adéntrate en la selva con guías expertos y fauna exótica.",
    },
    {
      id: 3,
      nombre: "Escapada a la playa",
      precio: "$200",
      capacidad: 6,
      descripcion: "Disfruta de arenas blancas y aguas cristalinas para relajarte.",
    },
    {
      id: 4,
      nombre: "Cabaña en el bosque",
      precio: "$80",
      capacidad: 2,
      descripcion: "Vive una experiencia acogedora rodeado de naturaleza.",
    },
  ];

  // useEffect para filtrar resultados cuando cambian los filtros
  useEffect(() => {
    if (filters.checkIn && filters.checkOut) {
      // Filtramos resultados según capacidad de personas
      const filtrados = mockResults.filter(
        (item) => parseInt(filters.personas) <= item.capacidad
      );
      setResults(filtrados);

      // 🔗 Ejemplo de conexión futura con backend (comentado)
      /*mongodb://localhost:27017/nest-xperience
      fetch("http://localhost:27017/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
      */
    }
  }, [filters]);

  // Función que actualiza filtros desde el buscador
  const handleSearch = (data) => setFilters(data);

  // Función para añadir o quitar un item de la lista de selección
  const toggleSelect = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Función para quitar item directamente desde "Tu selección"
  const removeFromSelected = (item) =>
    setSelectedItems(selectedItems.filter((i) => i.id !== item.id));

  return (
   
    // Grid principal: buscador a la izquierda, resultados a la derecha
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

      {/* Columna izquierda: buscador + lista de selección */}
      <div className="md:col-span-1">
        <div className="bg-white p-4 rounded-2xl shadow-lg">

          {/* Título del buscador */}
          <h2 className="text-xl font-bold mb-4 text-center text-black">
            Ajustar búsqueda
          </h2>

          {/* Componente buscador */}
          <SearchBooking onSearch={handleSearch} />

          {/* Lista de selección */}
          {selectedItems.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-black mb-2">
                Tu selección
              </h3>

              {/* Contenedor con scroll si hay más de 3 items */}
              <div
                className={`overflow-y-auto ${
                  selectedItems.length > 3 ? "h-60" : ""
                }`}
              >
                <ul className="space-y-2">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 rounded-xl border border-orange-400 flex justify-between items-center"
                    >
                      {/* Información del item */}
                      <div>
                        <p className="font-medium text-black">{item.nombre}</p>
                        <p className="text-sm text-gray-600">{item.precio}</p>
                      </div>
                      {/* Botón X para quitar item */}
                      <button
                        onClick={() => removeFromSelected(item)}
                        className="text-red-500 font-bold text-lg hover:text-red-700 transition"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón Continuar */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert("Debes seleccionar al menos un recorrido antes de continuar.");
                      return;
                    }
                    // 🔗 Redirige al carrito con los items seleccionados
                    navigate("/carrito", { state: { selectedItems } });
                  }}
                  className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-700 transition"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Columna derecha: resultados */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Resultados disponibles
          </h2>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`border p-4 rounded-xl shadow-sm transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "hover:shadow-md"
                    }`}
                  >
                    <h3 className="text-lg font-semibold">{item.nombre}</h3>
                    <p className="text-gray-600">{item.precio}</p>
                    <p className="text-gray-500 text-sm mb-2">
                      Capacidad: {item.capacidad} personas
                    </p>
                    <p className="text-gray-500 text-sm">{item.descripcion}</p>

                    {/* Botones a la derecha */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => toggleSelect(item)}
                        className={`px-4 py-2 rounded-xl transition ${
                          isSelected
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                      >
                        {isSelected ? "Quitar" : "Añadir a lista"}
                      </button>

                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No se encontraron resultados.</p>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedDetail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-black">
              {selectedDetail.nombre}
            </h2>
            <p className="text-gray-600 mb-2">{selectedDetail.precio}</p>
            <p className="text-gray-500 mb-4">{selectedDetail.descripcion}</p>
            <p className="text-sm text-gray-400 mb-4">
              Capacidad: {selectedDetail.capacidad} personas
            </p>

            <button
              onClick={() => setSelectedDetail(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
