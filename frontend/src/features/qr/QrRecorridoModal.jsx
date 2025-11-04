// src/features/qr/QrRecorridoModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createQr } from "./useQr";

function downloadDataUrl(dataUrl, filename = "qr.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export default function QrRecorridoModal({ open, onClose, recorridoId }) {
  const [loading, setLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState(null);
  const appBase = typeof window !== "undefined" ? window.location.origin : "";

  const qrContentJson = useMemo(
    () => JSON.stringify({ recorridoId }),
    [recorridoId]
  );

  const redeemUrl = useMemo(
  () =>
    `${appBase}/redeem?content=${encodeURIComponent(
      qrContentJson
    )}&fromQr=1`,
  [appBase, qrContentJson]
);


  useEffect(() => {
    if (!open || !recorridoId) return;
    (async () => {
      try {
        setLoading(true);
        const resp = await createQr({ recorridoId });
        if (resp?.qr?.startsWith("data:image")) setQrBase64(resp.qr);
        else setQrBase64(null);
      } catch (e) {
        alert("No se pudo generar el QR. Verifica login/CORS/back.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, recorridoId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">QR del Recorrido</h3>
          <button onClick={onClose} className="text-slate-500">
            ✕
          </button>
        </div>

        <div className="text-sm text-slate-600">
          Recorrido: <b>{recorridoId}</b>
        </div>

        <div className="mt-3">
          <div className="text-sm font-medium">QR (generado por backend)</div>
          {loading && <div className="mt-2 text-sm">Generando…</div>}
          {!loading && qrBase64 && (
            <div className="mt-2 flex flex-col items-center gap-2">
              <img
                src={qrBase64}
                alt="QR backend"
                className="w-[220px] h-[220px] object-contain border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-slate-900 text-white"
                  onClick={() =>
                    downloadDataUrl(qrBase64, `qr-${recorridoId}.png`)
                  }
                >
                  Descargar PNG
                </button>
              </div>

              {/* 🔗 Nuevo: enlace directo */}
              <div className="mt-3 text-center">
                <p className="text-gray-600 text-sm mb-1">
                  También podés acceder con este enlace:
                </p>
                <a
                  href={redeemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 break-all"
                >
                  {redeemUrl}
                </a>
              </div>
            </div>
          )}

          {!loading && !qrBase64 && (
            <div className="mt-2 text-sm text-rose-600">
              El backend no devolvió una imagen base64 válida en{" "}
              <code>resp.qr</code>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
