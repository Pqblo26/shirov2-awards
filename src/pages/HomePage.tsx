import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

function HomePage() {
    useEffect(() => {
        document.title = "Inicio | Shiro Nexus"; // Set title for the homepage
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            {/* Welcome Section */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bienvenido a <span className="text-pink-400">Shiro Nexus</span>
            </h1>
            <p className="text-lg text-gray-300 mb-12">
                Tu portal central para premios, votaciones, traducciones y más del mundo del anime.
            </p>

            {/* Quick Links/Featured Sections (Example) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Link to Premios */}
                <Link to="/premios" className="block p-6 bg-gray-800/50 rounded-lg shadow-lg hover:bg-gray-700/50 transition-colors">
                    <h2 className="text-2xl font-semibold mb-2 text-pink-400">🏆 Premios</h2>
                    <p className="text-gray-400">Descubre los ganadores de los Shiro Awards 2025.</p>
                </Link>

                {/* Link to Votaciones */}
                <Link to="/votaciones" className="block p-6 bg-gray-800/50 rounded-lg shadow-lg hover:bg-gray-700/50 transition-colors">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-400">🗳️ Votaciones</h2>
                    <p className="text-gray-400">Participa y elige a tus favoritos.</p>
                </Link>

                {/* Link to Traducciones */}
                <Link to="/traducciones" className="block p-6 bg-gray-800/50 rounded-lg shadow-lg hover:bg-gray-700/50 transition-colors">
                    <h2 className="text-2xl font-semibold mb-2 text-green-400">📜 Traducciones</h2>
                    <p className="text-gray-400">Explora nuestras últimas traducciones.</p>
                </Link>
            </div>

            {/* You can add more sections like latest news, etc. */}

        </div>
    );
}

export default HomePage;
