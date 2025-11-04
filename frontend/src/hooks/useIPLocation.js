import { useState, useEffect } from 'react';

const IP_API_URL = 'https://ip-api.com/json/';
const FALLBACK_LAT = -32.8895;
const FALLBACK_LNG = -68.8458;

export function useIPLocation() {
    const [location, setLocation] = useState({ 
        latitude: null, 
        longitude: null 
    });
    
    useEffect(() => {
        const fetchLocationByIP = async () => {
            try {
                const response = await fetch(IP_API_URL);
                const data = await response.json(); 
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                if (data.status === 'success' && data.lat && data.lon) {
                    // Éxito: Usar coordenadas obtenidas
                    setLocation({ latitude: data.lat, longitude: data.lon });
                } else {
                    // Fallback: Usar coordenadas de Mendoza
                    setLocation({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
                }
            } catch (err) {
                // Fallo: Usar coordenadas de respaldo
                setLocation({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
            }
        };

        fetchLocationByIP();
    }, []); // El array vacío asegura que se ejecuta SOLO una vez

    // Retorna el objeto de ubicación (lat, lng)
    return location;
}