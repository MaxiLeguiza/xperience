// src/routes/RedeemPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { validateQrContent } from "@/features/qr/useQr";

export default function RedeemPage() {
  const [sp] = useSearchParams();
  const content = sp.get("content");
  const [status, setStatus] = useState("Procesando...");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!content) {
      setStatus("Falta parametro 'content'");
      return;
    }

    validateQrContent({ content })
      .then((r) => {
        setResult(r);
        setStatus("QR validado. Redirigiendo...");
        if (r?.recorridoId) {
          setTimeout(() => {
            window.location.href = `/?dest=${encodeURIComponent(
              r.recorridoId
            )}&fromQr=1`;
          }, 200);
        }
      })
      .catch((e) => {
        setStatus(e?.response?.data?.message || "QR invalido o ya utilizado");
      });
  }, [content]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Validacion de QR</h1>
      <div className="mt-2 text-slate-700">{status}</div>
      {result && (
        <pre className="mt-4 p-3 bg-slate-100 rounded-lg overflow-auto text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
