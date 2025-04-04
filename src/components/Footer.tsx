import React from 'react';

function Footer() {
    return (
        <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-700/50 mt-16 relative z-10">
             {/* Updated Footer Name back to Awards */}
            &copy; {new Date().getFullYear()} Shiro Awards by Jesús · Todos los derechos reservados
            <p className="mt-2 text-xs">Shiro Nexus: Plataforma de anime, premios, votaciones, traducciones y más.</p> {/* Kept Nexus mention here */}
        </footer>
    );
}

export default Footer;