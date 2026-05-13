export default function ChatMessage({ role, text, time }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-4 max-w-[85%] ${
        isUser ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-3xl flex items-center justify-center shadow-sm ${
          isUser
            ? "bg-orange-500 text-slate-950"
            : "bg-slate-800 text-orange-300"
        }`}
      >
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      {/* Mensaje */}
      <div className={`space-y-2 ${isUser ? "items-end flex flex-col" : ""}`}>
        <div
          className={`rounded-3xl p-4 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-none bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10"
              : "rounded-tl-none bg-slate-800 border border-slate-700 text-slate-100"
          }`}
        >
          {text}
        </div>

        {time && (
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {time}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= ICONOS INLINE ================= */

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M12 2v4" />
    </svg>
  );
}