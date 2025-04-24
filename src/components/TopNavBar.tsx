import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink for active styling

// Interface para las props
interface TopNavBarProps {
    isAdminMode: boolean;
    showPremios: boolean; // Prop para controlar visibilidad del enlace Premios
    // --- AÑADIDO (Opcional): Podríamos añadir prop para controlar Ranking si fuera necesario ---
    // showRanking?: boolean;
    // --- FIN AÑADIDO ---
}

// --- MODIFICADO: Añadir prop votingActive ---
interface TopNavBarProps {
    isAdminMode: boolean;
    showPremios: boolean;
    votingActive: boolean; // Para mostrar/ocultar Votaciones si está inactivo globalmente
}
// --- FIN MODIFICACIÓN ---


const TopNavBar: React.FC<TopNavBarProps> = ({ isAdminMode, showPremios, votingActive }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     // --- Navigation Links ---
     // Definimos los enlaces base que siempre están (excepto Premios/Votaciones condicionales)
     const baseLinks = [
         { href: "/", label: "Inicio" },
         { href: "/traducciones", label: "Traducciones" },
         // Premios se insertará condicionalmente
         // Votaciones se insertará condicionalmente
         // --- AÑADIDO: Enlace para Ranking Semanal ---
         { href: "/ranking-semanal", label: "Ranking Semanal" },
         // --- FIN AÑADIDO ---
         { href: "/sobre-mi", label: "Sobre Mí" },
     ];

     // Construir la lista final de enlaces
     let headerLinks = [...baseLinks];

     // Insertar Premios si showPremios es true
     if (showPremios) {
         // Encontrar el índice después de Traducciones para insertar Premios
         const traduccionesIndex = headerLinks.findIndex(link => link.href === "/traducciones");
         if (traduccionesIndex !== -1) {
             headerLinks.splice(traduccionesIndex + 1, 0, { href: "/premios", label: "Premios" });
         } else { // Si no encuentra traducciones (raro), lo añade al final
              headerLinks.push({ href: "/premios", label: "Premios" });
         }
     }

     // Insertar Votaciones si votingActive es true
     if (votingActive) {
        // Encontrar índice donde insertar (después de Premios si existe, o después de Traducciones si no)
        const premiosIndex = headerLinks.findIndex(link => link.href === "/premios");
        const targetIndex = premiosIndex !== -1
            ? premiosIndex + 1
            : headerLinks.findIndex(link => link.href === "/traducciones") + 1;

        if (targetIndex > 0) { // Asegurarse que el índice es válido
             headerLinks.splice(targetIndex, 0, { href: "/votaciones", label: "Votaciones" });
        } else { // Si algo falla, añadir al final (después de los baseLinks iniciales)
            const sobreMiIndex = headerLinks.findIndex(link => link.href === "/sobre-mi");
            if (sobreMiIndex !== -1) {
                 headerLinks.splice(sobreMiIndex, 0, { href: "/votaciones", label: "Votaciones" });
            } else {
                 headerLinks.push({ href: "/votaciones", label: "Votaciones" });
            }
        }
     }

     // Añadir enlace a Panel Admin si isAdminMode es true (opcional)
     // if (isAdminMode) {
     //     headerLinks.push({ href: "/panel-admin", label: "Panel Admin" });
     // }


    // Style for active NavLink
    const activeClassName = "bg-gray-700/80 text-white";
    const inactiveClassName = "text-gray-300 hover:bg-gray-700/50 hover:text-white";

    return (
         <nav className="relative z-50 bg-gray-950/90 backdrop-blur-md shadow-md border-b border-gray-700/50">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex items-center justify-between h-14">
                     {/* Left Side: Logo Placeholder + Title */}
                     <Link to="/" className="flex items-center flex-shrink-0">
                          <img className="block h-8 w-auto mr-3" src="https://placehold.co/100x32/1F2937/4B5563?text=Logo" alt="Logo Placeholder" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                          <span className="text-white font-bold text-lg hover:text-pink-300 transition-colors"> Shiro Nexus </span>
                     </Link>

                     {/* Right Side: Navigation Links (ahora dinámicos) */}
                     <div className="hidden md:block">
                         <div className="ml-10 flex items-baseline space-x-4">
                             {headerLinks.map((item) => ( // Usamos el array final
                                 <NavLink
                                     key={item.label}
                                     to={item.href}
                                     end={item.href === "/"} // Exact match for home only
                                     className={({ isActive }) =>
                                         `${isActive ? activeClassName : inactiveClassName} px-3 py-2 rounded-md text-sm font-medium transition-colors`
                                     }
                                 >
                                     {item.label}
                                 </NavLink>
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
                             {headerLinks.map((item) => ( // Usamos el array final
                                  <NavLink
                                      key={item.label + "-mobile"}
                                      to={item.href}
                                      end={item.href === "/"}
                                      className={({ isActive }) =>
                                         `${isActive ? activeClassName : inactiveClassName} block px-3 py-2 rounded-md text-base font-medium transition-colors`
                                      }
                                      onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                                  >
                                      {item.label}
                                  </NavLink>
                             ))}
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>
         </nav>
     );
}

export default TopNavBar;
