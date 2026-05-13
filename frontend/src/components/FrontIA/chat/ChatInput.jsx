import { useState } from "react";

export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-4">
      <div className="relative flex items-center">
        {/* 🔥 CAMBIO CLAVE: Cambiamos <textarea> por <input type="text"> */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // En un input, presionar Enter envía el formulario por defecto, 
            // pero mantenemos tu lógica por seguridad.
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          // Limpié clases innecesarias como resize-none o rows={1} que no aplican a <input>
          className="w-full rounded-full border border-slate-800 bg-slate-900 px-5 py-3 pr-28 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
          placeholder="Describe tu próxima expedición..."
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          // Ajuste fino en la posición del botón para que quede centrado perfecto
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </div>
    </div>
  );
}