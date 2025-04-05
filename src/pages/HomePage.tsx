import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import { motion } from 'framer-motion'; // Import motion for animations
import WinnerCard from '../components/WinnerCard'; // Import WinnerCard if showing previews

// Sample data for award previews (replace with actual data fetching later)
// Using the same structure as defined in WinnerCard's expected props
const previewWinners = [
     { id: "preview-1", category: "Mejor Animación (Preview)", image: "https://placehold.co/400x600/374151/D1D5DB?text=Animación+Ejemplo", name: "Anime Ejemplo A", extra: "Estudio X", color: "yellow" },
     { id: "preview-2", category: "Mejor Drama (Preview)", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Drama+Ejemplo", name: "Anime Ejemplo B", extra: "Estudio Y", color: "red" },
];


function HomePage() {
    useEffect(() => {
        document.title = "Inicio | Shiro Nexus"; // Set title for the homepage
    }, []);

    // Animation variants for sections/cards
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };


    return (
        // Use motion.div for potential page transition animations later
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* === Hero Section === */}
            <motion.section
                className="relative bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white py-24 md:py-32 px-6 text-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Background elements */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

                <motion.div
                    className="relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Shiro Nexus</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Tu portal central para explorar premios de anime, participar en votaciones, acceder a traducciones exclusivas y mucho más.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/premios" // Link to the Awards page
                            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Explorar Premios Shiro Awards 2025
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* === Featured Sections Grid === */}
            <motion.section
                className="py-16 md:py-24 px-6 bg-gray-950" // Slightly different background
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% visible
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explora Nuestras Secciones</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card: Premios */}
                    <motion.div variants={itemVariants}>
                        <Link to="/premios" className="group block p-8 bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl shadow-xl hover:shadow-pink-500/30 border border-transparent hover:border-pink-500/50 transition-all duration-300 h-full flex flex-col">
                             {/* Placeholder for Icon */}
                             <div className="mb-4 text-pink-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                 </svg>
                             </div>
                            <h3 className="text-2xl font-semibold mb-2 text-center text-white group-hover:text-pink-300 transition-colors">Premios</h3>
                            <p className="text-gray-400 text-center flex-grow">Descubre los ganadores anuales y lo más destacado de la temporada.</p>
                        </Link>
                    </motion.div>

                    {/* Card: Votaciones */}
                    <motion.div variants={itemVariants}>
                         <Link to="/votaciones" className="group block p-8 bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl shadow-xl hover:shadow-blue-500/30 border border-transparent hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                             {/* Placeholder for Icon */}
                             <div className="mb-4 text-blue-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                 </svg>
                             </div>
                            <h3 className="text-2xl font-semibold mb-2 text-center text-white group-hover:text-blue-300 transition-colors">Votaciones</h3>
                            <p className="text-gray-400 text-center flex-grow">¡Tu opinión cuenta! Participa en nuestras encuestas y votaciones activas.</p>
                        </Link>
                    </motion.div>

                    {/* Card: Traducciones */}
                    <motion.div variants={itemVariants}>
                         <Link to="/traducciones" className="group block p-8 bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl shadow-xl hover:shadow-green-500/30 border border-transparent hover:border-green-500/50 transition-all duration-300 h-full flex flex-col">
                            {/* Placeholder for Icon */}
                             <div className="mb-4 text-green-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                 </svg>
                             </div>
                            <h3 className="text-2xl font-semibold mb-2 text-center text-white group-hover:text-green-300 transition-colors">Traducciones</h3>
                            <p className="text-gray-400 text-center flex-grow">Explora contenido exclusivo traducido por nuestro equipo.</p>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* === Latest Winners Preview Section (Optional) === */}
            <motion.section
                className="py-16 md:py-24 px-6 bg-gray-900" // Different background again
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Últimos Ganadores Destacados</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                     {previewWinners.map(winner => (
                         // Apply itemVariants to each WinnerCard for staggered animation
                         <motion.div key={winner.id} variants={itemVariants}>
                             <WinnerCard winner={winner} />
                         </motion.div>
                     ))}
                </div>
                 <div className="text-center mt-12">
                     <Link
                        to="/premios"
                        className="text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                    >
                        Ver todos los premios &rarr;
                    </Link>
                 </div>
            </motion.section>

            {/* Add more sections as needed */}

        </motion.div>
    );
}

export default HomePage;
