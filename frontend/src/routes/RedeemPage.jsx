// src/routes/RedeemPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { validateQrContent } from "@/features/qr/useQr";

export default function RedeemPage() {
  const [sp] = useSearchParams();
  const content = sp.get("content");
  const [status, setStatus] = useState("Procesando…");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!content) {
      setStatus("Falta parámetro 'content'");
      return;
    }

    validateQrContent({ content })
      .then((r) => {
        setResult(r);
        setStatus("QR validado ✅");
        // 👉 redirigir al mapa abriendo el recorrido por id
        if (r?.recorridoId) {
          // Si querés, acá también podrías guardar un cupón / acompañante en localStorage
          setTimeout(() => {
            window.location.href = `/?dest=${encodeURIComponent(
              r.recorridoId
            )}&fromQr=1`;
          }, 800);
        }
      })
      .catch((e) => {
        setStatus(
          e?.response?.data?.message || "QR inválido o ya utilizado ❌"
        );
      });
  }, [content]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Validación de QR</h1>
      <div className="mt-2 text-slate-700">{status}</div>
      {result && (
        <pre className="mt-4 p-3 bg-slate-100 rounded-lg overflow-auto text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
