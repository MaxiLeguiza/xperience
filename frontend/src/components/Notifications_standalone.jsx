import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Trash2,
  Check,
} from "lucide-react";

// Componente para el ícono de notificación
export const NotificationIcon = ({ type }) => {
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
    const sampleNotifications = [
      {
        id: "1",
        type: "success",
        title: "Operación exitosa",
        message: "Los datos se guardaron correctamente",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
      },
      {
        id: "2",
        type: "warning",
        title: "Advertencia del sistema",
        message: "El espacio de almacenamiento está llegando al límite",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
      },
      {
        id: "3",
        type: "error",
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
        read: true,
      },
      {
        id: "4",
        type: "info",
        title: "Nueva actualización",
        message: "Hay una nueva versión disponible",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        read: false,
      },
    ];
    setNotifications(sampleNotifications);
  }, []);

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

  const addNotification = (type) => {
    const titles = {
      success: "Operación completada",
      warning: "Atención requerida",
      error: "Error detectado",
      info: "Nueva información",
    };

    const messages = {
      success: "La acción se realizó correctamente",
      warning: "Revisa la configuración del sistema",
      error: "Se produjo un error inesperado",
      info: "Tienes nuevas actualizaciones disponibles",
    };

    const newNotification = {
      id: Date.now().toString(),
      type,
      title: titles[type],
      message: messages[type],
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <div className="relative z-50">
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-800" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay para cerrar (Mantiene z-index alto) */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel principal (Mantiene z-index muy alto) */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]">
            {/* 1. Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                <div className="flex items-center gap-2">
                  {/* Botón Marcar todas como leídas */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Marcar todas como leídas
                    </button>
                  )}

                  {/* Botón de Cerrar */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-300 rounded"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* 🛑 SE ELIMINÓ: Botones para agregar notificaciones de prueba 🛑 */}

            {/* 2. Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors ${
                        !notification.read
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
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

                              {/* TEXTO DE MENSAJE: Cambiado a text-gray-700 */}
                              <p className="text-sm text-gray-500 dark:text-gray-700 mt-1">
                                {notification.message}
                              </p>

                              {/* TEXTO DE TIEMPO: Cambiado a text-gray-600 */}
                              <p className="text-xs **text-gray-600** dark:text-gray-700 mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Botón Marcar como leída: Ajustado hover */}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-300 rounded"
                                  title="Marcar como leída"
                                >
                                  <Check size={12} className="text-green-600" />
                                </button>
                              )}
                              {/* Botón Eliminar: Ajustado hover */}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-300 rounded"
                                title="Eliminar"
                              >
                                <X size={12} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearAll}
                  className="w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center justify-center gap-2"
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
