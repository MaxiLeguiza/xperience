import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
/*import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";*/
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix íconos (Leaflet default)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import WeatherCard from "../components/clima/WeatherCard"; // ajusta la ruta según tu estructura

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/* ============== Íconos desde /public/images/markers ============== */
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
  parapente: makeIcon("/images/markers/parapente.svg", [40, 40], [20, 40]), // cambia a .png si corresponde
  trekking: makeIcon("/images/markers/trekking.png", [40, 40], [20, 40]),
  insti: makeIcon("/images/markers/insti.png", [40, 40], [20, 40]),
  default: new L.Icon.Default(),
};
const iconFor = (p) =>
  p?.icon
    ? makeIcon(p.icon)
    : ICONS[(p?.category || "").toLowerCase()] ?? ICONS.default;

/* --------- Iconos especiales --------- */
// Icono para resultados del buscador
const DEST_ICON = makeIcon("/images/markers/trekking.png", [40, 40], [20, 40]);

// Icono de ubicación (azul) auto-contenido (no depende de CSS)
const LOCATE_ICON = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;height:18px;border-radius:9999px;background:#1a73e8;
      border:3px solid #fff;box-shadow:0 0 0 4px rgba(26,115,232,0.30);
      transform:translate(-50%,-50%);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

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
/* ---------- 📍 Ubicarme: seguimiento ON/OFF + primer centrado ---------- */
function LocateControl() {
  const map = useMap();
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const followingRef = useRef(false);
  const firstFixRef = useRef(false);
  const lastPosRef = useRef(null);

  useEffect(() => {
    
    // Muevo el control de zoom a la
    map.zoomControl.setPosition('topright');
    
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

      L.DomEvent.on(btn, "click", (e) => {
        L.DomEvent.stop(e);
        followingRef.current = !followingRef.current;
        btn.style.background = followingRef.current ? "#e8f0fe" : "#fff";

        // si ya tenemos posición, centramos al instante
        if (followingRef.current && lastPosRef.current) {
          map.panTo(lastPosRef.current, { animate: true });
        }

        // si aún no hay fix, pedimos uno puntual
        if (!lastPosRef.current) {
          map.locate({
            setView: true,
            enableHighAccuracy: true,
            watch: false,
            maxZoom: 17,
          });
        }
      });

      return container;
    };
    control.addTo(map);

    const onFound = (e) => {
      const { latlng } = e;
      lastPosRef.current = latlng;

      if (!markerRef.current) {
        markerRef.current = L.marker(latlng, { icon: LOCATE_ICON }).addTo(map);
      } else {
        markerRef.current.setLatLng(latlng);
      }

      const RADIUS_METERS = 15; // círculo pequeño fijo
      if (!circleRef.current) {
        circleRef.current = L.circle(latlng, {
          radius: RADIUS_METERS,
          color: "#1a73e8",
          weight: 1,
          fillOpacity: 0.2,
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(latlng);
        circleRef.current.setRadius(RADIUS_METERS);
      }

      // centra automáticamente solo la primera vez
      if (!firstFixRef.current) {
        firstFixRef.current = true;
        map.setView(latlng, 16, { animate: true });
      }

      // si el seguimiento está activo, seguí al usuario
      if (followingRef.current) {
        map.panTo(latlng, { animate: true });
      }
    };

    const onError = () => {
      alert("No se pudo obtener tu ubicación. Revisá permisos del navegador.");
    };

    map.on("locationfound", onFound);
    map.on("locationerror", onError);

    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onError);
      map.removeControl(control);
      // no llamamos stopLocate aquí (GeoWatcher maneja el watch global)
      if (markerRef.current) map.removeLayer(markerRef.current);
      if (circleRef.current) map.removeLayer(circleRef.current);
    };
  }, [map]);

  return null;
}

/* ---------- GeoWatcher: guarda tu posición para rutas (no recentra) ---------- */
function GeoWatcher({ onChange }) {
  const map = useMap();
  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true, setView: false });
    const onFound = (e) => onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    const onErr = () => {};
    map.on("locationfound", onFound);
    map.on("locationerror", onErr);
    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onErr);
      map.stopLocate();
    };
  }, [map, onChange]);
  return null;
}

/* ---------- RoutingLayer: dibuja la ruta con OSRM ---------- */
function RoutingLayer({ from, to }) {
  const map = useMap();
  const controlRef = useRef();

  useEffect(() => {
    if (!from || !to) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    controlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.location.lat, to.location.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      show: false, // oculta el panel nativo
      fitSelectedRoutes: true,
      lineOptions: { styles: [{ color: "#1a73e8", weight: 5, opacity: 0.85 }] },
      createMarker: (i, wp) =>
        i === 0
          ? L.marker(wp.latLng, { icon: LOCATE_ICON }) // origen: tu ubicación
          : L.marker(wp.latLng, { icon: DEST_ICON }), // destino: icono de destino
    }).addTo(map);

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [from, to, map]);

  return null;
}

/* ----------------------------------------------- */

// --- Mapa principal ---
export default function MapView({ items = [] }) {
  const [selected, setSelected] = useState(null);
  const [routeTo, setRouteTo] = useState(null); // destino para rutas
  const [userPos, setUserPos] = useState(null); // tu ubicación
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

  // OSM fijo
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
          zIndex: 500,
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
              setRouteTo(null);
            }}
          >
            Reset
          </button>
        </div>
        {routeTo && (
          <div style={{ display: "flex", gap: 6 }}>
            <button style={btnGhost} onClick={() => setRouteTo(null)}>
              🗺️ Limpiar ruta
            </button>
          </div>
        )}
      </div>

      {/* Panel de detalle */}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          zIndex: 500,
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
              <button
                style={btn}
                onClick={() => setRouteTo(selected)}
                disabled={!userPos}
              >
                Ruta
              </button>
              <button style={btnGhost} onClick={() => setSelected(null)}>
                Cerrar
              </button>
            </div>
            {!userPos && (
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Tip: tocá 📍 para permitir ubicación.
              </div>
            )}
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
        {/* watchers y controles */}
        <GeoWatcher onChange={setUserPos} />
        <LocateControl />
        {/* <SearchControl onSelect={setSelected} />*/}
        <InvalidateSizeOnce />
        <FitToBounds positions={positions} trigger={fitKey} />

        <TileLayer url={TILE_URL} attribution={ATTR} />

        {/* Capa de ruta (si hay origen y destino) */}
        {userPos && routeTo && <RoutingLayer from={userPos} to={routeTo} />}

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
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => setRouteTo(p)}
                  disabled={!userPos}
                  style={{ ...btn, padding: "6px 10px" }}
                >
                  Ruta
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* 🌤 Clima del lugar seleccionado o destino */}
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
