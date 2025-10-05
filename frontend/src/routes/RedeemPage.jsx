// src/routes/RedeemPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api.js";

export default function RedeemPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const content = params.get("content");
  const [status, setStatus] = useState("Procesando…");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!content) {
      setStatus("Falta parámetro 'content'");
      return;
    }
    api
      .post("/qr/validate", { content })
      .then((r) => {
        setResult(r.data);
        setStatus("QR validado ✅");
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
      <button
        className="mt-4 px-3 py-2 rounded bg-slate-800 text-white"
        onClick={() => navigate("/", { replace: true })}
      >
        Volver
      </button>
    </div>
  );
}
