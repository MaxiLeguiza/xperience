import { HeroSection } from '../components/LandingPage/HeroSection';
import { MapSection } from '../components/LandingPage/MapSection';
import { InfluencersSection } from '../components/LandingPage/InfluencersSection';
import { ExtremeSportsSection } from '../components/LandingPage/ExtremeSportsSection';
import { XperienceLogo } from '../components/LandingPage/XperienceLogo';
import { Mountain, Instagram, Twitter, Facebook, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-3 group text-[16px] px-[-5px] py-[0px]">
                            <XperienceLogo size={35} showText={false} />
                            <span className="text-2xl text-white tracking-wide transition-all group-hover:tracking-wider" style={{ fontFamily: 'cursive, sans-serif' }}>
                                PERIENCE
                            </span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#map" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105">
                                Mapa
                            </a>
                            <a href="#influencers" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105">
                                Influencers
                            </a>
                            <a href="#sports" className="text-white/90 hover:text-[#d86015] transition-all hover:scale-105">
                                Deportes
                            </a>

                        </div>

                        {/* CTA Button Desktop */}
                        <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white rounded-lg hover:shadow-xl hover:shadow-[#d86015]/30 transition-all hover:scale-105 hover:-translate-y-0.5">
                            Inicia tu Aventura
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
                            <a href="#map" className="block text-white/90 hover:text-[#d86015] transition-colors py-2">
                                Mapa
                            </a>
                            <a href="#influencers" className="block text-white/90 hover:text-[#d86015] transition-colors py-2">
                                Influencers
                            </a>
                            <a href="#sports" className="block text-white/90 hover:text-[#d86015] transition-colors py-2">
                                Deportes
                            </a>
                            <a href="#about" className="block text-white/90 hover:text-[#d86015] transition-colors py-2">
                                Nosotros
                            </a>
                            <button onClick={() => navigate('/login')} className="w-full mt-4 px-6 py-2.5 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white rounded-lg">
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
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#ef4444] to-[#d86015]" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto text-center text-white">
                    <h2 className="mb-6 text-white text-[36px]">¿Listo para la Aventura?</h2>
                    <p className="mb-8 text-white/90 text-[32px]">
                        Únete a miles de aventureros y comienza tu próximo desafío extremo hoy mismo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-black rounded-lg hover:bg-white/90 transition-all hover:scale-105 hover:shadow-2xl font-bold">
                            Crear Cuenta Gratis
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all hover:scale-105 font-bold">
                            Explorar Comunidad
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="mb-4">
                                <XperienceLogo size={30} showText={false} />
                                <span className="ml-2 text-[24px]" style={{ fontFamily: 'cursive, sans-serif' }}>PERIENCE</span>
                            </div>
                            <p className="text-white/70 text-[15px]">
                                Tu plataforma definitiva para deportes extremos y aventuras inolvidables
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-4 text-white text-[20px]">Deportes</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Paracaidismo</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Escalada</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Surf</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Mountain Bike</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-white text-[20px]">Compañía</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Carreras</a></li>
                                <li><a href="#" className="hover:text-[#d86015] transition-colors">Contacto</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-white text-[20px]">Síguenos</h4>
                            <div className="flex gap-4">
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

                    <div className="pt-8 border-t border-white/10 text-center text-white/60 text-sm">
                        <p>&copy; 2026 XPERIENCE. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
