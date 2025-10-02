import React from "react";
import { useNavigate } from "react-router-dom";

const Exito = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Reserva confirmada! ✅</h1>
        <p className="text-gray-700 mb-6">
          Gracias por reservar con nosotros. Revisa tu correo para más detalles.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Exito;
