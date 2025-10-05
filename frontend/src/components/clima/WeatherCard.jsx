// Importamos los hooks de React necesarios
import { useEffect, useState } from "react";

// Definimos el componente principal WeatherCard
// Recibe como props la latitud y longitud de una ubicación
export default function WeatherCard({ latitude, longitude }) {
  // Estado para guardar los datos del clima
  const [weather, setWeather] = useState(null);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores al obtener el clima
  const [error, setError] = useState(null);

  // useEffect se ejecuta cada vez que cambian latitude o longitude
  useEffect(() => {
    // Solo realiza la búsqueda si existen coordenadas válidas
    if (latitude && longitude) {
      // Función asíncrona interna para obtener los datos del clima
      const fetchWeather = async () => {
        try {
          // Llamado a la API de Open-Meteo con las coordenadas
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          // Convertimos la respuesta en formato JSON
          const data = await res.json();
          // Guardamos la información del clima actual en el estado
          setWeather(data.current_weather);
        } catch (err) {
          // Si ocurre un error (por ejemplo, sin conexión o error de red)
          setError("No se pudo obtener el clima");
        } finally {
          // En cualquier caso (éxito o error), dejamos de mostrar el cargando
          setLoading(false);
        }
      };
      // Ejecutamos la función que obtiene el clima
      fetchWeather();
    }
  // Dependencias: se vuelve a ejecutar si cambian latitud o longitud
  }, [latitude, longitude]);

  // Si está cargando, mostramos un indicador visual (nubes animadas)
  if (loading) {
    return (
      <div className="m-4 p-6 rounded-2xl bg-gray-100 text-center flex flex-col items-center justify-center">
        {/* 🌥️ Animación de carga con nubes simuladas usando Tailwind */}
        <div className="relative w-20 h-12 mb-3">
          <div className="absolute top-0 left-0 w-12 h-12 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-8 w-12 h-12 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2 left-4 w-16 h-10 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">
          Cargando clima...
        </p>
      </div>
    );
  }

  // Si hay un error (por ejemplo, la API no responde), lo mostramos
  if (error) {
    return (
      <div className="m-4 p-4 rounded-2xl bg-red-100 text-red-700 text-center">
        {error}
      </div>
    );
  }

  // Si no hay datos de clima, no renderizamos nada
  if (!weather) return null;

  // Si hay datos, mostramos la tarjeta con la información del clima
  return (
    <div className="m-2 p-3 rounded-2xl shadow-lg bg-gradient-to-br from-orange-500 text-white max-w-xs mx-auto">
      <h2 className="text-xl font-semibold mb-2">Clima Actual</h2>
      {/* Mostramos la temperatura actual, truncando decimales */}
      <p className="text-4xl font-bold">
        {Math.trunc(weather.temperature)}°C
      </p>
      {/* Mostramos la velocidad del viento */}
      <p className="text-sm mt-1">Viento: {Math.trunc(weather.windspeed)} km/h</p>
      {/* Mostramos la hora de la última actualización */}
     {/*<p className="text-xs mt-2 opacity-80">
        Última actualización: {new Date(weather.time).toLocaleTimeString()}
      </p>*/}
    </div>
  );
}
