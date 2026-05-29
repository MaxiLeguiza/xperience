import { useState, useEffect } from 'react';

// Maipú, Mendoza — respaldo si el GPS no responde
const FALLBACK_LAT = -33.0094;
const FALLBACK_LNG = -68.7661;

export function useIPLocation() {
    const [location, setLocation] = useState({ 
        latitude: FALLBACK_LAT, 
        longitude: FALLBACK_LNG, 
    });
    
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                setLocation({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
            },
            { timeout: 5000 }
        );
    }, []);

    return location;
}