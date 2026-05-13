    import { GoogleGenAI } from "@google/genai";

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

    if (!API_KEY) {
    console.warn("⚠️ Falta VITE_GEMINI_API_KEY en .env");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // 🧠 Variable global para mantener viva la sesión del chat y recordar el contexto
    let chatSession = null;

    /**
     * 🔁 Retry con Exponential Backoff para evadir errores 429 (Límite de cuota)
     */
    async function retry(fn, retries = 2, delay = 1000) {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        
        // Detectamos si el error es por límite de velocidad (429)
        const isRateLimit = err.status === 429 || err?.message?.includes("429");
        const nextDelay = isRateLimit ? delay * 2 : delay; // Duplica el tiempo si es 429
        
        console.warn(`⏳ Reintentando petición en ${nextDelay}ms... (Intentos restantes: ${retries})`);
        await new Promise((res) => setTimeout(res, nextDelay));
        
        return retry(fn, retries - 1, nextDelay);
    }
    }

    /**
     * 🤖 Inicializa el chat con instrucciones de sistema minificadas (Ahorro extremo de tokens)
     */
    function getChatSession() {
    if (!chatSession) {
        chatSession = ai.chats.create({
        // Usamos 2.5-flash: El modelo más rápido, inteligente conversacionalmente y económico
        model: "gemini-2.5-flash", 
        config: {
            systemInstruction: `Eres experto en viajes, turismo y expediciones extremas. Conversa amigablemente.
    REGLA ESTRICTA: Tu respuesta debe ser SIEMPRE un JSON válido.
    Estructura normal:
    {"c": "tu mensaje de chat para el usuario", "d": null}

    Solo si el usuario pide explícitamente un destino, aventura o recomendación, usa esta estructura:
    {"c": "mensaje amigable", "d": {"n": "nombre del lugar", "a": "DEBES elegir el deporte o actividad de aventura principal MÁS RELEVANTE para este lugar en inglés (ej: rafting, trekking, climbing, skiing). NO devuelvas null aquí.", "cl": "clima (ej: Árido de montaña)", "df": "dificultad (ej: Media/Alta)", "r": "región (ej: Mendoza, Argentina)", "ds": "descripción emocionante muy corta de 2 líneas"}}`,
            
            // Obliga al modelo a responder exclusivamente en formato JSON
            responseMimeType: "application/json",
            temperature: 0.7,
        },
        });
    }
    return chatSession;
    }

    /**
     * 🚀 Función principal exportada para el Frontend
     */
    export async function askGemini(prompt) {
    if (!API_KEY) throw new Error("API Key no configurada");

    try {
        // 1. Obtenemos la sesión activa (o la creamos si es el primer mensaje)
        const chat = getChatSession();

        // 2. Enviamos SOLO el texto del usuario. La SDK maneja todo el historial.
        const response = await retry(() => chat.sendMessage({ message: prompt }));

        // 3. Obtenemos el JSON minificado ("c", "d", "n", etc.)
        const raw = response.text || "{}";
        const minifiedData = JSON.parse(raw);

        // 4. 🔄 Reconstruimos el objeto para que tu Frontend (React) reciba nombres claros
        const parsed = {
        chat_message: minifiedData.c || "",
        destination_data: minifiedData.d ? {
            name: minifiedData.d.n,
            activity: minifiedData.d.a, // Ahora pasamos el deporte en lugar de la URL rota
            climate: minifiedData.d.cl,
            difficulty: minifiedData.d.df,
            region: minifiedData.d.r,
            description: minifiedData.d.ds
        } : null
        };

        return {
        raw,
        data: parsed,
        };
    } catch (err) {
        console.error("❌ Falló Gemini:", err.message);
        throw new Error(err.message || "Error desconocido en el chat");
    }
    }