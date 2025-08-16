// src/App.jsx
import React from 'react';
import MapView from './components/MapView.jsx'; // ajustá la ruta si tu carpeta difiere

const demo = [
  {
    id: 'a1',
    name: 'Rafting Río Mendoza',
    location: { lat: -32.915, lng: -68.845, city: 'Potrerillos', province: 'Mendoza' },
    difficulty: 'media', rating: 4.7, durationMinutes: 150
  },
  {
    id: 'a2',
    name: 'Trekking Cerro Arco',
    location: { lat: -32.861, lng: -68.93, city: 'Mendoza', province: 'Mendoza' },
    difficulty: 'baja', rating: 4.5, durationMinutes: 120
  }
];

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Mapa con Leaflet</h1>
      <MapView items={demo} />
    </div>
  );
}
