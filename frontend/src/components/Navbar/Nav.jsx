import { React, useEffect, useState } from 'react'
import Login from '../../pages/Login'
import Home from '../../pages/home';
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthSection from '../Autenticacion/AuthSection';

function Nav() {
    const { auth, logout } = useAuth();

    useEffect(() => {
        // Cargar Tailwind dinámicamente con plugins y color personalizado
        const script = document.createElement("script");
        script.src =
            "https://cdn.tailwindcss.com?plugins=forms,typography,container-queries";
        script.async = true;

        script.onload = () => {
            // Extender Tailwind con tu color personalizado
            if (window.tailwind) {
                window.tailwind.config = {
                    theme: {
                        extend: {
                            colors: {
                                'miColor': "#d86015", // Cambia esto por tu color
                                background: {
                                    light: "#f2f4f7",
                                    dark: "#1a1a1a",
                                },
                                text: {
                                    light: "#111827",
                                    dark: "#f9fafb",
                                },
                                primary: "#d86015",
                                secondary: "#16697A",
                                card: {
                                    light: "#ffffff",
                                    dark: "#111827",
                                },
                                border: {
                                    light: "#e5e7eb",
                                    dark: "#374151",
                                },
                            },
                        },
                    },
                    darkMode: "class",
                };
            }
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);
    // Estado para guardar el link seleccionado
    const [activeLink, setActiveLink] = useState(); // Por defecto "Influencers"

    const links = [
        { label: "Recorridos", href: "/recorridos" },
        { label: "Proximamente", href: "#" },
        { label: "Influencers", href: "/ListInfluencer" },
    ];

    return (
        <header className="bg-card-dark shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO */}
                    <div className="flex items-center min-w-[100px]">
                        <Link to="/">
                            <h1 className="text-3xl font-bold shadow-white-md text-primary ">Xperience</h1>
                        
                        </Link>
                    </div>
                    {/* LINKS DE NAVEGACIÓN */}
                    <nav className="hidden md:flex items-center space-x-4 mx-auto w-auto">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setActiveLink(link.label)}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${activeLink === link.label
                                    ? "text-primary border-b-2 border-primary" // seleccionado
                                    : "text-text-dark hover:text-primary"     // no seleccionado
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* BOTÓN DE LOGIN */}
                    <div className='min-w-[100px]'>
                            <AuthSection/>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Nav