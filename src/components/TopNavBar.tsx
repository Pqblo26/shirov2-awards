import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Define the props interface
interface TopNavBarProps {
    isAdminMode: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ isAdminMode }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     // --- Navigation Links (Restricted) ---
    const headerLinks = [
        { href: "/", label: "Inicio" },
        { href: "/traducciones", label: "Traducciones" },
        // Commented out other links
        { href: "/premios", label: "Premios" },
        // { href: "/votaciones", label: "Votaciones" },
        // { href: "/contacto", label: "Contacto" },
        // ...(isAdminMode ? [{ href: "/admin", label: "Admin" }] : []),
        // { href: "/login", label: "Login" },
    ];

    return (
         <nav className="relative z-50 bg-gray-950/90 backdrop-blur-md shadow-md border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Left Side: Logo Placeholder + Title */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                         <img className="block h-8 w-auto mr-3" src="https://placehold.co/100x32/1F2937/4B5563?text=Logo" alt="Logo Placeholder" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                         <span className="text-white font-bold text-lg hover:text-pink-300 transition-colors"> Shiro Nexus </span>
                    </Link>

                    {/* Right Side: Navigation Links (Restricted) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {headerLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen} >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMobileMenuOpen ? ( <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> ) : ( <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg> )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div className="md:hidden" id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: 'hidden' }} >
                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {headerLinks.map((item) => (
                                 <Link key={item.label + "-mobile"} to={item.href} className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors`} onClick={() => setIsMobileMenuOpen(false)} >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default TopNavBar;
