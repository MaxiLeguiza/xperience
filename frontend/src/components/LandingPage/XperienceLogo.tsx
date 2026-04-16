interface XperienceLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function XperienceLogo({ className = "", size = 40, showText = true }: XperienceLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* X Shape */}
        <path 
          d="M 20 10 L 35 10 L 50 40 L 65 10 L 80 10 L 60 50 L 80 90 L 65 90 L 50 60 L 35 90 L 20 90 L 40 50 Z" 
          fill="#d86015"
        />
        
        {/* Circular connector */}
        <circle 
          cx="50" 
          cy="50" 
          r="8" 
          fill="none" 
          stroke="#d86015" 
          strokeWidth="3"
        />
        
        {/* Particle dots (representing motion/action) */}
        <circle cx="68" cy="60" r="3" fill="#d86015" opacity="0.8" />
        <circle cx="75" cy="63" r="2.5" fill="#d86015" opacity="0.6" />
        <circle cx="82" cy="66" r="2" fill="#d86015" opacity="0.4" />
        <circle cx="68" cy="70" r="3" fill="#d86015" opacity="0.8" />
        <circle cx="75" cy="73" r="2.5" fill="#d86015" opacity="0.6" />
        <circle cx="82" cy="76" r="2" fill="#d86015" opacity="0.4" />
        <circle cx="68" cy="80" r="3" fill="#d86015" opacity="0.8" />
        <circle cx="75" cy="83" r="2.5" fill="#d86015" opacity="0.6" />
        <circle cx="82" cy="86" r="2" fill="#d86015" opacity="0.4" />
      </svg>
      
      {/* Text */}
      {showText && (
        <span className="text-2xl tracking-wider" style={{ fontFamily: 'cursive, sans-serif' }}>
          XPERIENCE
        </span>
      )}
    </div>
  );
}
