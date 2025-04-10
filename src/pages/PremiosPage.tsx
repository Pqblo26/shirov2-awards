import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WinnerCard from '../components/WinnerCard'; // Import reusable component
import ScrollToTopButton from '../components/ScrollToTopButton'; // Import scroll button

// --- Data (Could be imported from a separate data file) ---
const seasonWinnersData = [
    { id: "winter", category: "Mejor Anime de Invierno", image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Invierno+Ganador", name: "Anime Ejemplo Invierno", extra: "Estudio MAPPA", color: "blue" },
    { id: "spring", category: "Mejor Anime de Primavera", image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Primavera+Ganador", name: "Anime Ejemplo Primavera", extra: "Estudio WIT", color: "pink" },
    { id: "summer", category: "Mejor Anime de Verano", image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Verano+Ganador", name: "Anime Ejemplo Verano", extra: "Estudio Bones", color: "orange" },
    { id: "fall", category: "Mejor Anime de Otoño", image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Otoño+Ganador", name: "Anime Ejemplo Otoño", extra: "Estudio Ufotable", color: "red" },
];
const aspectWinnersData = [
    { id: "adaptacion", category: "Mejor Adaptación", image: "https://placehold.co/400x600/374151/D1D5DB?text=Adaptación", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
    { id: "animacion", category: "Mejor Animación", image: "https://placehold.co/400x600/374151/D1D5DB?text=Animación", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
    { id: "banda_sonora", category: "Mejor Banda Sonora", image: "https://placehold.co/400x600/374151/D1D5DB?text=B.Sonora", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
    { id: "estudio", category: "Mejor Estudio", image: "https://placehold.co/400x600/374151/D1D5DB?text=Estudio", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
];
const actorWinnersData = [
    { id: "actor_voz", category: "Mejor Actor de Voz", image: "https://placehold.co/400x600/4B5563/9CA3AF?text=Actor+Voz", name: "Nombre Ganador", extra: "Personaje", color: "indigo" },
    { id: "actriz_voz", category: "Mejor Actriz de Voz", image: "https://placehold.co/400x600/4B5563/9CA3AF?text=Actriz+Voz", name: "Nombre Ganador", extra: "Personaje", color: "indigo" },
];
const genreWinnersData = [
    { id: "accion", category: "Acción", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Acción", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    { id: "aventura", category: "Aventura", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Aventura", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    { id: "comedia", category: "Comedia", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Comedia", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    { id: "drama", category: "Drama", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Drama", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    { id: "deporte", category: "Deporte", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Deporte", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    { id: "romance", category: "Romance", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Romance", name: "Nombre Ganador", extra: "Detalles", color: "red" },
    // Add more genres...
];

// Sticky Nav Links (Internal Page Sections) - Specific to this page
const sectionLinks = [
    { href: "#temporadas", label: "Temporadas", hoverBg: "hover:bg-pink-600/80" },
    { href: "#aspect", label: "Aspectos Técnicos", hoverBg: "hover:bg-yellow-600/80" },
    { href: "#actores", label: "Actores de Voz", hoverBg: "hover:bg-indigo-600/80" },
    { href: "#generos", label: "Géneros", hoverBg: "hover:bg-red-600/80" },
];


function PremiosPage() {
    const pageRef = useRef(null); // Ref for parallax calculations within this page/component

    // Parallax calculation needs to be relative to the scroll within its container if needed,
    // or just use window scroll if the effect is global. Let's keep window scroll for simplicity.
    const { scrollYProgress } = useScroll(); // Use window scroll progress
    const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);


    // Set document title specifically for this page
    useEffect(() => {
        document.title = "Shiro Awards 2025 | Shiro Nexus";
    }, []);

    // Animation variants
    const sectionVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.15
            }
        },
    };

    const paragraphVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };


    return (
        // Removed main tag, using div as it's rendered inside MainLayout's main
        <div ref={pageRef} className="relative overflow-x-hidden"> {/* Added relative positioning */}
             {/* Decorative Background Elements with Parallax */}
             {/* These might be better placed in MainLayout if they should persist across pages */}
             {/* Or keep them here if they are specific to the awards page visual */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 opacity-20 animate-twinkle" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
                <motion.div
                    className="w-80 h-80 bg-pink-600/15 blur-3xl rounded-full absolute -top-20 -left-20"
                    style={{ y: parallaxY1 }}
                />
                <motion.div
                    className="w-96 h-96 bg-purple-600/15 blur-3xl rounded-full absolute -bottom-40 -right-20"
                    style={{ y: parallaxY2 }}
                />
            </div>

            {/* Header (Main Visual Section for Awards Page) */}
            <header className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-purple-950/80 via-purple-900/70 to-gray-950/60 shadow-xl">
                <div className="absolute -top-1/2 left-0 w-full h-[200%] bg-gradient-to-r from-transparent via-pink-400/15 to-transparent animate-[shine_12s_linear_infinite] opacity-60" style={{ transform: 'rotate(15deg)' }}></div>
                <motion.div
                    className="relative z-10 max-w-5xl mx-auto text-center"
                    initial="hidden"
                    animate="visible"
                    variants={{
                       hidden: { opacity: 0 },
                       visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } }
                    }}
                >
                    {/* Title and Icons */}
                    <motion.div
                       className="flex justify-center items-center gap-4 mb-4"
                       variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                    >
                         <motion.span
                            className="text-pink-300 text-4xl"
                            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            style={{ originX: 0.5, originY: 0.5 }}
                        >⭐</motion.span>
                        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-300 via-white to-pink-400 text-transparent bg-clip-text tracking-tight font-['Zen_Dots',_sans-serif] drop-shadow-lg animate-text-shimmer">
                            Shiro Awards 2025
                        </h1>
                        <motion.span
                            className="text-pink-300 text-4xl"
                            animate={{ y: [0, -12, 0], rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
                            style={{ originX: 0.5, originY: 0.5 }}
                        >🏆</motion.span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        className="text-xl md:text-2xl text-pink-100 italic mt-4 max-w-2xl mx-auto font-light"
                        variants={paragraphVariants}
                    >
                        Celebrando lo mejor del anime del año con estilo.
                    </motion.p>

                    {/* Decorative Line */}
                    <motion.div
                        className="mt-10 w-36 h-1.5 bg-gradient-to-r from-pink-500 via-white to-pink-500 mx-auto rounded-full animate-pulse"
                        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                </motion.div>
            </header>

            {/* Sticky Navigation (Internal Sections for Awards Page) */}
            <nav className="sticky top-0 z-40 bg-gray-950/70 backdrop-blur-xl py-3 shadow-lg border-b border-gray-500/20">
                 <ul className="flex justify-center flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-pink-100 px-4">
                    {sectionLinks.map(item => (
                        <motion.li key={item.href + "-sticky"} whileTap={{ scale: 0.95 }}>
                            <a href={item.href} className={`px-4 py-1.5 rounded-full ${item.hoverBg} hover:text-white transition-colors duration-200 block`}>
                                {item.label}
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            {/* Award Sections */}
            {/* Seasons Section */}
            <motion.section
                id="temporadas"
                className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-pink-500 inline-block pb-2 px-4">
                        Ganadores por Temporada
                    </h2>
                    <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                        Un repaso a lo mejor de cada estación del año.
                    </motion.p>
                </div>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                    {seasonWinnersData.map(winner => (<WinnerCard key={winner.id} winner={winner} />))}
                </motion.div>
            </motion.section>

            {/* Aspect Section */}
             <motion.section id="aspect" className="relative z-10 py-24 px-6 max-w-7xl mx-auto" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-yellow-400 inline-block pb-2 px-4">
                        Premios Técnicos y Visuales
                    </h2>
                    <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                        Reconociendo la excelencia en la producción.
                    </motion.p>
                </div>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                    {aspectWinnersData.map(winner => (<WinnerCard key={winner.id} winner={winner} />))}
                </motion.div>
            </motion.section>

            {/* Actors Section */}
             <motion.section id="actores" className="relative z-10 py-24 px-6 max-w-7xl mx-auto" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-indigo-400 inline-block pb-2 px-4">
                        Premios de Actuación de Voz
                    </h2>
                    <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                        Voces inolvidables que dieron vida a los personajes.
                    </motion.p>
                </div>
                 <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto" variants={sectionVariants}>
                    {actorWinnersData.map(winner => (<WinnerCard key={winner.id} winner={winner} />))}
                </motion.div>
            </motion.section>

            {/* Genres Section */}
            <motion.section id="generos" className="relative z-10 py-24 px-6 max-w-7xl mx-auto" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-red-400 inline-block pb-2 px-4">
                        Ganadores por Género
                    </h2>
                    <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                        Lo más destacado en cada categoría narrativa.
                    </motion.p>
                </div>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={sectionVariants}>
                    {genreWinnersData.map(winner => (<WinnerCard key={winner.id} winner={winner} />))}
                </motion.div>
            </motion.section>

            {/* Scroll to Top Button is now rendered globally by MainLayout or here if specific */}
             <ScrollToTopButton />
             {/* Global styles can be kept here or moved to index.css */}
             <style jsx global>{`
                /* Styles specific to this page or potentially global animations */
                 .font-['Zen_Dots',_sans-serif] { font-family: 'Zen Dots', sans-serif; }
                 .animate-text-shimmer { background-size: 200% auto; animation: shimmer 4s linear infinite; }
                 @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
                 @keyframes shine { 0% { transform: translateX(-100%) rotate(15deg); } 100% { transform: translateX(100%) rotate(15deg); } }
                 .animate-twinkle { animation: twinkle 5s linear infinite alternate; }
                 @keyframes twinkle { 0% { opacity: 0.1; } 50% { opacity: 0.3; } 100% { opacity: 0.1; } }
            `}</style>
        </div>
    );
}

export default PremiosPage;