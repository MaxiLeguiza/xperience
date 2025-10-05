import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recuperamos los items seleccionados
  const selectedItems = location.state?.selectedItems || [];

  // Calculamos el total sumando los precios de cada item
  const subtotal = selectedItems.reduce((acc, item) => {
    const precio = parseFloat(item.precio.replace("$", ""));
    return acc + precio;
  }, 0);

  // 🎟️ Estado para el cupón
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState("");

  // 🎯 Catálogo de cupones válidos
  const coupons = [
    { code: "XP10", type: "percent", value: 10, label: "10% de descuento" },
    { code: "XP20", type: "percent", value: 20, label: "20% de descuento" },
    {
      code: "BIENVENIDO500",
      type: "fixed",
      value: 500,
      label: "$500 de descuento",
    },
  ];

  // 📉 Aplica el cupón al subtotal
  const applyCoupon = () => {
    setError("");

    const found = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!found) {
      setError("❌ Cupón inválido o expirado.");
      setCoupon(null);
      return;
    }

    setCoupon(found);
  };

  // 💸 Calcula el descuento y total final
  const discount = coupon
    ? coupon.type === "percent"
      ? (subtotal * coupon.value) / 100
      : coupon.value
    : 0;

  const total = Math.max(subtotal - discount, 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          🛒 Tu carrito de reserva
        </h2>

        {selectedItems.length > 0 ? (
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold text-black">{item.nombre}</p>
                  <p className="text-gray-500 text-sm">
                    Capacidad: {item.capacidad} personas
                  </p>
                </div>
                <p className="text-orange-600 font-semibold">{item.precio}</p>
              </div>
            ))}

            {/* Subtotal */}
            <div className="flex justify-between items-center mt-4 border-t pt-3">
              <p className="text-lg font-semibold text-black">Subtotal:</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(subtotal)}
              </p>
            </div>

            {/* Campo para ingresar cupón */}
            <div className="mt-4">
              <p className="font-semibold text-black mb-2">
                ¿Tenés un cupón de descuento?
              </p>
              {!coupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cualquier cupon de Influencer"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-black"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Aplicar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg">
                  <p>
                    Cupón aplicado:{" "}
                    <span className="font-bold">{coupon.code}</span> (
                    {coupon.label})
                  </p>
                  <button
                    onClick={() => setCoupon(null)}
                    className="text-red-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
              )}

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            {/* Descuento */}
            {coupon && (
              <div className="flex justify-between items-center mt-3">
                <p className="text-lg font-semibold text-green-700">
                  Descuento:
                </p>
                <p className="text-lg font-semibold text-green-700">
                  −{formatCurrency(discount)}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <p className="text-lg font-bold text-black">Total final:</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(total)}
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
              >
                ⬅ Volver al inicio
              </button>

              <button
                onClick={() =>
                  navigate("/confirmacion", {
                    state: { selectedItems, total, coupon },
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Continuar ➡
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No tienes items en tu carrito.
          </p>
        )}
      </div>
    </div>
  );
};

export default Cart;
