// src/features/qr/useQr.js
import api from "@/lib/api";

// Crea un QR para un recorrido
export async function createQr({ recorridoId }) {
  const { data } = await api.post("/qr", { recorridoId });
  return data;
}

// Valida un QR existente (contenido leído del QR)
export async function validateQrContent({ content }) {
  const { data } = await api.post("/qr/validate", { content });
  return data;
}
