import { Button } from './ui/button';
import { ArrowRight, Play, Zap, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#d86015] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#ef4444] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-[#d86015]/20 to-[#ef4444]/20 border border-[#d86015]/50 rounded-full text-[#d86015] backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
          <Zap className="w-4 h-4" />
          <span className="text-sm">Plataforma #1 de Deportes Extremos</span>
          <TrendingUp className="w-4 h-4" />
        </div>

        <h1 className="text-white mb-6 leading-tight text-[160px]">
          Vive la
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] via-[#d86015] to-[#ef4444] animate-pulse">
            Aventura Extrema
          </span>
        </h1>

        <p className="text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed text-[24px] text-center">
          Descubre las mejores ubicaciones, conecta con atletas profesionales y planifica tus próximas aventuras extremas en un solo lugar
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-[#ef4444] to-[#d86015] hover:from-[#ef4444]/90 hover:to-[#d86015]/90 text-white text-lg px-8 hover:scale-105 hover:shadow-2xl hover:shadow-[#d86015]/30 transition-all">
            Explorar Ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-8 hover:scale-105 transition-all bg-[rgba(255,0,0,0.45)]">
            <Play className="w-5 h-5 mr-2 fill-white" />
            Ver Demo
          </Button>
        </div>

        {/* Stats with enhanced design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-2">500+</p>
            <p className="text-white/70">Ubicaciones</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-2">2M+</p>
            <p className="text-white/70">Aventureros</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-2">50+</p>
            <p className="text-white/70">Disciplinas</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#d86015] mb-2">4.9★</p>
            <p className="text-white/70">Valoración</p>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#d86015]/50 rounded-full flex justify-center pt-2 bg-[#d86015]/10 backdrop-blur-sm">
          <div className="w-1 h-2 bg-[#d86015] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
