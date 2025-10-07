// src/features/qr/QrScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useNavigate } from "react-router-dom";
import { validateQrContent } from "./useQr";

export default function QrScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // limpiar lector al desmontar
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const startScan = async () => {
    setError(null);
    setResult(null);

    try {
      // Requisito: HTTPS (o localhost)
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: "environment" }, // cámara trasera en móviles
        },
      };

      readerRef.current = new BrowserMultiFormatReader();
      setScanning(true);

      await readerRef.current.decodeFromVideoDevice(
        null, // auto-select device (luego podés listar cámaras y elegir)
        videoRef.current,
        async (result, err) => {
          if (result) {
            const text = result.getText();

            // 1) Si es una URL con ?content=..., redirigimos a /redeem
            try {
              const url = new URL(text);
              const content = url.searchParams.get("content");
              if (content) {
                readerRef.current?.reset();
                setScanning(false);
                navigate(`/redeem?content=${encodeURIComponent(content)}`);
                return;
              }
            } catch {
              // no era una URL válida → seguimos
            }

            // 2) Si es JSON puro, llamamos al backend directamente
            try {
              // validamos que sea JSON
              JSON.parse(text);
              const resp = await validateQrContent({ content: text });
              setResult(resp);
              readerRef.current?.reset();
              setScanning(false);
            } catch (e) {
              setError("QR leído, pero el contenido no es válido para validar.");
              readerRef.current?.reset();
              setScanning(false);
            }
          } else if (err) {
            // errores de decodificación se ignoran (flujo normal mientras no encuentra QR)
          }
        }
      );
    } catch (e) {
      setError(
        e?.message ||
          "No se pudo iniciar la cámara. Verificá permisos y HTTPS (o localhost)."
      );
      setScanning(false);
    }
  };

  const stopScan = () => {
    readerRef.current?.reset();
    setScanning(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Escanear QR</h2>

      <div className="flex gap-2 mb-3">
        {!scanning ? (
          <button
            onClick={startScan}
            className="px-3 py-2 rounded bg-indigo-600 text-white"
          >
            Iniciar cámara
          </button>
        ) : (
          <button
            onClick={stopScan}
            className="px-3 py-2 rounded bg-slate-700 text-white"
          >
            Detener
          </button>
        )}
      </div>

      <div className="aspect-video bg-black/80 rounded-md overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      {error && (
        <div className="mt-3 text-sm text-rose-600">
          <b>Error:</b> {error}
        </div>
      )}

      {result && (
        <div className="mt-3">
          <div className="text-sm font-medium">Resultado de validación</div>
          <pre className="text-xs bg-slate-100 p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3">
        Nota: en iOS Safari, a veces la cámara sólo inicia tras un gesto del
        usuario (click). Asegurate de servir la app en HTTPS (o localhost) para
        que `getUserMedia` funcione.
      </p>
    </div>
  );
}
