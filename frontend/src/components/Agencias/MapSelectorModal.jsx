import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para íconos de Leaflet (evita que el marcador se rompa)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente: Buscador Flotante
function SearchControl({ onSearch }) {
    const map = useMap();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const divRef = useRef(null);

    // Evita que los clics en el input muevan el mapa
    useEffect(() => {
        if (divRef.current) {
            L.DomEvent.disableClickPropagation(divRef.current);
            L.DomEvent.disableScrollPropagation(divRef.current);
        }
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.length > 0) {
                const pos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                map.setView(pos, 15); // Hace zoom al lugar encontrado
                onSearch(pos);
            } else {
                alert("No se encontró la ubicación. Intenta con otra ciudad o calle.");
            }
        } catch (error) {
            console.error("Error buscando ubicación:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div ref={divRef} className="absolute top-4 left-14 z-[1000] flex gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200 transition-all">
            <input 
                className="p-2 border-none outline-none text-sm w-48 sm:w-64 text-slate-700 placeholder-slate-400 bg-transparent"
                placeholder="Buscar lugar (Ej: Potrerillos)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
                {isSearching ? "..." : "Buscar"}
            </button>
        </div>
    );
}

// Componente: Eventos de Clic
function MapEvents({ onLocationSelected }) {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng);
        },
    });
    return null;
}

// COMPONENTE PRINCIPAL
export default function MapSelectorModal({ isOpen, onClose, onConfirm }) {
    const [position, setPosition] = useState(null);

    // Resetea el marcador cada vez que se abre el modal
    useEffect(() => {
        if (isOpen) setPosition(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (position) {
            onConfirm(position); // Solo aquí envía los datos y cierra el modal
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] w-full max-w-4xl h-[80vh] min-h-[500px] overflow-hidden flex flex-col shadow-2xl relative animate-slide-up">
                
                {/* Botón Cerrar Superior */}
                <button onClick={onClose} className="absolute top-4 right-4 z-[1000] bg-white p-2.5 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Contenedor del Mapa */}
                <div className="flex-1 relative z-0">
                    <MapContainer center={[-32.8895, -68.8458]} zoom={12} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        <SearchControl onSearch={(pos) => setPosition(pos)} />
                        <MapEvents onLocationSelected={(pos) => setPosition(pos)} />
                        
                        {position && <Marker position={position} />}
                    </MapContainer>
                </div>

                {/* Barra Inferior de Confirmación */}
                <div className="bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coordenadas de la Parada</p>
                        <p className="text-sm font-bold text-slate-800 mt-1">
                            {position ? `Lat: ${position.lat.toFixed(5)}, Lng: ${position.lng.toFixed(5)}` : "📌 Haz clic en el mapa o busca un lugar."}
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleConfirm} 
                        disabled={!position}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
                    >
                        Confirmar Ubicación
                    </button>
                </div>

            </div>
        </div>
    );
}