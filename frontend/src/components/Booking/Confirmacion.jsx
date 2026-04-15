import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

const Confirmacion = () => {
  const location = useLocation(); // Para recibir datos enviados desde Cart
  const navigate = useNavigate(); // Para navegar a la pagina de exito
  const { selectedItems = [], total = 0, paymentMethod = "credito" } =
    location.state || {}; // Items, total y metodo de pago

  // Estado para guardar los datos del formulario del cliente
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha: "",
    notas: "",
  });

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar en consola los datos por ahora
    console.log("Reserva enviada:", { formData, selectedItems, total });

    try {
      await clienteAxios.post("/api/reserva", {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        fecha: formData.fecha,
        notas: formData.notas,
        items: selectedItems,
        total,
        paymentMethod,
      });

      navigate("/exito");
    } catch (err) {
      console.error("Error enviando reserva:", err);
      alert("No se pudo registrar la reserva. Intentá nuevamente.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">
        
        {/* Titulo */}
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Confirmar tu reserva
        </h2>

        {/* Resumen del carrito */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">Resumen:</h3>
          {selectedItems.map((item) => (
            <p key={item.id} className="text-gray-600">
              {item.nombre} - {item.precio}
            </p>
          ))}
          <p className="mt-2 font-bold text-green-600">Total: ${total}</p>
          <p className="text-gray-700 mt-1 text-sm">
            Metodo de pago:{" "}
            <span className="font-semibold capitalize">
              {paymentMethod === "mercadopago"
                ? "Mercado Pago"
                : paymentMethod === "debito"
                  ? "Tarjeta debito"
                  : "Tarjeta credito"}
            </span>
          </p>
        </div>

        {/* Formulario de reserva */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nombre */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Teléfono */}
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Fecha de reserva */}
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Notas adicionales */}
          <textarea
            name="notas"
            placeholder="Notas adicionales (opcional)"
            value={formData.notas}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Botones */}
          <div className="flex justify-between">
            {/* Volver atrás */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
            >
              ⬅ Volver
            </button>

            {/* Confirmar reserva */}
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Confirmacion;
