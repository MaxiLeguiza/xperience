import { HeroSection } from '../components/LandingPage/HeroSection';
import { MapSection } from '../components/LandingPage/MapSection';
import { InfluencersSection } from '../components/LandingPage/InfluencersSection';
import { ExtremeSportsSection } from '../components/LandingPage/ExtremeSportsSection';
import { XperienceLogo } from '../components/LandingPage/XperienceLogo';
import { NavLogo } from '../components/LandingPage/NavLogo';
import { Mountain, Instagram, Twitter, Facebook, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-1.5">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <NavLogo />

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8">
                            <a href="#map" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105 text-xs lg:text-sm">
                                Mapa
                            </a>
                            <a href="#influencers" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105 text-xs lg:text-sm">
                                Influencers
                            </a>
                            <a href="#sports" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105 text-xs lg:text-sm">
                                Deportes
                            </a>

                        </div>

                        {/* CTA Button Desktop */}
                        <button onClick={() => navigate('/login')} className="hidden md:block px-3 lg:px-5 py-1.5 lg:py-2 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white rounded-md hover:shadow-xl hover:shadow-[#d86015]/30 transition-all hover:scale-105 hover:-translate-y-0.5 text-xs lg:text-sm whitespace-nowrap">
                            Inicia tu Aventura
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-3 space-y-1 border-t border-white/10 pt-3">
                            <a href="#map" className="block text-white/90 hover:text-[#d86015] transition-colors py-1.5 text-xs">
                                Mapa
                            </a>
                            <a href="#influencers" className="block text-white/90 hover:text-[#d86015] transition-colors py-1.5 text-xs">
                                Influencers
                            </a>
                            <a href="#sports" className="block text-white/90 hover:text-[#d86015] transition-colors py-1.5 text-xs">
                                Deportes
                            </a>
                            <a href="#about" className="block text-white/90 hover:text-[#d86015] transition-colors py-1.5 text-xs">
                                Nosotros
                            </a>
                            <button onClick={() => navigate('/login')} className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white rounded-md text-xs">
                                Únete Ahora
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Map Section */}
            <div id="map">
                <MapSection />
            </div>

            {/* Influencers Section */}
            <div id="influencers">
                <InfluencersSection />
            </div>

            {/* Extreme Sports Section */}
            <div id="sports">
                <ExtremeSportsSection />
            </div>

            {/* CTA Section */}
            <section className="relative py-12 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#ef4444] to-[#d86015]" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto text-center text-white">
                    <h2 className="mb-4 md:mb-6 text-white text-2xl sm:text-3xl md:text-[36px] font-bold leading-tight">¿Listo para la Aventura?</h2>
                    <p className="mb-6 md:mb-8 text-white/90 text-lg sm:text-xl md:text-[32px] leading-snug md:leading-normal">
                        Únete a miles de aventureros y comienza tu próximo desafío extremo hoy mismo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link to="/registrar" className="inline-block px-6 sm:px-8 py-3 md:py-4 bg-white text-black rounded-lg hover:bg-white/90 transition-all hover:scale-105 hover:shadow-2xl font-bold text-sm sm:text-base">
                            Crear Cuenta Gratis
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-8 md:py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
                        <div className="text-center sm:text-left">
                            <div className="mb-4 md:mb-6 flex justify-center sm:justify-start">
                                <XperienceLogo  />
                            </div>

                            <p className="text-white/70 text-sm md:text-[15px]">
                                Tu plataforma definitiva para deportes extremos y aventuras inolvidables
                            </p>
                        </div>

                        <div className="text-center sm:text-left">
                            <h4 className="mb-3 md:mb-4 text-white text-lg md:text-[20px] font-semibold">Deportes</h4>
                            <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Paracaidismo</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Escalada</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Surf</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Mountain Bike</a></li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <h4 className="mb-3 md:mb-4 text-white text-lg md:text-[20px] font-semibold">Compañía</h4>
                            <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Carreras</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Contacto</a></li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <h4 className="mb-3 md:mb-4 text-white text-lg md:text-[20px] font-semibold">Síguenos</h4>
                            <div className="flex gap-4 justify-center sm:justify-start">
                                <a href="#" className="text-white/70 hover:text-[#d86015] transition-all hover:scale-110">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-white/70 hover:text-[#d86015] transition-all hover:scale-110">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-white/70 hover:text-[#d86015] transition-all hover:scale-110">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 md:pt-8 border-t border-white/10 text-center text-white/60 text-xs md:text-sm">
                        <p>&copy; 2026 XPERIENCE. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
