import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useIPLocation } from '../../hooks/useIPLocation';
import { useReverseGeocoding } from '../../hooks/useReverseGeocoding';

// ─── Diccionario de códigos de clima (Open-Meteo) ────────────────────────────
const WEATHER_LABELS = {
  0:  { label: "Despejado",              emoji: "☀️",  type: "sun"    },
  1:  { label: "Mayormente despejado",   emoji: "🌤️", type: "sun"    },
  2:  { label: "Parcialmente nublado",   emoji: "⛅",  type: "cloud"  },
  3:  { label: "Nublado",               emoji: "☁️",  type: "cloud"  },
  45: { label: "Niebla",                emoji: "🌫️", type: "cloud"  },
  48: { label: "Niebla con escarcha",    emoji: "🌫️", type: "cloud"  },
  51: { label: "Llovizna leve",         emoji: "🌦️", type: "rain"   },
  53: { label: "Llovizna",              emoji: "🌦️", type: "rain"   },
  55: { label: "Llovizna intensa",      emoji: "🌧️", type: "rain"   },
  61: { label: "Lluvia leve",           emoji: "🌦️", type: "rain"   },
  63: { label: "Lluvia",                emoji: "🌧️", type: "rain"   },
  65: { label: "Lluvia fuerte",         emoji: "⛈️", type: "storm"  },
  71: { label: "Nieve leve",            emoji: "🌨️", type: "snow"   },
  73: { label: "Nieve",                 emoji: "🌨️", type: "snow"   },
  75: { label: "Nieve intensa",         emoji: "❄️",  type: "snow"   },
  80: { label: "Chaparrones",           emoji: "🌦️", type: "rain"   },
  82: { label: "Chaparrones fuertes",   emoji: "⛈️", type: "storm"  },
  95: { label: "Tormenta",              emoji: "⛈️", type: "storm"  },
  99: { label: "Tormenta con granizo",  emoji: "⛈️", type: "storm"  },
};

// ─── Sugerencias por tipo de clima ───────────────────────────────────────────
// Cada entrada puede ser string o función (temp, isDay) => string
const SUGGESTIONS = {
  sun:   (temp, isDay) =>
    !isDay
      ? "🌌 — Ideal para Astroturismo y Observación de Estrellas. Contemplá el cielo lejos de las luces de la ciudad."
      : "☀️ — Perfectas condiciones para ciclismo y actividades al aire libre en plena naturaleza.",
  cloud: (temp, isDay) =>
    !isDay
      ? "🌌 — Buen momento para salidas tranquilas o explorar miradores nocturnos."
      : "⛅ — El momento exacto para subirse a una bici de montaña y conquistar los senderos.",
  rain:  (temp, isDay) =>
    temp <= 12
      ? "🥊 — 🚣 Rafting. Los espacios indoor son tu mejor opción: Taekwondo, Kick-Boxing y Entrenamiento Funcional te esperan."
      : "🚣 — Actividades de río como Rafting. Buscá opciones bajo techo o equipate con ropa impermeable.",
  snow:  () =>
    "🏂 — Snowboard y Esquí son tu plan perfecto. El snowboard es la actividad emblemática del invierno, ¡aprovechá la montaña!",
  storm: () =>
    "⛈️ — Evitá actividades al aire libre por seguridad. Buscá experiencias indoor hasta que mejore el clima.",
};

// ─── Gradientes por tipo de clima ────────────────────────────────────────────
const GRADIENTS = {
  sun:   'linear-gradient(110deg, #00d2ff 0%, #3a7bd5 60%, #4b6cb7 100%)',
  cloud: 'linear-gradient(110deg, #757F9A 0%, #D7DDE8 100%)',
  rain:  'linear-gradient(110deg, #4b79a1 0%, #283e51 100%)',
  snow:  'linear-gradient(110deg, #83a4d4 0%, #b6fbff 100%)',
  storm: 'linear-gradient(110deg, #373b44 0%, #4286f4 100%)',
};

// ─── Imagen de clima según tipo + momento del día ────────────────────────────
const WEATHER_IMAGES = {
  sun:   (isDay) => isDay ? '/images/weather/sun.png'        : '/images/weather/night.png',
  cloud: (isDay) => isDay ? '/images/weather/cloud_sun.png'  : '/images/weather/cloud_night.png',
  rain:  ()      => '/images/weather/rain.png',
  snow:  ()      => '/images/weather/snow.png',
  storm: ()      => '/images/weather/storm.png',
};

function WeatherIcon({ type, isDay = true, sizePx = 48 }) {
  const imgFn = WEATHER_IMAGES[type] ?? WEATHER_IMAGES.sun;
  const src   = imgFn(isDay);
  return (
    <img
      src={src}
      alt={type}
      width={sizePx}
      height={sizePx}
      style={{ objectFit: 'contain', imageRendering: 'auto' }}
    />
  );
}

// ─── URL de la API ────────────────────────────────────────────────────────────
function buildWeatherUrl(lat, lng) {
  const params = new URLSearchParams({
    latitude:  String(lat),
    longitude: String(lng),
    timezone:  'auto',
    current:   'temperature_2m,weather_code,is_day',
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

// ─── Componente principal ─────────────────────────────────────────────────────
// variant: "map" (barra en mapa) | "panel" (dentro del panel de notificaciones en móvil)
export default function Notification_central({ location = "Mi ubicación", onClose, variant = 'map' }) {
  const isPanel = variant === 'panel';
  const shellClass = isPanel
    ? 'relative overflow-hidden rounded-xl px-4 py-3 text-white shadow-xl w-full font-sans'
    : 'relative overflow-hidden rounded-full px-4 h-14 text-white shadow-xl w-fit min-[1350px]:w-full font-sans';
  const { latitude, longitude } = useIPLocation();
  const { locationName } = useReverseGeocoding(latitude, longitude);
  const displayLocation = locationName || location;
  const [raw, setRaw]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  // Fetch de clima real
  useEffect(() => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    const controller = new AbortController();

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(buildWeatherUrl(latitude, longitude), { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const current = data.current;
        if (!current) throw new Error('Sin datos actuales');
        setRaw(current);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError('No se pudo obtener el clima');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [latitude, longitude]);

  // Procesar datos crudos → viewModel
  const vm = useMemo(() => {
    if (!raw) return null;
    const code  = raw.weather_code ?? raw.weathercode ?? -1;
    const isDay = Boolean(raw.is_day ?? 1);
    const temp  = Math.round(raw.temperature_2m ?? raw.temperature ?? 0);
    const meta  = WEATHER_LABELS[code] || {
      label: 'Condición variable',
      type:  isDay ? 'sun' : 'cloud',
    };
    const suggFn = SUGGESTIONS[meta.type] ?? SUGGESTIONS.sun;
    return {
      temperature: temp,
      condition:   meta.label,
      type:        meta.type,
      isDay,
      suggestion:  typeof suggFn === 'function' ? suggFn(temp, isDay) : suggFn,
      gradient:    GRADIENTS[meta.type] ?? GRADIENTS.sun,
    };
  }, [raw]);

  // ── Estado de carga ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className={`${shellClass} animate-pulse flex items-center gap-4`}
        style={{ background: '#1F2937' }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 w-24 bg-white/20 rounded" />
          <div className="h-4 w-20 bg-white/20 rounded" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2 w-full bg-white/20 rounded" />
          <div className="h-2 w-3/4 bg-white/20 rounded" />
        </div>
      </div>
    );
  }

  if (error || !vm) {
    return (
      <div
        className={`${shellClass} flex items-center gap-3`}
        style={{ background: '#1F2937' }}
      >
        <p className="text-white/70 text-sm">{error ?? 'Cargando ubicación...'}</p>
      </div>
    );
  }

  // ── Tarjeta con datos reales ────────────────────────────────────────────────
  return (
    <div
      className={`${shellClass} transition-all duration-500 ${isPanel ? 'flex flex-col gap-3' : 'flex items-center gap-4'}`}
      style={{ background: '#1F2937' }}
    >
      <div className={`flex items-center gap-4 min-w-0 ${isPanel ? 'w-full' : 'flex-1'}`}>
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d5986)' }}
        >
          <WeatherIcon type={vm.type} isDay={vm.isDay} sizePx={36} />
        </div>

        <div className="flex-shrink-0 flex flex-col justify-center min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wide text-white/60 flex items-center gap-1">
            <MapPin size={11} strokeWidth={2} className="flex-shrink-0 text-white/50" aria-hidden />
            <span className="truncate">{displayLocation}</span>
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold leading-none">{vm.temperature}°C</span>
            <span className="text-[11px] text-white/80">{vm.condition}</span>
          </div>
        </div>

        {!isPanel && (
          <>
            <div className="hidden min-[1350px]:block self-stretch w-px bg-white/10 mx-1 flex-shrink-0 my-2" />
            <p className="hidden min-[1350px]:block flex-1 text-[11px] text-white/70 leading-snug min-w-0 line-clamp-2">
              {vm.suggestion}
            </p>
          </>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-white/40 hover:text-white/80 transition-colors ml-auto"
            aria-label="Cerrar"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {isPanel && (
        <p className="text-[11px] text-white/70 leading-snug border-t border-white/10 pt-2">
          {vm.suggestion}
        </p>
      )}
    </div>
  );
}