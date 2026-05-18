import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoutingLayer, { iconFor } from "./RoutingLayer";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Fix de íconos (Vite)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// Buscador con Leaflet-Geosearch
function SearchControl() {
  const map = useMap();
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const followingRef = useRef(false);
  const firstFixRef = useRef(false);

  const setVisualPos = (latlng, accuracy = 30) => {
    // marcador
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, {
        icon: L.divIcon({
          className: "",
          html: `
            <div style="
              width:18px;height:18px;border-radius:9999px;background:#1a73e8;
              border:3px solid #fff;box-shadow:0 0 0 4px rgba(26,115,232,.3);
              transform:translate(-50%,-50%);
            "></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(latlng);
    }
    // circulo
    const radius = Math.min(accuracy || 30, 80);
    if (!circleRef.current) {
      circleRef.current = L.circle(latlng, {
        radius,
        color: "#1a73e8",
        weight: 2,
        fillOpacity: 0.25,
      }).addTo(map);
    } else {
      circleRef.current.setLatLng(latlng);
      circleRef.current.setRadius(radius);
    }
  };

  useEffect(() => {
    const control = L.control({ position: "topright" });
    control.onAdd = () => {
      const container = L.DomUtil.create("div", "leaflet-bar");

      const btn = L.DomUtil.create("a", "", container);
      btn.href = "#";
      btn.title = "Ubicarme";
      btn.innerHTML = "📍";
      Object.assign(btn.style, {
        width: "32px",
        height: "32px",
        lineHeight: "32px",
        textAlign: "center",
        background: "#fff",
        fontSize: "20px",
        cursor: "pointer",
        borderRadius: "4px",
        boxShadow: "0 2px 6px rgba(0,0,0,.25)",
      });

      // Boton secundario: ingresar lat,lng manualmente (fallback)
      const manual = L.DomUtil.create("a", "", container);
      manual.href = "#";
      manual.title = "Ingresar coordenadas (fallback)";
      manual.innerHTML = "🧭";
      Object.assign(manual.style, {
        width: "32px",
        height: "32px",
        lineHeight: "32px",
        textAlign: "center",
        background: "#fff",
        fontSize: "18px",
        cursor: "pointer",
        borderRadius: "4px",
        marginTop: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,.25)",
      });

      L.DomEvent.on(btn, "click", async (e) => {
        L.DomEvent.stop(e);
        followingRef.current = !followingRef.current;
        btn.style.background = followingRef.current ? "#e8f0fe" : "#fff";

        if (!("geolocation" in navigator)) {
          alert("Este navegador no soporta geolocalizacion.");
          return;
        }

        // 1) Primer fix muy preciso (una sola vez)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            const latlng = L.latLng(latitude, longitude);
            console.log(
              `✅ Fix inicial: ${latitude}, ${longitude} (±${Math.round(
                accuracy,
              )} m)`,
            );
            setVisualPos(latlng, accuracy);
            if (!firstFixRef.current) {
              firstFixRef.current = true;
              map.setView(latlng, 16);
            }
            // 2) Luego iniciamos seguimiento continuo
            navigator.geolocation.watchPosition(
              (p) => {
                const { latitude, longitude, accuracy } = p.coords;
                const ll = L.latLng(latitude, longitude);
                setVisualPos(ll, accuracy);
                if (followingRef.current) map.panTo(ll);
              },
              (err) => {
                console.warn("watchPosition error:", err);
              },
              {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 20000,
              },
            );
          },
          (err) => {
            console.warn("getCurrentPosition error:", err);
            let msg = "No se pudo obtener tu ubicacion precisa.";
            if (err.code === 1)
              msg = "Permiso denegado. Revisa los permisos del navegador.";
            if (err.code === 2)
              msg = "Posicion no disponible. Verifica VPN/GPS/Red.";
            if (err.code === 3)
              msg = "Tiempo agotado intentando obtener tu posicion.";
            alert(`${msg}\nSe mostrara Mendoza.`);
            const fallback = L.latLng(-32.8895, -68.8458);
            setVisualPos(fallback, 200);
            map.setView(fallback, 12);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 20000,
          },
        );
      });

      L.DomEvent.on(manual, "click", (e) => {
        L.DomEvent.stop(e);
        const raw = prompt("Ingresa lat,lng (por ej: -32.8895,-68.8458)");
        if (!raw) return;
        const parts = raw.split(",").map((v) => parseFloat(v.trim()));
        if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
          const ll = L.latLng(parts[0], parts[1]);
          setVisualPos(ll, 30);
          map.setView(ll, 15);
          followingRef.current = false;
          btn.style.background = "#fff";
        } else {
          alert("Formato invalido. Usa lat,lng");
        }
      });

      return container;
    };
    control.addTo(map);

    return () => {
      map.removeControl(control);
      if (markerRef.current) map.removeLayer(markerRef.current);
      if (circleRef.current) map.removeLayer(circleRef.current);
    };
  }, [map]);

  return null;
}

/* ---------- GeoWatcher ---------- */
function GeoWatcher({ onChange }) {
  const map = useMap();
  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true, setView: false });
    const onFound = (e) => onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    map.on("locationfound", onFound);
    return () => {
      map.off("locationfound", onFound);
      map.stopLocate();
    };
  }, [map, onChange]);
  return null;
}

export default function MapView() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[-32.8895, -68.8458]} // Mendoza
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
         <SearchControl />
        <InvalidateSizeOnce />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[-32.8895, -68.8458]}>
          <Popup>Mendoza, Argentina 🚀</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

/* Animacion suave */
const style = document.createElement("style");
style.innerHTML = `
@keyframes slide-down {
  from { transform: translateY(-15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-down {
  animation: slide-down 0.25s ease-out;
}`;
document.head.appendChild(style);
