import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix de íconos para Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions.length) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [30, 30] });
  }, [positions, map]);
  return null;
}

export default function MapView({ items = [], onHover }) {
  const positions = useMemo(
    () => items.filter(a => a?.location?.lat && a?.location?.lng).map(a => [a.location.lat, a.location.lng]),
    [items]
  );
  const defaultCenter = useMemo(() => [-32.889, -68.845], []); // Mendoza

  return (
    <div className="card overflow-hidden">
      <MapContainer center={positions[0] || defaultCenter} zoom={9} style={{ height: 420, width: '100%' }} scrollWheelZoom>
        <TileLayer
          url={import.meta.env.VITE_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution={import.meta.env.VITE_TILE_ATTR || '&copy; OpenStreetMap contributors'}
        />
        <FitBounds positions={positions} />
        {items.map(a => (
          <Marker
            key={a.id}
            position={[a.location.lat, a.location.lng]}
            eventHandlers={{ mouseover: () => onHover?.(a), mouseout: () => onHover?.(null) }}
          >
            <Popup>
              <strong>{a.name}</strong><br />
              {a.location.city}, {a.location.province}<br />
              Dificultad: {a.difficulty} • Rating: {a.rating} ⭐<br />
              Duración: {a.durationMinutes} min
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
