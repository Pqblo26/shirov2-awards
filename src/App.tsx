import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// Assuming you might use an icon library later
// import { ArrowUp } from 'lucide-react';

// --- Data (Same as before) ---
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

// --- Color Mapping (Enhanced Hover Effects) ---
const colorStyles = {
    pink: { border: 'border-pink-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(236,72,153,0.5)]', ring: 'hover:ring-pink-400/60', text: 'text-pink-400', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-500', buttonBg: 'bg-pink-600', buttonHoverBg: 'hover:bg-pink-500' },
    yellow: { border: 'border-yellow-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(234,179,8,0.5)]', ring: 'hover:ring-yellow-400/60', text: 'text-yellow-400', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-500', buttonBg: 'bg-yellow-600', buttonHoverBg: 'hover:bg-yellow-500' },
    indigo: { border: 'border-indigo-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(99,102,241,0.5)]', ring: 'hover:ring-indigo-400/60', text: 'text-indigo-400', bg: 'bg-indigo-600', hoverBg: 'hover:bg-indigo-500', buttonBg: 'bg-indigo-600', buttonHoverBg: 'hover:bg-indigo-500' },
    red: { border: 'border-red-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(239,68,68,0.5)]', ring: 'hover:ring-red-400/60', text: 'text-red-400', bg: 'bg-red-600', hoverBg: 'hover:bg-red-500', buttonBg: 'bg-red-600', buttonHoverBg: 'hover:bg-red-500' },
    blue: { border: 'border-blue-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.5)]', ring: 'hover:ring-blue-400/60', text: 'text-blue-400', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', buttonBg: 'bg-blue-600', buttonHoverBg: 'hover:bg-blue-500' },
    orange: { border: 'border-orange-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(249,115,22,0.5)]', ring: 'hover:ring-orange-400/60', text: 'text-orange-400', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-500', buttonBg: 'bg-orange-600', buttonHoverBg: 'hover:bg-orange-500' },
    default: { border: 'border-gray-700', hoverShadow: 'hover:shadow-gray-500/30', ring: 'hover:ring-gray-500/40', text: 'text-gray-300', bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-500', buttonBg: 'bg-gray-600', buttonHoverBg: 'hover:bg-gray-500' }
};

// --- WinnerCard Component (Button position fixed) ---
const WinnerCard = ({ winner }) => {
    const styles = colorStyles[winner.color] || colorStyles.default;

    const handleInfoClick = () => {
        console.log(`Mostrar info de: ${winner.name}`);
        // Modal Logic Placeholder
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className={`relative group bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-xl border ${styles.border} transition-all duration-300 text-center hover:ring-2 ${styles.ring} ${styles.hoverShadow} hover:-translate-y-2 flex flex-col`}
            variants={cardVariants}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        >
            <div className="flex-grow">
                <h3 className={`text-xl font-bold mb-3 ${styles.text} drop-shadow-md`}>{winner.category}</h3>
                <div className="overflow-hidden rounded-lg mb-3 border border-gray-700">
                    <motion.img
                        src={winner.image}
                        alt={`Ganador: ${winner.name}`}
                        className="w-full h-60 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x600/7F1D1D/FECACA?text=Error+Imagen";
                            e.target.alt = "Error al cargar la imagen";
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-lg font-semibold text-white tracking-wide">{winner.name}</p>
                {winner.extra && <p className="text-sm text-gray-400 mt-1 italic">{winner.extra}</p>}
            </div>
            <motion.button
                onClick={handleInfoClick}
                className={`mt-4 ${styles.buttonBg} text-white text-xs px-4 py-1.5 rounded-full shadow ${styles.buttonHoverBg} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${styles.ring} self-center`}
                aria-label={`Ver más información sobre ${winner.name}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                Ver info
            </motion.button>
        </motion.div>
    );
};


// --- Main Component ---
export default function ShiroAwardsPageComponent() {
    const [showTopButton, setShowTopButton] = useState(false);
    const mainRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- Admin Panel State and Logic ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [keySequence, setKeySequence] = useState([]);
    const adminCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const handleKeyDown = (event) => {
            const newSequence = [...keySequence, event.key];
            setKeySequence(newSequence);

            if (newSequence.length >= adminCode.length) {
                const lastKeys = newSequence.slice(-adminCode.length);
                if (lastKeys.every((key, index) => key === adminCode[index])) {
                    console.log("Admin Mode Activated!");
                    setIsAdminMode(true);
                    setKeySequence([]);
                } else if (newSequence.length > adminCode.length * 2) {
                     setKeySequence(newSequence.slice(-adminCode.length));
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keySequence]);
    // --- End Admin Panel Logic ---


    const { scrollYProgress } = useScroll({ container: mainRef });
    const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    useEffect(() => {
        // Set document title for this specific awards page
        document.title = "Shiro Awards 2025";
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowTopButton(currentScrollY > 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    // --- Navigation Links ---
    // Header Links (External Pages) - For the top bar
    const baseHeaderLinks = [
        { href: "/", label: "Premios" }, // Link to this page
        { href: "/votaciones", label: "Votaciones" },
        { href: "/traducciones", label: "Traducciones" },
        { href: "/contacto", label: "Contacto" },
    ];

    const headerLinks = [
        ...baseHeaderLinks,
        ...(isAdminMode ? [{ href: "/admin", label: "Admin" }] : []),
        { href: "/login", label: "Login" },
    ];

    // Sticky Nav Links (Internal Page Sections) - For the sticky bar
    const sectionLinks = [
        { href: "#temporadas", label: "Temporadas", hoverBg: "hover:bg-pink-600/80" },
        { href: "#aspect", label: "Aspectos Técnicos", hoverBg: "hover:bg-yellow-600/80" },
        { href: "#actores", label: "Actores de Voz", hoverBg: "hover:bg-indigo-600/80" },
        { href: "#generos", label: "Géneros", hoverBg: "hover:bg-red-600/80" },
    ];

    return (
        <main ref={mainRef} className="bg-gradient-to-b from-gray-950 to-black text-white font-sans scroll-smooth relative overflow-x-hidden">

            {/* Decorative Background Elements with Parallax */}
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

            {/* ===== Top Navigation Bar (Logo Placeholder, Left Aligned) ===== */}
            <nav className="relative z-50 bg-gray-950/90 backdrop-blur-md shadow-md border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* justify-between pushes left and right groups apart */}
                    <div className="flex items-center justify-between h-14">
                        {/* Left Side Group: Logo Placeholder + Title */}
                        {/* This 'a' tag now acts as the container for the left group */}
                        <a href="/" className="flex items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
                             {/* Logo Placeholder Image */}
                             <img
                                className="block h-8 w-auto mr-3" // Ensure image doesn't shrink, added margin
                                src="https://placehold.co/100x32/1F2937/4B5563?text=Logo"
                                alt="Logo Placeholder"
                                onError={(e) => { e.target.style.display='none'; }}
                             />
                             {/* Site Title (Shiro Nexus) */}
                             <span className="text-white font-bold text-lg hover:text-pink-300 transition-colors">
                                Shiro Nexus
                             </span>
                        </a>

                        {/* Right Side: Navigation Links */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {/* Using updated headerLinks */}
                                {headerLinks.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className={`text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            (item.label === 'Login') ? 'bg-pink-600/80 hover:bg-pink-500/80' : ''
                                        } ${
                                            (item.label === 'Admin') ? 'bg-red-600/80 hover:bg-red-500/80 text-yellow-200' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Abrir menú principal</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden"
                            id="mobile-menu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ overflow: 'hidden' }}
                        >
                             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {headerLinks.map((item) => (
                                     <a
                                        key={item.label + "-mobile"}
                                        href={item.href}
                                        className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                            (item.label === 'Login') ? 'bg-pink-600/80 hover:bg-pink-500/80' : ''
                                        } ${
                                            (item.label === 'Admin') ? 'bg-red-600/80 hover:bg-red-500/80 text-yellow-200' : ''
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            {/* ===== END of Top Navigation Bar ===== */}


            {/* Header (Main Visual Section - Title reverted) */}
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
                        {/* H1 Title - Back to Shiro Awards 2025 */}
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

            {/* Sticky Navigation (Internal Sections) */}
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

            {/* Award Sections (Content remains the same) */}
            {/* ... (Sections code omitted for brevity) ... */}
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
                    <motion.p
                        className="text-lg text-gray-300 italic max-w-2xl mx-auto"
                        variants={paragraphVariants}
                    >
                        Un repaso a lo mejor de cada estación del año.
                    </motion.p>
                </div>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={sectionVariants}
                >
                    {seasonWinnersData.map(winner => (
                        <WinnerCard key={winner.id} winner={winner} />
                    ))}
                </motion.div>
            </motion.section>

            {/* Aspect Section */}
             <motion.section
                id="aspect"
                className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-yellow-400 inline-block pb-2 px-4">
                        Premios Técnicos y Visuales
                    </h2>
                    <motion.p
                        className="text-lg text-gray-300 italic max-w-2xl mx-auto"
                         variants={paragraphVariants}
                     >
                        Reconociendo la excelencia en la producción.
                    </motion.p>
                </div>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={sectionVariants}
                >
                    {aspectWinnersData.map(winner => (
                        <WinnerCard key={winner.id} winner={winner} />
                    ))}
                </motion.div>
            </motion.section>

            {/* Actors Section */}
             <motion.section
                id="actores"
                className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-indigo-400 inline-block pb-2 px-4">
                        Premios de Actuación de Voz
                    </h2>
                     <motion.p
                        className="text-lg text-gray-300 italic max-w-2xl mx-auto"
                         variants={paragraphVariants}
                     >
                        Voces inolvidables que dieron vida a los personajes.
                    </motion.p>
                </div>
                 <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
                    variants={sectionVariants}
                 >
                    {actorWinnersData.map(winner => (
                        <WinnerCard key={winner.id} winner={winner} />
                    ))}
                </motion.div>
            </motion.section>

            {/* Genres Section */}
            <motion.section
                id="generos"
                className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-red-400 inline-block pb-2 px-4">
                        Ganadores por Género
                    </h2>
                    <motion.p
                        className="text-lg text-gray-300 italic max-w-2xl mx-auto"
                        variants={paragraphVariants}
                    >
                        Lo más destacado en cada categoría narrativa.
                    </motion.p>
                </div>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    variants={sectionVariants}
                 >
                    {genreWinnersData.map(winner => (
                        <WinnerCard key={winner.id} winner={winner} />
                    ))}
                </motion.div>
            </motion.section>


            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showTopButton && (
                    <motion.button
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-300 z-50"
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Volver arriba"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-700/50 mt-16 relative z-10">
                 {/* Updated Footer Name back to Awards */}
                &copy; {new Date().getFullYear()} Shiro Awards by Jesús · Todos los derechos reservados
                <p className="mt-2 text-xs">Shiro Nexus: Plataforma de anime, premios, votaciones, traducciones y más.</p> {/* Kept Nexus mention here */}
            </footer>

            {/* Global Styles & Custom Animations */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=Zen+Dots&display=swap');

                body {
                  font-family: 'Inter', sans-serif;
                }

                 .font-['Zen_Dots',_sans-serif] {
                    font-family: 'Zen Dots', sans-serif;
                }

                .animate-text-shimmer {
                  background-size: 200% auto;
                  animation: shimmer 4s linear infinite;
                }
                @keyframes shimmer {
                  0% { background-position: 200% center; }
                  100% { background-position: -200% center; }
                }

                @keyframes shine {
                  0% { transform: translateX(-100%) rotate(15deg); }
                  100% { transform: translateX(100%) rotate(15deg); }
                }

                .animate-twinkle {
                  animation: twinkle 5s linear infinite alternate;
                }
                @keyframes twinkle {
                  0% { opacity: 0.1; }
                  50% { opacity: 0.3; }
                  100% { opacity: 0.1; }
                }

                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </main>
    );
}