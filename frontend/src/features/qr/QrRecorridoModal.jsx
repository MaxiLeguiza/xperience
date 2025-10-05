// src/features/qr/QrRecorridoModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createQr } from "./useQr";

// Utilidad para descargar un dataURL
function downloadDataUrl(dataUrl, filename = "qr.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export default function QrRecorridoModal({ open, onClose, recorridoId }) {
  const [loading, setLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState(null); // imagen devuelta por el backend
  const appBase = typeof window !== "undefined" ? window.location.origin : "";

  // Contenido mínimo compatible con tu /qr/validate (usa recorridoId)
  const qrContentJson = useMemo(
    () => JSON.stringify({ recorridoId }),
    [recorridoId]
  );

  // URL conveniente para que, al escanear, abra tu app y dispare la validación
  const redeemUrl = useMemo(
    () => `${appBase}/redeem?content=${encodeURIComponent(qrContentJson)}`,
    [appBase, qrContentJson]
  );

  useEffect(() => {
    if (!open) return;
    if (!recorridoId) return;
    (async () => {
      try {
        setLoading(true);
        const resp = await createQr({ recorridoId });
        // resp.qr es el PNG base64 generado por tu servicio
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
          <h3 className="text-lg font-semibold">QR de Recorrido</h3>
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
            </div>
          )}
          {!loading && !qrBase64 && (
            <div className="mt-2 text-sm text-rose-600">
              El backend no devolvió una imagen base64 válida en{" "}
              <code>resp.qr</code>.
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-3">
          <div className="text-sm font-medium">
            QR alternativo (URL a /redeem)
          </div>
          <p className="text-xs text-slate-500">
            Este QR abre tu app en <code>/redeem</code> con el contenido del QR.
            Útil para demo en celular.
          </p>
          <div className="mt-2 flex flex-col items-center gap-2">
            <QRCodeCanvas value={redeemUrl} size={220} includeMargin />
            <div className="text-xs break-all">{redeemUrl}</div>
            <button
              className="px-3 py-2 rounded bg-slate-900 text-white"
              onClick={() => navigator.clipboard?.writeText(redeemUrl)}
            >
              Copiar enlace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
