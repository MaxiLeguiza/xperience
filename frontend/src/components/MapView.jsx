// src/components/MapView.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix de íconos (Vite)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// Fuerza recalcular tamaño al montar (por si el grid cambió el alto)
function InvalidateSizeOnce() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
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
