export const CUPONES = [
  { code: "XP10", type: "percent", value: 10, label: "10% de descuento" },
  { code: "XP15", type: "percent", value: 15, label: "15% de descuento" },
  { code: "INFLU20", type: "percent", value: 20, label: "20% influencer" },
  {
    code: "BIENVENIDO500",
    type: "fixed",
    value: 500,
    label: "$500 de descuento",
  },
];

export function getCouponFromStorage() {
  try {
    const raw = localStorage.getItem("xp:coupon");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.code) return parsed.code;
    return null;
  } catch {
    return null;
  }
}

export function findCoupon(code) {
  if (!code) return null;
  return (
    COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase()) || null
  );
}

export function applyCoupon(coupon, subtotal) {
  if (!coupon) return { discount: 0, total: subtotal };
  let discount = 0;
  if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
  else if (coupon.type === "fixed") discount = coupon.value;
  discount = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal - discount);
  return { discount, total };
}
