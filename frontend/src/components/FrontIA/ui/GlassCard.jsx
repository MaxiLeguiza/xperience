export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/10 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}