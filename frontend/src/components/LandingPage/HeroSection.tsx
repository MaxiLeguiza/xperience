import { Button } from './ui/button';
import { ArrowRight, Play, Zap, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761064921615-22529f0ac609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBhdGhsZXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyMjI4MzAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Deportes extremos"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-5 sm:top-10 md:top-20 right-5 sm:right-10 md:right-20 w-40 sm:w-72 md:w-96 h-40 sm:h-72 md:h-96 bg-[#d86015] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-5 sm:bottom-10 md:bottom-20 left-5 sm:left-10 md:left-20 w-32 sm:w-52 md:w-72 h-32 sm:h-52 md:h-72 bg-[#ef4444] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-[#d86015]/20 to-[#ef4444]/20 border border-[#d86015]/50 rounded-full text-[#d86015] backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer text-xs sm:text-sm">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Plataforma #1 de Deportes Extremos</span>
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>

        <h1 className="text-white mb-4 sm:mb-6 leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-[160px] font-black">
          Vive la
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] via-[#d86015] to-[#ef4444] animate-pulse">
            Aventura Extrema
          </span>
        </h1>

        <p className="text-white/80 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed text-base sm:text-lg md:text-2xl lg:text-[24px] text-center">
          Descubre las mejores ubicaciones, conecta con atletas profesionales y planifica tus próximas aventuras extremas en un solo lugar
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button onClick={() => navigate('/login')} size="lg" className="bg-gradient-to-r from-[#ef4444] to-[#d86015] hover:from-[#ef4444]/90 hover:to-[#d86015]/90 text-white text-sm sm:text-base lg:text-lg px-6 sm:px-8 hover:scale-105 hover:shadow-2xl hover:shadow-[#d86015]/30 transition-all w-full sm:w-auto">
            Explorar Ahora
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-sm sm:text-base lg:text-lg px-6 sm:px-8 hover:scale-105 transition-all bg-[rgba(255,0,0,0.45)] w-full sm:w-auto">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
            Ver Demo
          </Button>
        </div>

        {/* Stats with enhanced design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mt-10 sm:mt-16 md:mt-20 max-w-5xl mx-auto">
          <div className="text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-1 sm:mb-2">500+</p>
            <p className="text-white/70 text-xs sm:text-sm md:text-base">Ubicaciones</p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-1 sm:mb-2">2M+</p>
            <p className="text-white/70 text-xs sm:text-sm md:text-base">Aventureros</p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-1 sm:mb-2">50+</p>
            <p className="text-white/70 text-xs sm:text-sm md:text-base">Disciplinas</p>
          </div>
          <div className="text-center p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-1 sm:mb-2">4.9★</p>
            <p className="text-white/70 text-xs sm:text-sm md:text-base">Valoración</p>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-[#d86015]/50 rounded-full flex justify-center pt-1.5 sm:pt-2 bg-[#d86015]/10 backdrop-blur-sm">
          <div className="w-1 h-2 bg-[#d86015] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
