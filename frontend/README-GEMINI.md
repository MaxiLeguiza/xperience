# Configuración de Gemini API para Xperience Chat

## Pasos para activar la IA

### 1. Obtener tu API Key de Gemini (GRATIS)

```bash
1. Ve a: https://ai.google.dev/
2. Haz clic en "Get API Key" (arriba a la derecha)
3. Selecciona "Create API key in new Google Cloud project"
4. Copia la clave generada (algo como: AIzaSy...)
```

### 2. Configurar tu proyecto local

```bash
# En la carpeta frontend/, crea o edita el archivo .env.local
VITE_GEMINI_API_KEY=tu_clave_aqui

# Ejemplo:
VITE_GEMINI_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Reinicia el servidor de desarrollo

```bash
npm run dev
```

## Qué sucede cuando el usuario envía un mensaje

1. **Usuario escribe**: "Quiero una expedición a las montañas nevadas"
2. **Chat envía a Gemini**: El prompt se procesa y se envía a la API
3. **Gemini responde**: Genera datos de expedición en formato JSON
4. **Chat muestra**: Los datos se muestran en la tarjeta de expedición

## Campos de la expedición

```json
{
  "name": "Nombre de la expedición",
  "image": "URL de imagen de Unsplash",
  "climate": "Tipo de clima",
  "difficulty": "Nivel de dificultad",
  "region": "Región geográfica",
  "description": "Descripción breve"
}
```

## Solución de problemas

### Error: "VITE_GEMINI_API_KEY no está configurada"
- Revisa que el archivo `.env.local` exista en la carpeta `frontend/`
- Verifica que la clave esté correcta

### Error: "API Key no válida"
- Asegúrate de haber copiado la clave completa sin espacios
- Genera una nueva clave en: https://makersuite.google.com/app/apikey

### Gemini no devuelve JSON válido
- El prompt está optimizado para evitar esto
- Si persiste, reinicia el servidor

## Límites y consideraciones

- **Límite gratuito**: 60 requests por minuto
- **Modelo usado**: gemini-pro (más económico y rápido)
- **Almacenamiento**: Los datos se guardan en el estado local de React

## ¿Ya tienes configurada tu API Key?

Si ya has agregado `VITE_GEMINI_API_KEY` a tu `.env.local`, ¡ahora puedes:

1. Abre http://localhost:5173/chat
2. Escribe una descripción de viaje
3. Presiona Enter o haz clic en "Enviar"
4. La IA generará tu expedición personalizada

---

**Preguntas frecuentes:**

**¿Es gratuito?**
Sí, Google ofrece un nivel gratuito. Gemini-pro tiene límite generoso para desarrollo.

**¿Dónde se guardan los datos?**
Solo en el navegador (estado React). No se envían a ningún servidor propio.

**¿Puedo cambiar el modelo?**
Sí, en `gemini.js` cambia `gemini-pro` por `gemini-1.5-pro` (más potente pero más lento).
