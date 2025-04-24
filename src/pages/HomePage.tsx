import React, { useEffect, useState, useMemo, useRef } from 'react'; // useRef añadido por si se usa en código omitido
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WinnerCard from '../components/WinnerCard'; // Import WinnerCard
import TranslationPreviewCard from '../components/TranslationPreviewCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import matter from 'gray-matter';
// --- AÑADIDO: Importar icono para Ranking ---
import { ListOrdered, CheckSquare, Trophy, BookOpen } from 'lucide-react'; // Añadir iconos usados en FeatureCard
// --- FIN AÑADIDO ---


// --- Helper function to get display value (for translations) ---
const getDisplayValue = (selectValue?: string, otherValue?: string): string | undefined => {
    if (selectValue === "Otro") return otherValue || undefined;
    return selectValue;
};

// --- Define structure for TranslationPreviewCard data ---
interface TranslationPreviewData {
    id: string; title: string; excerpt?: string; link: string;
    imageUrl?: string; tag?: string; date: string; source?: string;
}

// --- Define structure expected by WinnerCard ---
interface Winner {
    id: string | number;
    category: string;
    image: string;
    name: string;
    extra?: string;
    color: string;
    info_url?: string;
}

// --- Define structure for AwardData loaded from CMS ---
interface AwardData {
    id: string;
    award_type?: string;
    resolved_category?: string;
    winner_name?: string;
    winner_image?: string;
    winner_extra?: string;
    display_color?: string;
    order?: number;
    info_url?: string;
    category_temporada?: string;
    category_aspecto?: string;
    category_actor?: string;
    category_genero?: string;
    category_anual?: string;
}

// --- Reusable Card Component for Featured Sections ---
// (Asegurarse que la definición está completa y correcta)
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    // --- MODIFICADO: Añadir purple como opción ---
    color: 'pink' | 'blue' | 'green' | 'purple';
    // --- FIN MODIFICACIÓN ---
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link, color }) => {
    const colorClasses = {
        pink: { hoverShadow: 'hover:shadow-pink-500/30', hoverBorder: 'hover:border-pink-500/50', iconText: 'text-pink-400' },
        blue: { hoverShadow: 'hover:shadow-blue-500/30', hoverBorder: 'hover:border-blue-500/50', iconText: 'text-blue-400' },
        green: { hoverShadow: 'hover:shadow-green-500/30', hoverBorder: 'hover:border-green-500/50', iconText: 'text-green-400' },
        // --- AÑADIDO: Estilo Purple ---
        purple: { hoverShadow: 'hover:shadow-purple-500/30', hoverBorder: 'hover:border-purple-500/50', iconText: 'text-purple-400' },
        // --- FIN AÑADIDO ---
    };
    const styles = colorClasses[color];
    return (
        <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 shadow-lg border border-gray-700/50 transition-all duration-300 ${styles.hoverBorder} ${styles.hoverShadow} hover:scale-[1.03]`} >
            <Link to={link} className="flex flex-col items-center text-center h-full">
                <div className={`mb-4 p-3 rounded-full bg-gray-900/50 border border-gray-600/50 ${styles.iconText} transition-colors duration-300 group-hover:bg-gray-800`}>
                    {icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 text-white transition-colors duration-300 group-hover:${styles.iconText}`}>
                    {title}
                </h3>
                <p className="text-gray-400 text-sm flex-grow">
                    {description}
                </p>
                <span className="mt-4 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors duration-300 flex items-center">
                    Explorar <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">&rarr;</span>
                </span>
            </Link>
        </div>
    );
};


// --- Main HomePage Component ---
function HomePage() {
    // State for recent translations
    const [recentTranslations, setRecentTranslations] = useState<TranslationPreviewData[]>([]);
    const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);
    const [errorTranslations, setErrorTranslations] = useState<string | null>(null);
    const numberOfTranslationPreviews = 3;

    // State for featured winners
    const [featuredWinners, setFeaturedWinners] = useState<Winner[]>([]);
    const [isLoadingWinners, setIsLoadingWinners] = useState(true);
    const [errorWinners, setErrorWinners] = useState<string | null>(null);
    const numberOfWinnerPreviews = 2; // Show 2 featured winners

    // Effect for Document Title
    useEffect(() => {
        document.title = "Inicio | Shiro Nexus";
    }, []);

    // Effect for Loading Recent Translations
    useEffect(() => {
        const loadRecentTranslations = async () => {
             setIsLoadingTranslations(true); setErrorTranslations(null);
             console.log("HomePage: Attempting to load recent translations...");
             try {
                 const modules = import.meta.glob('/content/traducciones/**/*.md', { eager: true, query: '?raw', import: 'default' });
                 console.log("HomePage: Translation Files found:", modules);
                 const loadedTranslationsData: { id: string; frontmatter: any }[] = [];
                 if (Object.keys(modules).length === 0) console.warn("HomePage: No translation files found.");

                 for (const path in modules) {
                     const rawContent = modules[path]; if (typeof rawContent !== 'string') { console.warn(`HomePage: Content is not a string for: ${path}`); continue; }
                     try {
                         const { data: frontmatter } = matter(rawContent);
                         const slugMatch = path.match(/([^/]+)\.md$/); const filename = slugMatch ? slugMatch[1] : path;
                         loadedTranslationsData.push({ id: filename, frontmatter });
                     } catch (parseError) { console.error(`HomePage: Error parsing translation frontmatter for file: ${path}`, parseError); }
                 }
                 // Sort by date before slicing
                 loadedTranslationsData.sort((a, b) => {
                     const timeA = a.frontmatter?.date ? new Date(a.frontmatter.date).getTime() : 0;
                     const timeB = b.frontmatter?.date ? new Date(b.frontmatter.date).getTime() : 0;
                     return timeB - timeA; // Sort descending
                 });
                 // Process the top N items for preview
                 const processedTranslations = loadedTranslationsData.slice(0, numberOfTranslationPreviews).map(item => {
                     const { id, frontmatter } = item;
                     const displaySource = getDisplayValue(frontmatter.source_select, frontmatter.source_other);
                     let formattedDate = "Fecha no disponible";
                     if (frontmatter.date) { try { formattedDate = new Date(frontmatter.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (dateError) { console.error(`HomePage: Error formatting date for ${id}:`, dateError); } }
                     return {
                         id: id,
                         title: frontmatter.title ?? `Sin Título (${id})`,
                         date: formattedDate,
                         imageUrl: frontmatter.imageUrl,
                         tag: frontmatter.mainCategory ?? frontmatter.status ?? 'General',
                         source: displaySource,
                         excerpt: frontmatter.excerpt,
                         link: `/traducciones/${id}`,
                     };
                 });
                 console.log("HomePage: Processed recent translations:", processedTranslations);
                 setRecentTranslations(processedTranslations);
             } catch (err) { console.error("HomePage: Error loading translation files:", err); setErrorTranslations("Error al cargar traducciones.");
             } finally { setIsLoadingTranslations(false); console.log("HomePage: Finished loading translations."); }
        };
        loadRecentTranslations();
    }, []);

    // Effect for Loading Featured Winners
    useEffect(() => {
        const loadFeaturedWinners = async () => {
             setIsLoadingWinners(true); setErrorWinners(null);
             console.log("HomePage: Attempting to load awards...");
             try {
                 const modules = import.meta.glob('/content/premios/*.md', { eager: true, query: '?raw', import: 'default' });
                 console.log("HomePage: Award Files found:", modules);
                 const loadedWinnersData: AwardData[] = [];
                  if (Object.keys(modules).length === 0) console.warn("HomePage: No award files found.");

                 for (const path in modules) {
                     const rawContent = modules[path]; if (typeof rawContent !== 'string') { console.warn(`HomePage: Award content is not a string for: ${path}`); continue; }
                     try {
                         const { data: frontmatter } = matter(rawContent);
                         const slugMatch = path.match(/([^/]+)\.md$/); const filename = slugMatch ? slugMatch[1] : path;
                         // Resolve category
                         let resolvedCategory = 'Categoría Desconocida';
                         switch (frontmatter.award_type) {
                             case 'Temporada': resolvedCategory = frontmatter.category_temporada || resolvedCategory; break;
                             case 'Aspecto Técnico': resolvedCategory = frontmatter.category_aspecto || resolvedCategory; break;
                             case 'Actor de Voz': resolvedCategory = frontmatter.category_actor || resolvedCategory; break;
                             case 'Género': resolvedCategory = frontmatter.category_genero || resolvedCategory; break;
                             case 'Ganadores del Año': resolvedCategory = frontmatter.category_anual || resolvedCategory; break;
                         }
                         // Add to temporary list matching AwardData structure
                         loadedWinnersData.push({
                             id: filename,
                             resolved_category: resolvedCategory,
                             winner_name: frontmatter.winner_name,
                             winner_image: frontmatter.winner_image,
                             winner_extra: frontmatter.winner_extra,
                             display_color: frontmatter.display_color,
                             info_url: frontmatter.info_url,
                             award_type: frontmatter.award_type,
                             order: frontmatter.order,
                         });
                     } catch (parseError) { console.error(`HomePage: Error parsing award frontmatter for file: ${path}`, parseError); }
                 }

                 // Select featured winners (e.g., first N found, could sort by 'order' later)
                 const featured = loadedWinnersData.slice(0, numberOfWinnerPreviews).map(award => ({
                     // Map AwardData to Winner interface for WinnerCard
                     id: award.id,
                     category: award.resolved_category || 'Categoría Desconocida',
                     image: award.winner_image || 'https://placehold.co/400x600/7F1D1D/FECACA?text=No+Imagen',
                     name: award.winner_name || 'Ganador Desconocido',
                     extra: award.winner_extra,
                     color: award.display_color || 'default',
                     info_url: award.info_url,
                 }));

                 console.log("HomePage: Featured winners selected:", featured);
                 setFeaturedWinners(featured);

             } catch (err) { console.error("HomePage: Error loading award files:", err); setErrorWinners("Error al cargar premios destacados.");
             } finally { setIsLoadingWinners(false); console.log("HomePage: Finished loading awards."); }
        };
        loadFeaturedWinners();
    }, []);


    // --- Animation Variants ---
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- Loading/Error Indicators ---
    const LoadingSpinner = ({ text = "Cargando..." }: { text?: string }) => (
        <div className="flex justify-center items-center py-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-4 border-t-gray-500 border-r-gray-500/30 border-b-gray-500/30 border-l-gray-500/30 rounded-full"></motion.div>
            <p className="ml-3 text-gray-400">{text}</p>
        </div>
    );
    const ErrorDisplay = ({ message }: { message: string | null }) => (
         <div className="text-center text-red-400 py-10 px-6 bg-red-900/20 rounded-lg border border-dashed border-red-700/50"> <p>{message || "Ocurrió un error."}</p> </div>
    );
    const NoDataMessage = ({ message }: { message: string }) => (
        <div className="text-center text-gray-500 py-10 px-6 bg-gray-800/30 rounded-lg border border-dashed border-gray-700"> <p>{message}</p> </div>
    );


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} >
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
                {/* --- Grid con 4 columnas --- */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {/* --- FIN MODIFICACIÓN --- */}
                     <motion.div variants={itemVariants}>
                         <FeatureCard
                             icon={<Trophy size={32} />} // Icono Premios
                             title="Premios"
                             description="Descubre los ganadores anuales y lo más destacado de la temporada."
                             link="/premios"
                             color="pink" />
                      </motion.div>
                     <motion.div variants={itemVariants}>
                         <FeatureCard
                             icon={<CheckSquare size={32} />} // Icono Votaciones
                             title="Votaciones"
                             description="¡Tu opinión cuenta! Participa en nuestras encuestas y votaciones activas."
                             link="/votaciones"
                             color="blue" />
                     </motion.div>
                     {/* --- FeatureCard para Ranking Semanal --- */}
                     <motion.div variants={itemVariants}>
                        <FeatureCard
                            icon={<ListOrdered size={32} />} // Icono de lista ordenada
                            title="Ranking Semanal"
                            description="Crea y comparte tu Top 10 personal de los animes de la temporada."
                            link="/ranking-semanal" // Enlace a la nueva página
                            color="purple" // Nuevo color
                        />
                     </motion.div>
                     {/* --- FIN FeatureCard Ranking --- */}
                     <motion.div variants={itemVariants}>
                         <FeatureCard
                             icon={<BookOpen size={32} />} // Icono Traducciones
                             title="Traducciones"
                             description="Explora contenido exclusivo, entrevistas y noticias traducidas por nuestro equipo."
                             link="/traducciones"
                             color="green" />
                     </motion.div>
                 </div>
            </motion.section>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-800/50 to-transparent my-10"></div>

             {/* === Latest Translations Preview Section === */}
             <motion.section className="py-16 md:py-20 px-6 bg-transparent" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} >
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"> <span className="text-green-400">Traducciones</span> Recientes </h2>
                 <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-6">
                     {isLoadingTranslations ? ( <LoadingSpinner text="Cargando traducciones..." /> )
                      : errorTranslations ? ( <ErrorDisplay message={errorTranslations} /> )
                      : recentTranslations.length > 0 ? (
                          recentTranslations.map(item => ( <motion.div key={item.id} variants={itemVariants}> <TranslationPreviewCard item={item} /> </motion.div> ))
                      ) : ( <NoDataMessage message="No hay traducciones recientes para mostrar." /> )}
                 </div>
                 {!isLoadingTranslations && !errorTranslations && ( <div className="text-center mt-12"> <Link to="/traducciones" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-colors" > Ver Todas las Traducciones </Link> </div> )}
             </motion.section>
             <div className="h-px bg-gradient-to-r from-transparent via-yellow-800/50 to-transparent my-10"></div>

             {/* === Latest Winners Preview Section === */}
             <motion.section className="py-16 md:py-20 px-6 bg-transparent" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} >
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white"> <span className="text-yellow-400">Ganadores</span> Destacados (Awards 2025) </h2>
                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                      {isLoadingWinners ? (
                          <div className="md:col-span-2"> <LoadingSpinner text="Cargando ganadores..." /> </div>
                      ) : errorWinners ? (
                           <div className="md:col-span-2"> <ErrorDisplay message={errorWinners} /> </div>
                      ) : featuredWinners.length > 0 ? (
                           featuredWinners.map(winner => ( <motion.div key={winner.id} variants={itemVariants}> <WinnerCard winner={winner} /> </motion.div> ))
                      ) : (
                           <div className="md:col-span-2"> <NoDataMessage message="¡Los ganadores de Shiro Awards 2025 se anunciarán próximamente!" /> </div>
                      )}
                  </div>
                   {!isLoadingWinners && !errorWinners && (
                       <div className="text-center mt-12">
                           <Link to="/premios" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-colors" > Ver Todos los Premios </Link>
                       </div>
                   )}
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

             <ScrollToTopButton />
        </motion.div>
    );
}

export default HomePage;
