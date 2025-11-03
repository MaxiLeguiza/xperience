import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Trash2,
  Check,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  Lightbulb,
} from "lucide-react";
import { useIPLocation } from "../../hooks/useIPLocation";
import { Link } from "react-router-dom";
import Card from "./ui/card";
import CardUi from "./ui/card";

// 🚨 IMPORTAR EL HOOK DE UBICACIÓN 🚨
// Asegúrate de que este archivo (o el código) está accesible.

// --- Lógica Auxiliar de Clima (para convertir código a texto) ---
const convertWeatherCodeToCondition = (code) => {
  // 🟡 Caso 1: Soleado o mayormente soleado (códigos 0, 1, 2)
  if (code >= 0 && code <= 2) {
    return {
      condition: "Soleado",
      iconType: "Sun",
      suggestion:
        "Hace buen día: ideal para disfrutar actividades al aire libre como ciclismo o rafting.",
    };
  }

  // ☁️ Caso 2: Nublado (código 3)
  if (code === 3) {
    return {
      condition: "Parcialmente nublado",
      iconType: "Cloud",
      suggestion:
        "Solado con algo de nubes: perfecto para una caminata tranquila o explorar un mirador sin mucho sol.",
    };
  }

  // 🌧️ Caso 3: Lluvioso o mal clima (códigos 51–82, 95–99)
  if ((code >= 51 && code <= 82) || (code >= 95 && code <= 99)) {
    return {
      condition: "Lluvioso",
      iconType: "CloudRain",
      suggestion:
        "Está lloviendo: buscá actividades bajo techo o prepará tu equipo impermeable.",
    };
  }
}

// Componente para el ícono de notificación
const NotificationIcon = ({ type }) => {
  const iconProps = { size: 16 };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="text-green-500" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="text-yellow-500" />;
    case "error":
      return <XCircle {...iconProps} className="text-red-500" />;
    case "info":
      return <Info {...iconProps} className="text-blue-500" />;
    case "weather": // Asegúrate de incluir el tipo 'weather' si no estaba
      return <Sun {...iconProps} className="text-yellow-500" />;
    default:
      return <Info {...iconProps} className="text-blue-500" />;
  }
};

// Función para formatear el tiempo
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Ahora";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

// Componente principal de notificaciones
export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Generar notificaciones de ejemplo al inicio
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const sampleNotifications = [
      // 🚨 NOTIFICACIÓN DE CLIMA DE EJEMPLO 🚨
      // 💡 RECOMENDACIÓN (DEMO)
      {
        id: "rec-1",
        type: "recommendation",
        title: "Sugerencia para hoy",
        message: "Explorá los recorridos más cercanos según tu ubicación.",
        ctaLabel: "Ver recorridos",
        ctaUrl: "/recorridos", // o un link externo
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
      },
      {
        id: "0",
        type: "success",
        title: "Operación exitosa",
        message: `¡Bienvenido ${
          user?.nombre || user?.email
        }! Tu registro fue exitoso.`,
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
      },
      {
        id: "1",
        type: "warning",
        title: "Advertencia del sistema",
        message: "Mantega la ubicación activada para mejor precisión",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
      },
    ];
    setNotifications(sampleNotifications);
  }, []);

  // 1. 💡 OBTENER UBICACIÓN DENTRO DE ESTE COMPONENTE
  const { latitude, longitude } = useIPLocation();

  // 2. 💡 EFECTO PARA LLAMAR AL CLIMA (Solo se ejecuta si hay lat/lng)
  useEffect(() => {
    if (latitude && longitude) {
      const fetchWeather = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula retardo de 3 segundos
          console.log('latid ssda', latitude, longitude)
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
          );
          const data = await res.json();

          if (!res.ok || !data.current_weather) {
            throw new Error("No data");
          }

          const currentWeather = data.current_weather;
          const { condition, iconType, suggestion } = convertWeatherCodeToCondition(currentWeather.weathercode);

          // 3. CREAR Y AÑADIR LA NOTIFICACIÓN DE CLIMA
          const weatherNotification = {
            id: "weather-alert",
            type: "weather",
            location: "Maipu, Mendoza", // Obtiene el nombre de la ciudad
            temperature: Math.round(currentWeather.temperature),
            condition: condition,
            suggestion: suggestion, //
            iconType: iconType,
            timestamp: new Date(),
            read: false,
          };

          // Añadir la notificación de clima al inicio
          setNotifications((prev) => [
            weatherNotification,
            ...prev.filter((n) => n.type !== "weather"), // Asegura que solo hay 1 notificación de clima
          ]);
        } catch (err) {
          console.error("Error al obtener clima para notificación.");
        }
      };
      fetchWeather();
    }
  }, [latitude, longitude]); // Se dispara cuando las coordenadas son cargadas

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // ------------------------------------------------------------------
  // ⚡ LÓGICA DE RENDERIZADO CONDICIONAL ⚡
  // ------------------------------------------------------------------
  const renderNotificationCard = (notification) => {
    // Función auxiliar para los iconos de clima
    const getWeatherIcon = (condition) => {
      const conditionLower = condition?.toLowerCase();
      if (conditionLower?.includes("sol"))
        return <Sun className="w-7 h-7 text-white" />;
      if (conditionLower?.includes("lluv"))
        return <CloudRain className="w-7 h-7 text-white" />;
      return <Cloud className="w-7 h-7 text-white" />;
    };

    // --- DISEÑO DE CLIMA (WEATHER CARD) ---
    if (notification.type === "weather") {
      const { location, temperature, condition, suggestion, id } = notification;

      return (
        <div key={id} className="p-4">
          <div
            className="relative overflow-hidden rounded-xl p-4 text-white shadow-md bg-transparent"
            style={{
              background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(condition)}
                <div>
                  <p className="text-sm opacity-90">{location}</p>
                  <p className="text-2xl font-bold">{temperature}°C</p>
                  <p className="text-sm opacity-90">{condition}</p>
                  <p className="text-xs opacity-90 italic mt-2">{suggestion}</p>
                </div>
              </div>
              {/* Botón de cierre para la Card de clima */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(id);
                }}
                className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                title="Eliminar"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- DISEÑO DE RECOMENDACIONES (RECOMMENDATION CARD) ---
    if (notification.type === "recommendation") {
      const { id } = notification;
      return (
        <CardUi/>
      );
    }

    // --- DISEÑO ESTÁNDAR (Resto de tipos: success, error, info) ---
    return (
      <div
        key={notification.id}
        className={`p-4 hover:bg-gray-100 transition-colors ${
          !notification.read ? "bg-blue-50" : "bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <NotificationIcon type={notification.type} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">
                  {notification.title}
                </p>
                {/* Texto más oscuro para legibilidad */}
                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>
                {/* Tiempo */}
                <p className="text-xs text-gray-600 mt-2">
                  {formatTimeAgo(notification.timestamp)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Botón Marcar como leída */}
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Marcar como leída"
                  >
                    <Check size={12} className="text-green-600" />
                  </button>
                )}
                {/* Botón Eliminar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Eliminar"
                >
                  <X size={12} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ------------------------------------------------------------------

  return (
    <div className="relative z-50">
      {/* Botón de campana (se mantiene) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay y Panel principal (se mantienen los z-index altos) */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]">
            {/* 1. Header (se mantiene) */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                <div className="flex items-center gap-2">
                  {/* Botón Marcar todas como leídas */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                  {/* Botón de Cerrar */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                // Llama a la función condicional para renderizar
                notifications.map(renderNotificationCard)
              )}
              {/* <Recommendation/> */}
            </div>

            {/* 3. Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={clearAll}
                  className="w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Eliminar todas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
