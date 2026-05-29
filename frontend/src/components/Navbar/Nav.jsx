import { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthSection from '../Autenticacion/AuthSection';
import { Menu, X } from 'lucide-react';

function Nav() {
    const { auth, logout } = useAuth();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Cerrar menú al navegar
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const links = [
        { label: "Actividades", href: "/recorridos" },
        { label: "Influencers", href: "/ListInfluencer" },
        { label: "Extreme IA", href: "/Chat" },
    ];

    return (
        <>
            <header className="bg-card-dark shadow-md sticky top-0 z-50">
                <div className="w-full px-3 md:px-9">
                    <div className="flex items-center justify-between h-14 md:h-16 relative">

                        {/* IZQUIERDA: Hamburguesa (mobile) + Logo (desktop) */}
                        <div className="flex items-center gap-3 min-w-[100px] z-10">
                            {/* Botón hamburguesa - solo mobile */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Abrir menú"
                            >
                                <Menu size={22} className="text-white" />
                            </button>

                            {/* Logo - visible en desktop, oculto en mobile (se muestra centrado abajo) */}
                            <Link to={auth ? "/home" : "/"} className="hidden md:block">
                                <h1 className="text-4xl font-bold text-primary hover:scale-105 transition-all hover:text-white">
                                    X<span className="text-white">PERIENCE</span>
                                </h1>
                            </Link>
                        </div>

                        {/* CENTRO: Logo centrado (solo mobile) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden">
                            <Link to={auth ? "/home" : "/"} className="pointer-events-auto">
                                <h1 className="text-2xl font-bold text-primary hover:scale-105 transition-all">
                                    X<span className="text-white">PERIENCE</span>
                                </h1>
                            </Link>
                        </div>

                        {/* CENTRO: Links de navegación (solo desktop) */}
                        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
                            {links.map((link) => {
                                const isActive = activeLink === link.label;
                                const linkClass = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-110 transition-all ${isActive
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-white hover:text-primary"
                                    }`;

                                if (!link.href) {
                                    return (
                                        <button
                                            key={link.label}
                                            type="button"
                                            disabled
                                            className="px-3 py-2 rounded-md text-sm font-medium text-white opacity-50 cursor-not-allowed"
                                        >
                                            {link.label}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        onClick={() => setActiveLink(link.label)}
                                        className={linkClass}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* DERECHA: Auth (campana + usuario) */}
                        <div className='min-w-[80px] md:min-w-[100px] z-10 flex justify-end'>
                            <AuthSection />
                        </div>
                    </div>
                </div>
            </header>

            {/* MENÚ LATERAL MOBILE (Drawer) */}
            {/* Overlay oscuro */}
            <div
                className={`fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 md:hidden ${
                    mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel lateral */}
            <div
                className={`fixed top-0 left-0 h-full w-[280px] bg-[#0f1629] z-[9999] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header del drawer */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-primary">
                        X<span className="text-white">PERIENCE</span>
                    </h2>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Cerrar menú"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Links de navegación */}
                <nav className="flex flex-col py-4">
                    {links.map((link) => {
                        const isActive = activeLink === link.label;
                        return (
                            <Link
                                key={link.label}
                                to={link.href || "#"}
                                onClick={() => {
                                    setActiveLink(link.label);
                                    setMobileMenuOpen(false);
                                }}
                                className={`px-6 py-3.5 text-[15px] font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary bg-primary/10 border-l-3 border-primary'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sección de usuario (abajo) */}
                {auth && (
                    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                {(auth.nombre || auth.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">
                                    {auth.nombre || auth.email?.split("@")[0]}
                                </p>
                                <p className="text-gray-500 text-xs">{auth.email || ""}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full py-2.5 rounded-lg border border-orange-600/50 text-orange-500 text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
export default Nav