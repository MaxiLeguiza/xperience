import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { askGemini } from "../../../Services/gemini";
import { useRef, useEffect } from "react";
export default function ChatPanel({ expedition, setExpedition }) {
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Bienvenido! Exploremos juntos tu próxima aventura. Describe el tipo de expedición que te gustaría vivir, y yo me encargaré de crear una ruta única para ti.",
            time: "AI Navigator",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async (text) => {
        if (!text?.trim()) return;

        const userMsg = {
            role: "user",
            text,
            time: "Sent",
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
        setError("");

        try {
            const response = await askGemini(text);
            const geminiData = response.data; // Aquí ya tenemos el JSON parseado

            // 1. Agregamos SOLO el texto conversacional a las burbujas del chat
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: geminiData.chat_message, // ✅ Ahora usamos solo el mensaje amigable
                    time: "AI Navigator",
                },
            ]);

            // 2. Actualizamos la tarjeta inferior SOLO si Gemini nos mandó datos de un viaje
            if (geminiData.destination_data) {
                setExpedition(geminiData.destination_data);
            }

        } catch {
            setError("No se pudo generar el recorrido. Intenta de nuevo más tarde.");
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "Lo siento, hubo un problema conectando con mi sistema de navegación. ¿Intentamos de nuevo?",
                    time: "AI Navigator",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 1. Creamos el "ancla"
    const messagesEndRef = useRef(null);

    // 2. Función para hacer el scroll suave
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 3. Efecto que se dispara cada vez que cambia 'messages' o 'loading'
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    return (
        <section className="w-full md:w-1/2 flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/40">
            <ChatHeader />
            <div className="border-b border-slate-800/70 px-6 py-1 bg-slate-950/95 flex-shrink-0">
                <h1 className="mt-3 text-3xl font-bold text-orange-300 md:text-4xl ">
                    Describe tu próximo viaje y yo lo convierto en ruta.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                    Conversa con nuestra IA para crear una ruta única, con clima y detalles del viaje.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6 bg-slate-950/80">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} {...msg} />
                ))}

                {loading && <div className="text-sm text-slate-400">Procesando tu consulta...</div>}
                {error && <p className="text-sm text-rose-300">{error}</p>}
             <div ref={messagesEndRef} /> {/* El "ancla" al final de los mensajes */}
         
            </div>
                    <div className="flex-shrink-0">
                <ChatInput onSend={handleSend} disabled={loading} />
            </div>
          
        </section>
    );
}