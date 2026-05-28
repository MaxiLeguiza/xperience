import { useState, useEffect } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2';
const DEFAULT_MENDOZA = 'Maipú, Mendoza';

function cleanName(value) {
    if (!value) return null;
    const cleaned = String(value)
        .replace(/^departamento\s+(de\s+)?/i, '')
        .trim();
    return cleaned || null;
}

function isUselessLocality(name, region) {
    if (!name) return true;
    if (/^(departamento|department)$/i.test(name)) return true;
    if (!region) return false;
    const n = name.toLowerCase();
    const r = region.toLowerCase();
    return n === r || n === `ciudad de ${r}`;
}

function formatLocation(address) {
    const region = cleanName(address.state || address.region);
    const candidates = [
        address.suburb,
        address.town,
        address.village,
        address.city,
        address.municipality,
        address.county,
    ].map(cleanName).filter(Boolean);

    const city = candidates.find((c) => !isUselessLocality(c, region));

    if (city && region) return `${city}, ${region}`;
    if (region?.toLowerCase() === 'mendoza') return DEFAULT_MENDOZA;
    return city || region || DEFAULT_MENDOZA;
}

export function useReverseGeocoding(lat, lng) {
    const [locationName, setLocationName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            setLocationName(null);
            return;
        }

        const controller = new AbortController();

        const fetchLocationName = async () => {
            setIsLoading(true);
            try {
                const url = `${NOMINATIM_URL}&lat=${lat}&lon=${lng}`;
                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'XperienceApp/1.0 (dev@example.com)' },
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                setLocationName(formatLocation(data.address || {}));
            } catch (error) {
                if (error.name === 'AbortError') return;
                setLocationName(DEFAULT_MENDOZA);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        fetchLocationName();
        return () => controller.abort();
    }, [lat, lng]);

    return { locationName, isLoading };
}
