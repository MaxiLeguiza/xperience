export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-950/95">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/10">
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Extreme AI</p>
        </div>
      </div>

     {/*<button className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-slate-300 transition hover:border-orange-300/40 hover:bg-slate-800 hover:text-white">
        <span className="hidden sm:inline text-sm">Ajustes</span>
      </button>*/ } 
    </div>
  );
}