import { useState, useEffect } from 'react';

const FALLBACK_LAT = -32.8895;
const FALLBACK_LNG = -68.8458;

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