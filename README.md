# Xperience

## Descripción

Xperience es una aplicación web diseñada para gestionar y facilitar la organización de experiencias y recorridos extremos. Permite a los usuarios realizar reservas, generar códigos QR para acceso, recibir notificaciones y gestionar perfiles de usuario. El proyecto está dividido en un backend robusto y un frontend moderno, con el objetivo de ofrecer una experiencia fluida tanto para administradores como para usuarios finales.

## Tecnologías Utilizadas

- **Backend**: NestJS con TypeScript, MongoDB para la base de datos, y módulos para autenticación, correos electrónicos, notificaciones y más.
- **Frontend**: React con Vite para el desarrollo rápido, Tailwind CSS para el diseño responsivo, y componentes modulares para una interfaz intuitiva.
- **Otras herramientas**: Docker para contenedores, ESLint para linting, y Jest para pruebas.

## Estructura del Proyecto

- `backend/`: Contiene la API RESTful desarrollada con NestJS. Incluye módulos para usuarios, reservas, recorridos, códigos QR, notificaciones y configuración de sockets.
- `frontend/`: Interfaz de usuario construida con React. Organizada en componentes, páginas, rutas y hooks para una navegación eficiente.
- `mongo/`: Base de datos MongoDB local (archivos de WiredTiger).

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- Docker y Docker Compose (para la base de datos)
- Git

### Pasos
1. Clona el repositorio: `git clone https://github.com/MaxiLeguiza/xperience`
2. Instala dependencias del backend: `cd backend && npm install`
3. Instala dependencias del frontend: `cd ../frontend && npm install`
4. Levanta la base de datos: `cd backend && docker-compose up -d`
5. Ejecuta el backend: `npm run start:dev`
6. En otra terminal, ejecuta el frontend: `cd ../frontend && npm run dev`

Accede a la aplicación en `https://localhost:5173/` (frontend) y la API en `http://localhost:3001` (backend).

## Estado del Proyecto

Hasta el momento, hemos implementado:
- **Backend**: Módulos básicos de usuarios, autenticación, reservas y recorridos. Integración con MongoDB, envío de correos y notificaciones push. Configuración de WebSockets para comunicación en tiempo real.
- **Frontend**: Páginas principales, formularios de registro y login, visualización de recorridos y reservas. Diseño responsivo con Tailwind CSS.
- **Funcionalidades clave**: Generación de códigos QR, gestión de perfiles de usuario y sistema de notificaciones.

El proyecto está en desarrollo activo, con pruebas unitarias y de integración en marcha. Próximas mejoras incluyen optimización de rendimiento y expansión de funcionalidades.

## Contribución

Si deseas contribuir, revisa las guías en los README específicos de `backend/` y `frontend/`. Usa Git para ramas de features y crea pull requests para revisiones.

## Licencia

Este proyecto es privado y está bajo desarrollo interno.