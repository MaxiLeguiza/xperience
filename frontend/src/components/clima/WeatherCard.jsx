import { useEffect, useMemo, useState } from "react";

const WEATHER_LABELS = {
  0: { label: "Despejado", icon: "☀️" },
  1: { label: "Mayormente despejado", icon: "🌤️" },
  2: { label: "Parcialmente nublado", icon: "⛅" },
  3: { label: "Nublado", icon: "☁️" },
  45: { label: "Niebla", icon: "🌫️" },
  48: { label: "Niebla con escarcha", icon: "🌫️" },
  51: { label: "Llovizna leve", icon: "🌦️" },
  53: { label: "Llovizna", icon: "🌦️" },
  55: { label: "Llovizna intensa", icon: "🌧️" },
  56: { label: "Llovizna helada leve", icon: "🌧️" },
  57: { label: "Llovizna helada intensa", icon: "🌧️" },
  61: { label: "Lluvia leve", icon: "🌦️" },
  63: { label: "Lluvia", icon: "🌧️" },
  65: { label: "Lluvia fuerte", icon: "⛈️" },
  66: { label: "Lluvia helada leve", icon: "🌧️" },
  67: { label: "Lluvia helada intensa", icon: "🌧️" },
  71: { label: "Nieve leve", icon: "🌨️" },
  73: { label: "Nieve", icon: "🌨️" },
  75: { label: "Nieve intensa", icon: "❄️" },
  77: { label: "Granos de nieve", icon: "❄️" },
  80: { label: "Chaparrones leves", icon: "🌦️" },
  81: { label: "Chaparrones", icon: "🌧️" },
  82: { label: "Chaparrones fuertes", icon: "⛈️" },
  85: { label: "Nevadas leves", icon: "🌨️" },
  86: { label: "Nevadas intensas", icon: "❄️" },
  95: { label: "Tormenta", icon: "⛈️" },
  96: { label: "Tormenta con granizo", icon: "⛈️" },
  99: { label: "Tormenta severa con granizo", icon: "⛈️" },
};

function roundValue(value, decimals = 0) {
  if (!Number.isFinite(Number(value))) return "--";
  return Number(value).toFixed(decimals);
}

function getWeatherMeta(code, isDay) {
  const meta = WEATHER_LABELS[code] || {
    label: "Condicion variable",
    icon: isDay ? "🌤️" : "🌙",
  };

  if (!isDay && code <= 2) {
    return { label: "Despejado de noche", icon: "🌙" };
  }

  return meta;
}

function buildWeatherUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto",
    forecast_days: "1",
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day,surface_pressure",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    wind_speed_unit: "kmh",
  });

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

export default function WeatherCard({ latitude, longitude }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setWeather(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildWeatherUrl(latitude, longitude), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const current = data.current || data.current_weather;

        if (!current) {
          throw new Error("Respuesta sin clima actual");
        }

        setWeather({
          current,
          daily: data.daily || null,
          timezone: data.timezone || "auto",
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        setError("No se pudo obtener el clima en este punto");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => controller.abort();
  }, [latitude, longitude]);

  const viewModel = useMemo(() => {
    if (!weather?.current) return null;

    const current = weather.current;
    const daily = weather.daily;
    const weatherCode = current.weather_code ?? current.weathercode ?? -1;
    const isDay = Boolean(current.is_day ?? current.isDay ?? 1);
    const meta = getWeatherMeta(weatherCode, isDay);

    return {
      icon: meta.icon,
      condition: meta.label,
      temperature: roundValue(current.temperature_2m ?? current.temperature, 0),
      apparentTemperature: roundValue(current.apparent_temperature, 0),
      humidity: roundValue(current.relative_humidity_2m, 0),
      windSpeed: roundValue(current.wind_speed_10m ?? current.windspeed, 0),
      windGusts: roundValue(current.wind_gusts_10m, 0),
      windDirection: roundValue(
        current.wind_direction_10m ?? current.winddirection,
        0,
      ),
      precipitation: roundValue(current.precipitation, 1),
      cloudCover: roundValue(current.cloud_cover, 0),
      pressure: roundValue(current.surface_pressure, 0),
      maxTemp: daily?.temperature_2m_max?.[0] ?? null,
      minTemp: daily?.temperature_2m_min?.[0] ?? null,
      rainProbability: daily?.precipitation_probability_max?.[0] ?? null,
      updatedAt: current.time,
    };
  }, [weather]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (loading) {
    return (
      <div className="m-2 w-[320px] rounded-3xl border border-white/20 bg-slate-950/90 p-5 text-white shadow-2xl backdrop-blur-md">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-10 w-20 rounded bg-white/10" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 w-[320px] rounded-3xl border border-red-200 bg-red-50/95 p-4 text-red-700 shadow-lg backdrop-blur-md">
        {error}
      </div>
    );
  }

  if (!viewModel) return null;

  return (
    <div className="m-2 w-[320px] overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(155deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.96)_45%,_rgba(249,115,22,0.92)_100%)] p-5 text-white shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-orange-200/80">
            Clima actual
          </p>
          <h2 className="mt-1 text-lg font-semibold">{viewModel.condition}</h2>
          <p className="mt-1 text-sm text-white/65">
            Datos estimados para esta ubicacion del recorrido
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-sm font-bold text-white/90 transition hover:bg-white/20"
            aria-label={expanded ? "Contraer clima" : "Expandir clima"}
            title={expanded ? "Contraer clima" : "Expandir clima"}
          >
            {expanded ? "^" : "v"}
          </button>
          <div className="text-4xl">{viewModel.icon}</div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-5xl font-black">{viewModel.temperature}°</p>
          <p className="mt-1 text-sm text-white/75">
            Sensacion {viewModel.apparentTemperature}°
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">
            Hoy
          </p>
          <p className="mt-1 text-sm font-medium">
            {roundValue(viewModel.maxTemp, 0)}° / {roundValue(viewModel.minTemp, 0)}°
          </p>
        </div>
      </div>

      {expanded ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-white/55">Viento</p>
              <p className="mt-1 font-semibold">{viewModel.windSpeed} km/h</p>
              <p className="text-xs text-white/60">
                Rafagas {viewModel.windGusts} km/h
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-white/55">Humedad</p>
              <p className="mt-1 font-semibold">{viewModel.humidity}%</p>
              <p className="text-xs text-white/60">
                Nubosidad {viewModel.cloudCover}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-white/55">Precipitacion</p>
              <p className="mt-1 font-semibold">{viewModel.precipitation} mm</p>
              <p className="text-xs text-white/60">
                Prob. maxima {roundValue(viewModel.rainProbability, 0)}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-white/55">Presion</p>
              <p className="mt-1 font-semibold">{viewModel.pressure} hPa</p>
              <p className="text-xs text-white/60">
                Direccion {viewModel.windDirection}°
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/60">
            Actualizado{" "}
            {viewModel.updatedAt
              ? new Date(viewModel.updatedAt).toLocaleTimeString()
              : "--"}
          </p>
        </>
      ) : (
        <div className="relative mt-4 h-5">
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-slate-900/25" />
        </div>
      )}
    </div>
  );
}
