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
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import WeatherCard from "../components/clima/WeatherCard";
import QrRecorridoModal from "../features/qr/QrRecorridoModal";
import Notification_central from "./Notifications/Notification_central";
import { ChevronUp, Flame, Star } from "lucide-react";

import "./MapView.css";

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

/* ---------- Control de ubicacion (con diagnostico + fallback) ---------- */
function LocateControl() {
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
      });L.DomEvent.on(btn, "click", async (e) => {
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
      });return container;
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

/* ----------------------------------------------- */

function ActivityPanel({ activities = [], onSelect, onReserve }) {
  const [expanded, setExpanded] = useState(true);
  const cards = activities.slice(0, 8);

  return (
    <aside
      className={`pointer-events-auto bg-[#0b0f19]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
        expanded ? "w-[800px] max-w-[90vw]" : "w-[300px]"
      }`}
    >
      {/* Header / Toggle */}
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded((current) => !current)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-md">
            <Flame size={16} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-orange-400 font-bold">
              Actividades
            </span>
            <h3 className="text-sm font-semibold text-white leading-tight">
              Más elegidas de la semana
            </h3>
          </div>
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={expanded ? "Contraer" : "Expandir"}
        >
          <ChevronUp
            size={20}
            className={`transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Carousel */}
      <div
        className={`flex overflow-x-auto gap-4 px-5 pb-5 custom-scrollbar transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        {cards.map((activity, index) => (
          <button
            key={activity.id}
            type="button"
            className={`flex-shrink-0 w-[200px] text-left group relative rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] ${
              activity.premium
                ? "bg-gradient-to-b from-orange-500/10 to-[#0b0f19] border-orange-500/30 hover:border-orange-500/60"
                : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
            }`}
            onClick={() => onSelect(activity)}
          >
            {/* Visual Header */}
            <div className="px-4 pt-4 flex justify-between items-start">
              <span className="text-3xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Star
                size={16}
                className={
                  activity.premium ? "text-orange-400" : "text-gray-500"
                }
              />
            </div>

            {/* Body */}
            <div className="px-4 pb-4 mt-2">
              <span className="block text-[10px] uppercase tracking-wider text-orange-400 font-semibold mb-1 truncate">
                {(activity.category || "aventura").replace(/_/g, " ")}
              </span>
              <strong className="block text-sm text-white font-bold mb-1 truncate">
                {activity.name}
              </strong>
              <p className="text-[11px] text-gray-400">
                {activity.weeklyReservations ||
                  Math.round((activity.rating || 4) * 18)}{" "}
                reservas
              </p>
            </div>

            {/* Reserve Action */}
            <div
              className={`text-center py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activity.premium
                  ? "bg-orange-500 text-white group-hover:bg-orange-600"
                  : "bg-white/10 text-white group-hover:bg-white/20"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                onReserve(activity);
              }}
            >
              Reservar
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default function MapView({ items = [] }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [pendingDest, setPendingDest] = useState(null);
  const [showWeatherCard, setShowWeatherCard] = useState(true);

  const recorridoId = selected?.id || null;

  const points = useMemo(
    () =>
      items
        .filter(
          (a) =>
            typeof a?.location?.lat === "number" &&
            typeof a?.location?.lng === "number",
        )
        .map((a) => ({ ...a, pos: [a.location.lat, a.location.lng] })),
    [items],
  );

  const filtered = useMemo(() => {
    return points.filter((p) => {
      const difficulty = String(p.difficulty || "").toLowerCase();
      if (
        filters.dificultad !== "cualquiera" &&
        difficulty !== filters.dificultad
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
  const ATTR = "© OpenStreetMap contributors";
  const sportOptions = useMemo(
    () => [
      "cualquiera",
      ...[
        ...new Set(
          points
            .map((item) => String(item.category || "").toLowerCase())
            .filter(Boolean),
        ),
      ].sort(),
    ],
    [points],
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => setShowFilters(false);
  const handleReset = () => {
    setFilters({
      dificultad: "cualquiera",
      temporada: "cualquiera",
      deporte: "cualquiera",
      edad: "cualquiera",
      calificacion: 0,
    });
    setQ("");
    setRouteTo(null);
    setSelected(null);
    setRouteInfo(null);
  };

  const priceFallback = useMemo(
    () => ({
      a1: 18000,
      a2: 14000,
      a3: 12000,
      a4: 35000,
      a5: 9000,
      a7: 11000,
      a8: 22000,
      a9: 8000,
      a10: 45000,
    }),
    [],
  );

  const resolvePrice = (p) => {
    if (typeof p?.price === "number") return p.price;
    if (typeof p?.precio === "number") return p.precio;
    if (typeof p?.price === "string") {
      const parsed = Number(p.price.replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(parsed)) return parsed;
    }
    if (priceFallback[p?.id]) return priceFallback[p.id];
    return 15000;
  };

  const formatDisplayPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  const formatRating = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(1) : "N/A";
  };

  const buildCartItem = (p) => {
    const priceValue = resolvePrice(p);
    return {
      id: p.id,
      nombre: p.name,
      capacidad: p.capacity || p.capacidad || 1,
      precio: `$${Math.round(priceValue)}`,
    };
  };

  const handleReserve = (p) => {
    const item = buildCartItem(p);
    navigate("/carrito", { state: { selectedItems: [item] } });
  };

  // Si llegamos desde un QR con ?dest=ID, seleccionamos y activamos ruta
  useEffect(() => {
    const dest = searchParams.get("dest");
    if (dest) setPendingDest(dest);
  }, [searchParams]);

  useEffect(() => {
    if (!pendingDest || !points.length) return;
    const found =
      points.find((p) => String(p.id) === String(pendingDest)) || null;
    if (!found) {
      setPendingDest(null);
      return;
    }
    setSelected(found);
    setRouteTo(found);
    setFitKey((k) => k + 1);
    setPendingDest(null);
  }, [pendingDest, points]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dificultad !== "cualquiera") count++;
    if (filters.temporada !== "cualquiera") count++;
    if (filters.deporte !== "cualquiera") count++;
    if (filters.edad !== "cualquiera") count++;
    if (filters.calificacion > 0) count++;
    if (q.trim()) count++;
    return count;
  }, [filters, q]);

  const weeklyActivities = useMemo(() => {
    return [...points]
      .map((point) => ({
        ...point,
        weeklyReservations:
          point.weeklyReservations || Math.round((point.rating || 4) * 18),
      }))
      .sort((a, b) => {
        if (Boolean(a.premium) !== Boolean(b.premium)) return a.premium ? -1 : 1;
        return b.weeklyReservations - a.weeklyReservations;
      });
  }, [points]);

  return (
    <div className="x-map-wrapper">
      <div className="x-map-card">
        {/* Top Left Controls Container */}
        <div className="absolute top-4 left-5 z-[2000] flex items-start gap-4">
          {/* Boton flotante de filtros */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="bg-white/95 px-3 py-2 rounded-full shadow-lg border border-white/60
                     flex items-center gap-3 hover:bg-orange-50 hover:border-orange-200 transition backdrop-blur-md shrink-0 h-14"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-md text-lg">
              🧭
            </span>
            <div className="text-left">
              <span className="block text-[11px] uppercase tracking-wide text-orange-600 font-semibold">
                Filtros
              </span>
              <span className="block text-[11px] text-gray-500 leading-tight">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} activo${
                      activeFiltersCount > 1 ? "s" : ""
                    }`
                  : "Busca tus aventuras"}
              </span>
            </div>
            <span className="ml-1 text-gray-400 text-xs">▾</span>
          </button>

          {/* Tarjeta de clima flotante */}
          {showWeatherCard && (
            <div className="w-[600px] max-w-[60vw] mt-0">
              <Notification_central location="Mi ubicación" onClose={() => setShowWeatherCard(false)} />
            </div>
          )}
        </div>

        {/* Panel de filtros “glass” */}
        {showFilters && (
          <div
            className="absolute top-16 left-5 w-[340px] max-w-[90vw] z-[2000]
                        rounded-2xl border border-white/40 bg-white/90 shadow-2xl
                        backdrop-blur-xl animate-slide-down"
          >
            <div className="px-5 pt-4 pb-3 border-b border-white/60 bg-gradient-to-r from-white/90 via-white/80 to-orange-50/70 rounded-t-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-orange-500 font-semibold">
                    Explora Mendoza
                  </p>
                  <h2 className="text-sm font-bold text-gray-900">
                    Filtros de aventura
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Combina dificultad, temporada y deporte para encontrar tu
                    proxima Xperience.
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-orange-500 text-lg font-bold leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              {/* Buscador + ajustar vista */}
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
                  <input
                    type="text"
                    placeholder="Buscar lugares o actividades..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-gray-200
                             focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400
                             placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={() => setFitKey((k) => k + 1)}
                  className="bg-orange-500 text-white px-3 py-2 rounded-lg text-[11px] font-semibold 
                           hover:bg-orange-600 transition shadow-md"
                >
                  Centrar Vista
                </button>
              </div>

              {/* Filtros en grilla */}
              <div className="grid grid-cols-2 gap-3">
                {/* Dificultad */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700 uppercase tracking-wide">
                    Dificultad
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["cualquiera", "baja", "media", "alta"].map(
                      (value) => {
                        const active = filters.dificultad === value;
                        const label =
                          value === "cualquiera"
                            ? "Todas"
                            : value.charAt(0).toUpperCase() + value.slice(1);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              handleFilterChange("dificultad", value)
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-medium border transition
                          ${
                            active
                              ? "bg-orange-500 text-white border-orange-500 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-orange-400"
                          }`}
                          >
                            {label}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Temporada */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700 uppercase tracking-wide">
                    Temporada
                  </label>
                  <select
                    value={filters.temporada}
                    onChange={(e) =>
                      handleFilterChange(
                        "temporada",
                        e.target.value.toLowerCase(),
                      )
                    }
                    className="w-full border border-gray-200 rounded-lg p-2 text-[12px]
                             bg-white focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    {[
                      "Cualquiera",
                      "Verano",
                      "Invierno",
                      "Primavera",
                      "Otoño",
                    ].map((opt) => (
                      <option key={opt} value={opt.toLowerCase()}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deporte */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700 uppercase tracking-wide">
                    Deporte
                  </label>
                  <select
                    value={filters.deporte}
                    onChange={(e) =>
                      handleFilterChange(
                        "deporte",
                        e.target.value.toLowerCase(),
                      )
                    }
                    className="w-full border border-gray-200 rounded-lg p-2 text-[12px]
                             bg-white focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    {sportOptions.map((opt) => (
                      <option key={opt} value={opt.toLowerCase()}>
                        {opt === "cualquiera"
                          ? "Cualquiera"
                          : opt
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700 uppercase tracking-wide">
                    Edad
                  </label>
                  <select
                    value={filters.edad}
                    onChange={(e) =>
                      handleFilterChange("edad", e.target.value.toLowerCase())
                    }
                    className="w-full border border-gray-200 rounded-lg p-2 text-[12px]
                             bg-white focus:ring-2 focus:ring-orange-400/70 focus:border-orange-400"
                  >
                    {["Cualquiera", "Ninos", "Adultos", "Mayores"].map(
                      (opt) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Calificacion */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-gray-700 uppercase tracking-wide">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleFilterChange("calificacion", star)}
                        className={`cursor-pointer text-lg ${
                          star <= filters.calificacion
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-gray-500 text-[11px] ml-1">
                      {filters.calificacion > 0
                        ? `${filters.calificacion}+`
                        : "Cualquiera"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones inferiores */}
            <div className="px-5 py-3 border-t border-white/70 flex justify-between items-center bg-white/80 rounded-b-2xl">
              <button
                onClick={handleReset}
                className="text-[12px] px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              >
                Reiniciar
              </button>
              <button
                onClick={handleApplyFilters}
                className="text-[12px] px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition"
              >
                Ver resultados
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-6 z-[2000] flex flex-col items-end gap-4 pointer-events-none">
          {(selected || routeTo) && (
            <div className="pointer-events-auto">
              <WeatherCard
                latitude={
                  (routeTo?.pos?.[0] ?? routeTo?.lat ?? selected?.pos?.[0]) ||
                  null
                }
                longitude={
                  (routeTo?.pos?.[1] ?? routeTo?.lng ?? selected?.pos?.[1]) ||
                  null
                }
              />
            </div>
          )}

          <div className="pointer-events-auto">
            <ActivityPanel
              activities={weeklyActivities}
              onSelect={(activity) => {
                setSelected(activity);
                setRouteTo(null);
                setShowWeatherCard(false);
              }}
              onReserve={handleReserve}
            />
          </div>
        </div>

        {/* MAPA */}
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom
          zoomControl={false}
          className="x-map-leaflet absolute inset-0 w-full h-full z-0"
        >
          <ZoomControl position="topright" />
          <GeoWatcher onChange={setUserPos} />
          <LocateControl />
          <InvalidateSizeOnce />
          <FitToBounds positions={positions} trigger={fitKey} />
          <TileLayer url={TILE_URL} attribution={ATTR} />

          {userPos && routeTo && (
            <RoutingLayer
              from={userPos}
              to={routeTo}
              onRouteInfo={setRouteInfo}
            />
          )}

          {filtered.map((p) => (
            <Marker
              key={p.id}
              position={p.pos}
              icon={iconFor(p)}
              eventHandlers={{
                click: () => {
                  setSelected(p);
                  setShowWeatherCard(false);
                },
              }}
            >
              <Popup>
                <div className="min-w-[240px] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-orange-500 font-semibold">
                        {(p.category || "Aventura").replace(/_/g, " ")}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-gray-600">
                        {p.address || "Mendoza"}
                      </p>
                      {p.influencer && (
                        <p className="mt-2 rounded-lg bg-orange-50 px-2 py-1.5 text-[11px] font-semibold leading-snug text-orange-700">
                          Recorrido realizado por el influencer {p.influencer}.
                        </p>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-1 rounded-lg">
                      ★ {formatRating(p.rating)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      {formatDisplayPrice(resolvePrice(p))}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Dificultad:{" "}
                      {p.difficulty
                        ? p.difficulty.charAt(0).toUpperCase() +
                          p.difficulty.slice(1)
                        : "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setRouteTo(p)}
                      disabled={!userPos}
                      className="text-[12px] px-3 py-2 rounded-lg font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(90deg,#0ea5e9,#2563eb)",
                      }}
                    >
                      Ruta
                    </button>
                    <button
                      onClick={() => handleReserve(p)}
                      className="text-[12px] px-3 py-2 rounded-lg font-semibold text-white shadow-sm hover:brightness-110"
                      style={{
                        background: "linear-gradient(90deg,#f97316,#ec4899)",
                      }}
                    >
                      Reservar
                    </button>
                    <button
                      onClick={() => {
                        setSelected(p);
                        setOpenQR(true);
                      }}
                      className="text-[12px] px-3 py-2 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-900 shadow-sm"
                    >
                      QR
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {routeInfo && (
          <span
            className="absolute left-1/2 top-5 -translate-x-1/2 z-[1000] 
              bg-white/95 text-gray-900 rounded-lg px-6 py-2 shadow-lg 
              font-semibold text-sm border border-gray-200 backdrop-blur-sm"
          >
            Duracion: {Math.round(routeInfo.duration / 60)} min &nbsp;|&nbsp;
            Distancia: {(routeInfo.distance / 1000).toFixed(2)} km
          </span>
        )}

        {openQR && recorridoId && (
          <QrRecorridoModal
            open
            onClose={() => setOpenQR(false)}
            recorridoId={recorridoId}
          />
        )}
      </div>
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

