import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import { motion } from 'framer-motion'; // Import motion for animations
import WinnerCard from '../components/WinnerCard'; // Import WinnerCard for previews
// Import the extracted TranslationPreviewCard component
import TranslationPreviewCard from '../components/TranslationPreviewCard';

// --- Sample Data ---
const previewWinners = [
     { id: "preview-1", category: "Mejor Animación", image: "https://placehold.co/400x600/374151/D1D5DB?text=Animación+Ejemplo", name: "Anime Ejemplo A", extra: "Estudio X", color: "yellow" },
     { id: "preview-2", category: "Mejor Drama", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Drama+Ejemplo", name: "Anime Ejemplo B", extra: "Estudio Y", color: "red" },
];

const previewTranslations = [
    { id: "t-prev-1", title: "Avance Capítulo 10 - Manga XYZ", excerpt: "Una breve descripción o extracto...", link: "/traducciones/manga-xyz-10", imageUrl: "https://placehold.co/150x100/111827/4ADE80?text=Manga+XYZ", tag: "Manga", date: "5 abril, 2025", source: "Fuente Manga XYZ" },
    { id: "t-prev-2", title: "Entrevista Exclusiva - Autor ABC", excerpt: "Los puntos clave de la entrevista...", link: "/traducciones/entrevista-abc", imageUrl: "https://placehold.co/150x100/111827/4ADE80?text=Entrevista", tag: "Entrevista", date: "3 abril, 2025", source: "Revista Anime Z" },
    { id: "t-prev-3", title: "Noticia Importante - Evento Anime", excerpt: "Resumen de la noticia traducida...", link: "/traducciones/noticia-evento", imageUrl: "https://placehold.co/150x100/111827/4ADE80?text=Noticia", tag: "Noticia", date: "1 abril, 2025", source: "Web Oficial Evento" },
];

// --- Reusable Card Component for Featured Sections ---
// FeatureCard definition remains here for now (could be extracted too)
interface FeatureCardProps { icon: React.ReactNode; title: string; description: string; link: string; color: 'pink' | 'blue' | 'green'; }
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link, color }) => {
    const colorClasses = {
        pink: { hoverShadow: 'hover:shadow-pink-500/30', hoverBorder: 'hover:border-pink-500/50', iconText: 'text-pink-400' },
        blue: { hoverShadow: 'hover:shadow-blue-500/30', hoverBorder: 'hover:border-blue-500/50', iconText: 'text-blue-400' },
        green: { hoverShadow: 'hover:shadow-green-500/30', hoverBorder: 'hover:border-green-500/50', iconText: 'text-green-400' },
    };
    const styles = colorClasses[color];
    return ( <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 shadow-lg border border-gray-700/50 transition-all duration-300 ${styles.hoverBorder} ${styles.hoverShadow} hover:scale-[1.03]`} >
            <Link to={link} className="flex flex-col items-center text-center h-full">
                <div className={`mb-4 p-3 rounded-full bg-gray-900/50 border border-gray-600/50 ${styles.iconText} transition-colors duration-300 group-hover:bg-gray-800`}> {icon} </div>
                <h3 className={`text-xl font-semibold mb-2 text-white transition-colors duration-300 group-hover:${styles.iconText}`}> {title} </h3>
                <p className="text-gray-400 text-sm flex-grow"> {description} </p>
                <span className="mt-4 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors duration-300 flex items-center"> Explorar <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">&rarr;</span> </span>
            </Link>
        </div> );
};

// --- Main HomePage Component ---
function HomePage() {
    useEffect(() => { document.title = "Inicio | Shiro Nexus"; }, []);
    const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } };

    return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} >
            {/* === Hero Section === */}
            <section className="relative text-white pt-28 pb-20 md:pt-40 md:pb-28 px-6 text-center overflow-hidden isolate">
                 <motion.div className="absolute inset-0 z-[-2] overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-black"></div>
                    <motion.div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-radial from-pink-500/20 via-transparent to-transparent rounded-full filter blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: ['-10%', '0%', '-10%'], y: ['-20%', '-10%', '-20%'] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
                     <motion.div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-radial from-blue-600/20 via-transparent to-transparent rounded-full filter blur-3xl" animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2], x: ['-10%', '-20%', '-10%'], y: ['-20%', '-30%', '-20%'] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
                 </motion.div>
                 <motion.div className="absolute inset-0 z-[-1] flex justify-center items-end pointer-events-none" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} >
                     <img src="https://placehold.co/400x600/ffffff/cccccc?text=Personaje+(PNG)" alt="Personaje Principal" className="max-h-[80vh] md:max-h-[70vh] w-auto object-contain opacity-15 lg:opacity-20" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                 </motion.div>
                <motion.div className="relative z-10" variants={sectionVariants} initial="hidden" animate="visible" >
                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-pink-300 drop-shadow-lg" > Bienvenido a Shiro Nexus </motion.h1>
                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed" > Tu portal central para explorar premios de anime, participar en votaciones, acceder a traducciones exclusivas y mucho más. </motion.p>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
                        <Link to="/premios" className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900" > Explorar Shiro Awards 2025 </Link>
                    </motion.div>
                </motion.div>
            </section>
             <div className="h-1 bg-gradient-to-r from-transparent via-pink-800/50 to-transparent"></div>
            {/* === Featured Sections Grid === */}
            <motion.section className="py-16 md:py-24 px-6 bg-gray-950" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white">Explora Nuestras Secciones</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                     <motion.div variants={itemVariants}> <FeatureCard icon={ <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> </svg> } title="Premios" description="Descubre los ganadores anuales y lo más destacado de la temporada." link="/premios" color="pink" /> </motion.div>
                      <motion.div variants={itemVariants}> <FeatureCard icon={ <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> } title="Votaciones" description="¡Tu opinión cuenta! Participa en nuestras encuestas y votaciones activas." link="/votaciones" color="blue" /> </motion.div>
                      <motion.div variants={itemVariants}> <FeatureCard icon={ <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> </svg> } title="Traducciones" description="Explora contenido exclusivo, entrevistas y noticias traducidas por nuestro equipo." link="/traducciones" color="green" /> </motion.div>
                </div>
            </motion.section>
             <div className="h-px bg-gradient-to-r from-transparent via-blue-800/50 to-transparent my-10"></div>
            {/* === Latest Translations Preview Section === */}
            <motion.section className="py-16 md:py-20 px-6 bg-transparent" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"> <span className="text-green-400">Traducciones</span> Recientes </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-6">
                     {previewTranslations.map(item => ( <motion.div key={item.id} variants={itemVariants}> <TranslationPreviewCard item={item} /> </motion.div> ))}
                </div>
                 <div className="text-center mt-12"> <Link to="/traducciones" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-colors" > Ver Todas las Traducciones </Link> </div>
            </motion.section>
             <div className="h-px bg-gradient-to-r from-transparent via-yellow-800/50 to-transparent my-10"></div>
            {/* === Latest Winners Preview Section === */}
            <motion.section className="py-16 md:py-20 px-6 bg-transparent" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"> <span className="text-yellow-400">Ganadores</span> Destacados (Awards 2025) </h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                     {previewWinners.map(winner => ( <motion.div key={winner.id} variants={itemVariants}> <WinnerCard winner={winner} /> </motion.div> ))}
                </div>
                 <div className="text-center mt-12"> <Link to="/premios" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-colors" > Ver Todos los Premios </Link> </div>
            </motion.section>
             {/* === Call to Action Section === */}
             <motion.section className="py-16 md:py-24 px-6 my-16 md:my-24 relative overflow-hidden rounded-xl max-w-7xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} >
                 <div className="absolute inset-0 z-0 opacity-10"> <img src="https://placehold.co/1920x600/0A0A0A/222222?text=+" alt="Abstract background pattern" className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div> </div>
                 <motion.div variants={itemVariants} className="relative z-10 max-w-3xl mx-auto text-center">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¡Participa en la Comunidad!</h2>
                     <p className="text-gray-300 mb-8"> Tu voz es importante. Vota por tus favoritos de la temporada, comenta en las traducciones y únete a la conversación. </p>
                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                         <Link to="/votaciones" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" > Ir a Votaciones </Link>
                     </motion.div>
                 </motion.div>
             </motion.section>
        </motion.div>
    );
}

// FeatureCard definition needs to be here or imported if moved
// const FeatureCard: React.FC<FeatureCardProps> = ({...}) => { ... };

export default HomePage;
