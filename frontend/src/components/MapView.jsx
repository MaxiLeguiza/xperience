import React, { useEffect, useMemo, useState } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix íconos (Leaflet default)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* ============== Íconos personalizados desde /public/images/markers ============== */
function makeIcon(url, size = [40, 40], anchor = [20, 40]) {
  return L.icon({
    iconUrl: url,
    iconRetinaUrl: url,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -32],
    shadowUrl,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
}

const ICONS = {
  rafting: makeIcon("/images/markers/rafting.png", [40, 40], [20, 40]),
  cabalgata: makeIcon("/images/markers/cabalgata.svg", [44, 44], [22, 44]),
  ciclismo: makeIcon("/images/markers/ciclismo.svg", [40, 40], [20, 40]),
  parapente: makeIcon("/images/markers/parapente.svg", [40, 40], [20, 40]),
  trekking: makeIcon("/images/markers/trekking.png", [40, 40], [20, 40]),
  insti: makeIcon("/images/markers/insti.png", [40, 40], [20, 40]),
  default: new L.Icon.Default(),
};

const iconFor = (p) => {
  if (p?.icon) return makeIcon(p.icon);
  const cat = (p?.category || "").toString().trim().toLowerCase();
  return ICONS[cat] ?? ICONS.default;
};
/* ============================================================================== */

/* -------------------- Helpers -------------------- */
function InvalidateSizeOnce() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

function LocateOnMount() {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
    const onFound = (e) => L.marker(e.latlng).addTo(map);
    map.on("locationfound", onFound);
    return () => map.off("locationfound", onFound);
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
/* ----------------------------------------------- */

// --- Mapa principal ---
export default function MapView({ items = [] }) {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [q, setQ] = useState("");
  const [fitKey, setFitKey] = useState(0);

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

  const categories = useMemo(
    () => Array.from(new Set(points.map((p) => p.category))).filter(Boolean),
    [points]
  );
  const difficulties = useMemo(
    () => Array.from(new Set(points.map((p) => p.difficulty))).filter(Boolean),
    [points]
  );

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [points, category, difficulty, q]);

  const positions = useMemo(() => filtered.map((p) => p.pos), [filtered]);
  const center = points[0]?.pos || [-32.8895, -68.8458];

  // FORZAR OSM (sin MapTiler ni .env)
  const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const ATTR = "&copy; OpenStreetMap contributors";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Filtros + acciones */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          zIndex: 600,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 8,
          boxShadow: "0 8px 24px -12px rgba(0,0,0,.25)",
          display: "grid",
          gap: 6,
          minWidth: 260,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={chip}
          >
            <option value="all">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={chip}
          >
            <option value="all">Todas</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <input
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ ...chip, width: "100%" }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <button style={btn} onClick={() => setFitKey((k) => k + 1)}>
            Ajustar vista ({filtered.length})
          </button>
          <button
            style={btnGhost}
            onClick={() => {
              setCategory("all");
              setDifficulty("all");
              setQ("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Panel de detalle */}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          zIndex: 600,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 8px 24px -12px rgba(0,0,0,.25)",
          minWidth: 260,
          maxWidth: 320,
        }}
      >
        {selected ? (
          <>
            <div style={{ fontWeight: 700 }}>{selected.name}</div>
            {selected.address && (
              <div style={{ color: "#555", fontSize: 13 }}>
                {selected.address}
              </div>
            )}
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.location.lat},${selected.location.lng}`}
                target="_blank"
                rel="noreferrer"
                style={btn}
              >
                Cómo llegar
              </a>
              <button style={btnGhost} onClick={() => setSelected(null)}>
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "#6b7280" }}>
            Seleccioná un punto para ver detalles.
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <LocateOnMount />
        <InvalidateSizeOnce />
        <FitToBounds positions={positions} trigger={fitKey} />
        <TileLayer url={TILE_URL} attribution={ATTR} />

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
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// estilos rápidos
const chip = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111",
  padding: "8px 10px",
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 12,
};
const btn = {
  ...chip,
  background: "#1a73e8",
  color: "#fff",
  border: "1px solid #1a73e8",
  cursor: "pointer",
};
const btnGhost = {
  ...chip,
  background: "#fff",
  color: "#111",
  border: "1px solid #e5e7eb",
  cursor: "pointer",
};
