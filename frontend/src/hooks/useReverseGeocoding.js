import { useState, useEffect } from 'react';

// URL base de la API de Geocodificación Inversa de Nominatim
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2';

/**
 * Hook para convertir coordenadas (lat, lng) a un nombre de ubicación legible (ciudad, provincia).
 * * @param {number} lat - Latitud de la ubicación.
 * @param {number} lng - Longitud de la ubicación.
 * @returns {object} - { locationName: string, isLoading: boolean }
 */
export function useReverseGeocoding(lat, lng) {
    const [locationName, setLocationName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Solo ejecuta si tenemos coordenadas válidas
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            setLocationName(null);
            return;
        }

        const fetchLocationName = async () => {
            setIsLoading(true);
            
            try {
                const url = `${NOMINATIM_URL}&lat=${lat}&lon=${lng}`;
                
                const response = await fetch(url, {
                    // Se requiere un User-Agent para cumplir con las políticas de Nominatim
                    headers: { 'User-Agent': 'XperienceApp/1.0 (dev@example.com)' }
                });
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                const address = data.address;

                // 💡 Lógica para extraer la ubicación más específica
                // Prioridad: Estado/Provincia > Ciudad > Pueblo/Villa > País
                const name = 
                    address.state || 
                    address.city || 
                    address.town || 
                    address.village || 
                    address.country || 
                    'Ubicación Desconocida';

                setLocationName(name);

            } catch (error) {
                console.error("Error en Geocodificación Inversa:", error);
                setLocationName('Error al obtener ubicación');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocationName();

    }, [lat, lng]); // Se vuelve a ejecutar si cambian las coordenadas

    return { locationName, isLoading };
}