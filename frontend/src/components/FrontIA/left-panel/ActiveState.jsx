export default function ActiveState({ expedition }) {
  // Seguimos usando tu lógica actual de imágenes dinámicas
  const deporte = expedition.activity || "adventure tourism";
  const promptImagen = encodeURIComponent(`Cinematic realistic action photography of ${deporte}, outdoors nature background, extreme sports, 8k resolution, vertical`);
  const safeImageUrl = `https://image.pollinations.ai/prompt/${promptImagen}?width=1080&height=1920&nologo=true`;

  return (
    // CONTENEDOR PADRE: Ocupa todo el espacio de LeftPanel (gracias a absolute inset-0)
    <div className="absolute inset-0 overflow-hidden flex flex-col justify-end">
      
      {/* 🌟 LA IMAGEN CORREGIDA: FONDO INMERSIVO 🌟 */}
      <img
        src={safeImageUrl}
        alt={`${deporte} en ${expedition.name}`}
        // ---------------------------------------------------------------------------------
        // 🛠️ EXPLICACIÓN DE LAS CLASES CLAVE:
        // 1. absolute inset-0: Fija la imagen a las 4 esquinas del contenedor padre.
        // 2. h-full w-full: Obliga a la imagen a tener el 100% del alto y ancho de su padre.
        // 3. object-cover: 🌟 ESTA ES LA MAGIA. Actúa como un fondo. La imagen se estira/recorta
        //    para llenar el espacio conservando su relación de aspecto (no se deforma).
        // 4. transition: Pequeño efecto para que no cargue de golpe.
        // ---------------------------------------------------------------------------------
        className="absolute inset-0 h-full w-full object-cover brightness-[0.7] transition-opacity duration-300 bg-slate-900"
        onError={(e) => {
          console.warn("❌ Falló la imagen principal.");
          e.target.onerror = null; 
          e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080&auto=format&fit=crop"; 
        }}
      />
      
      {/* 🌫️ Degradado superpuesto para asegurar que el texto sea legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      
      {/* 📝 CONTENIDO DE TEXTO (Superpuesto a la imagen gracias a relative z-10) */}
      {/* Movimos el padding (p-6/p-12) aquí para que no afecte a la imagen de fondo */}
      <div className="relative z-10 max-w-2xl space-y-6 p-6 md:p-12">
        <p className="text-sm uppercase tracking-[0.4em] text-orange-300">
          {deporte.toUpperCase()} EXPEDITION
        </p>
        <p>
        <h2 className="text-4xl md:text-6xl font-black text-white font-display">
          {expedition.name} </h2>
        </p>
        
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-200">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Clima</p>
            <p className="mt-2 font-semibold text-white">{expedition.climate}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dificultad</p>
            <p className="mt-2 font-semibold text-white">{expedition.difficulty}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Zona</p>
            <p className="mt-2 font-semibold text-white">{expedition.region}</p>
          </div>
        </div>
        <p className="max-w-xl text-base text-slate-300">{expedition.description}</p>
      </div>
    </div>
  );
}