import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const location = useLocation(); // Hook para obtener datos enviados desde otra pantalla

  // Recuperamos los items seleccionados que vienen desde SearchResults
  const selectedItems = location.state?.selectedItems || [];

  // Calculamos el total sumando los precios de cada item
  const total = selectedItems.reduce((acc, item) => {
    // Convertimos el precio de string "$100" a número 100
    const precio = parseFloat(item.precio.replace("$", ""));
    return acc + precio;
  }, 0);

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Contenedor principal */}
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">
        
        {/* Título */}
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          🛒 Tu carrito de reserva
        </h2>

        {/* Si hay items en el carrito */}
        {selectedItems.length > 0 ? (
          <div className="space-y-4">
            
            {/* Listado de actividades seleccionadas */}
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                {/* Información de cada item */}
                <div>
                  <p className="font-semibold text-black">{item.nombre}</p>
                  <p className="text-gray-500 text-sm">
                    Capacidad: {item.capacidad} personas
                  </p>
                </div>

                {/* Precio a la derecha */}
                <p className="text-orange-600 font-semibold">{item.precio}</p>
              </div>
            ))}

            {/* Línea de total */}
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <p className="text-lg font-bold text-black">Total:</p>
              <p className="text-lg font-bold text-green-600">${total}</p>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between mt-6">
              {/* Botón para volver al inicio */}
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
              >
                ⬅ Volver al inicio
              </button>

              {/* Botón para ir a la confirmación */}
              <button
                onClick={() =>
                  navigate("/confirmacion", { state: { selectedItems, total } })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Continuar ➡
              </button>
            </div>
          </div>
        ) : (
          // Si el carrito está vacío mostramos este mensaje
          <p className="text-gray-500 text-center">
            No tienes items en tu carrito.
          </p>
        )}
      </div>
    </div>
  );
};

export default Cart;
