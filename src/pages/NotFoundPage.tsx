import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function NotFoundPage() {
    useEffect(() => {
        document.title = "Página No Encontrada | Shiro Nexus";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-900">
            <h1 className="text-6xl font-bold text-pink-500 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-white mb-6">Página No Encontrada</h2>
            <p className="text-gray-400 mb-8">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link
                to="/" // Link back to the homepage
                className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-200"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}

export default NotFoundPage; // Default export
