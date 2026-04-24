import { useState } from 'react'
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthSection from '../Autenticacion/AuthSection';

function Nav() {
    const { auth } = useAuth();
    // Estado para guardar el link seleccionado
    const [activeLink, setActiveLink] = useState();

    const links = [
        { label: "Recorridos", href: "/recorridos" },
        { label: "Influencers", href: "/ListInfluencer" },
        { label: "Proximamente", href: null },
    ];

    return (
        <header className="bg-card-dark shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO */}
                    <div className="flex items-center min-w-[100px]">
                        <Link to={auth ? "/home" : "/"}>
                            <h1 className="text-3xl font-bold text-primary "> Xperience</h1>
                        </Link>
                    </div>
                    {/* LINKS DE NAVEGACIÓN */}
                    <nav className="hidden md:flex items-center space-x-4 mx-auto w-auto">
                        {links.map((link) => {
                            const isActive = activeLink === link.label;
                            const linkClass = `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
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