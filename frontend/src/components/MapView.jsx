import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import RoutingLayer, { iconFor } from "./RoutingLayer";
import { useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import WeatherCard from "../components/clima/WeatherCard";
import QrRecorridoModal from "../features/qr/QrRecorridoModal";

/* -------------------- Helpers -------------------- */
function InvalidateSizeOnce() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

function FitToBounds({ positions, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (!positions.length || !trigger) return;
    const b = L.latLngBounds(positions);
    map.fitBounds(b, { padding: [30, 30] });
  }, [positions, trigger, map]);
  return null;
}

/* ---------- 📍 Control de ubicación ---------- */
function LocateControl() {
  const map = useMap();
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const followingRef = useRef(false);
  const firstFixRef = useRef(false);

  useEffect(() => {
    const control = L.control({ position: "topright" });
    control.onAdd = () => {
      const container = L.DomUtil.create("div", "leaflet-bar");
      const btn = L.DomUtil.create("a", "", container);
      btn.href = "#";
      btn.title = "Ubicarme";
      btn.innerHTML = "📍";
      btn.style.width = "30px";
      btn.style.height = "30px";
      btn.style.lineHeight = "30px";
      btn.style.textAlign = "center";
      btn.style.background = "#fff";
      btn.style.fontSize = "20px";
      btn.style.cursor = "pointer";
      btn.style.borderRadius = "4px";

      L.DomEvent.on(btn, "click", (e) => {
        L.DomEvent.stop(e);
        followingRef.current = !followingRef.current;
        btn.style.background = followingRef.current ? "#e8f0fe" : "#fff";
        map.locate({
          watch: true,
          enableHighAccuracy: true,
          setView: true,
          maxZoom: 17,
        });
      });

      return container;
    };
    control.addTo(map);

    const onFound = (e) => {
      const { latlng, accuracy } = e;

      if (!markerRef.current) {
        markerRef.current = L.marker(latlng, {
          icon: L.divIcon({
            className: "",
            html: `<div style="width:18px;height:18px;border-radius:9999px;background:#1a73e8;
                    border:3px solid #fff;box-shadow:0 0 0 4px rgba(26,115,232,0.30);
                    transform:translate(-50%,-50%);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        }).addTo(map);
      } else {
        markerRef.current.setLatLng(latlng);
      }

      const radius = Math.min(accuracy || 30, 50);
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

      if (!firstFixRef.current) {
        firstFixRef.current = true;
        map.setView(latlng, 15);
      }

      if (followingRef.current) map.panTo(latlng);
    };

    const onError = () => {
      alert("No se pudo obtener tu ubicación exacta. Mostrando Mendoza.");
      const fallback = L.latLng(-32.8895, -68.8458);
      map.setView(fallback, 13);
      if (!markerRef.current)
        markerRef.current = L.marker(fallback).addTo(map);
    };

    map.on("locationfound", onFound);
    map.on("locationerror", onError);

    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onError);
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

/* ----------------------------------------------- */

export default function MapView({ items = [] }) {
  const location = useLocation();
  const [selected, setSelected] = useState(null);
  const [routeTo, setRouteTo] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [filters, setFilters] = useState({
    dificultad: "cualquiera",
    temporada: "cualquiera",
    deporte: "cualquiera",
    edad: "cualquiera",
    calificacion: 0,
  });
  const [q, setQ] = useState("");
  const [fitKey, setFitKey] = useState(0);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [openQR, setOpenQR] = useState(false);

  const recorridoId = selected?.id || null;

  const points = useMemo(
    () =>
      items
        .filter(
          (a) =>
            typeof a?.location?.lat === "number" &&
            typeof a?.location?.lng === "number"
        )
        .map((a) => ({ ...a, pos: [a.location.lat, a.location.lng] })),
    [items]
  );

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (
        filters.dificultad !== "cualquiera" &&
        p.difficulty?.toLowerCase() !== filters.dificultad
      )
        return false;
      if (
        filters.temporada !== "cualquiera" &&
        p.season?.toLowerCase() !== filters.temporada
      )
        return false;
      if (
        filters.deporte !== "cualquiera" &&
        p.category?.toLowerCase() !== filters.deporte
      )
        return false;
      if (filters.edad !== "cualquiera" && p.ageGroup !== filters.edad)
        return false;
      if (filters.calificacion > 0 && p.rating < filters.calificacion)
        return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [points, filters, q]);

  const positions = filtered.map((p) => p.pos);
  const center = points[0]?.pos || [-32.8895, -68.8458];
  const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const ATTR = "&copy; OpenStreetMap contributors";

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => setShowFilters(false);
  const handleReset = () =>
    setFilters({
      dificultad: "cualquiera",
      temporada: "cualquiera",
      deporte: "cualquiera",
      edad: "cualquiera",
      calificacion: 0,
    });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Botón para abrir filtros */}
      <button
        onClick={() => setShowFilters((v) => !v)}
        className="absolute top-3 right-15 z-[2000] bg-white shadow-md px-4 py-2 rounded-full font-semibold text-sm text-gray-800 hover:bg-orange-50 border border-gray-200 flex items-center gap-2"
      >
        <span role="img" aria-label="filtro">
          🔍
        </span>
        Filtros
      </button>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="absolute top-3 right-[50%] bg-white shadow-2xl rounded-2xl w-[70%] max-w-sm p-5 z-[2000] animate-slide-down border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-gray-800">
              Filtros Avanzados
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-orange-500 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Buscar lugares o actividades..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={() => setFitKey((k) => k + 1)}
              className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
            >
              Ajustar Vista
            </button>
          </div>

          <div className="space-y-2">
            {[
              {
                key: "dificultad",
                label: "Dificultad",
                options: ["Cualquiera", "Fácil", "Media", "Difícil"],
              },
              {
                key: "temporada",
                label: "Temporada",
                options: [
                  "Cualquiera",
                  "Verano",
                  "Invierno",
                  "Primavera",
                  "Otoño",
                ],
              },
              {
                key: "deporte",
                label: "Deporte",
                options: [
                  "Cualquiera",
                  "Rafting",
                  "Trekking",
                  "Escalada",
                  "Ciclismo",
                ],
              },
              {
                key: "edad",
                label: "Edad",
                options: ["Cualquiera", "Niños", "Adultos", "Mayores"],
              },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1 text-gray-700">
                  {label}
                </label>
                <select
                  value={filters[key]}
                  onChange={(e) =>
                    handleFilterChange(key, e.target.value.toLowerCase())
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700">
                Calificaciones
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleFilterChange("calificacion", star)}
                    className={`cursor-pointer text-xl ${
                      star <= filters.calificacion
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-600 text-xs ml-1">
                  {filters.calificacion > 0
                    ? `${filters.calificacion} y más`
                    : "Cualquiera"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleReset}
              className="border border-gray-300 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
            >
              Reiniciar
            </button>
            <button
              onClick={handleApplyFilters}
              className="bg-orange-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-orange-600 transition"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* MAPA */}
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomControl position="topright" />
        <GeoWatcher onChange={setUserPos} />
        <LocateControl />
        <InvalidateSizeOnce />
        <FitToBounds positions={positions} trigger={fitKey} />
        <TileLayer url={TILE_URL} attribution={ATTR} />

        {userPos && routeTo && (
          <RoutingLayer from={userPos} to={routeTo} onRouteInfo={setRouteInfo} />
        )}
        {filtered.map((p) => (
          <Marker
            key={p.id}
            position={p.pos}
            icon={iconFor(p)}
            eventHandlers={{ click: () => setSelected(p) }}
          >
            <Popup>
              <b>{p.name}</b>
              <br />
              {p.address || ""}
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button
                  onClick={() => setRouteTo(p)}
                  disabled={!userPos}
                  style={{
                    background: "#1a73e8",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Ruta
                </button>
                <button
                  onClick={() => {
                    setSelected(p);
                    setOpenQR(true);
                  }}
                  style={{
                    background: "#1a73e8",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  QR
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {(selected || routeTo) && (
        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            zIndex: 500,
          }}
        >
          <WeatherCard
            latitude={
              (routeTo?.pos?.[0] ?? routeTo?.lat ?? selected?.pos?.[0]) || null
            }
            longitude={
              (routeTo?.pos?.[1] ?? routeTo?.lng ?? selected?.pos?.[1]) || null
            }
          />
        </div>
      )}

      {openQR && recorridoId && (
        <QrRecorridoModal
          open
          onClose={() => setOpenQR(false)}
          recorridoId={recorridoId}
        />
      )}
    </div>
  );
}

/* Animación suave */
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
