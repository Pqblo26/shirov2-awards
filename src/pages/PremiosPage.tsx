import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WinnerCard from '../components/WinnerCard'; // Import reusable component
import ScrollToTopButton from '../components/ScrollToTopButton'; // Import scroll button
import matter from 'gray-matter'; // Import gray-matter

// --- Interface for data loaded from CMS ---
interface AwardData {
    id: string; // Filename as ID
    award_type?: string; // Temporada, Aspecto Técnico, etc.
    resolved_category?: string; // The actual category name determined from conditional fields
    winner_name?: string;
    winner_image?: string;
    winner_extra?: string;
    display_color?: string; // blue, pink, yellow, etc.
    order?: number;
    info_url?: string; // Campo para el enlace externo
}

// --- Interface expected by WinnerCard ---
interface Winner {
    id: string | number;
    category: string;
    image: string;
    name: string;
    extra?: string;
    color: string;
    info_url?: string; // Campo para el enlace externo
}

// Sticky Nav Links - Added "Premios Anuales"
const sectionLinks = [
    { href: "#anual", label: "Premios Principales", hoverBg: "hover:bg-amber-500/80" }, // Added link for annual awards
    { href: "#temporadas", label: "Temporadas", hoverBg: "hover:bg-pink-600/80" },
    { href: "#aspect", label: "Aspectos Técnicos", hoverBg: "hover:bg-yellow-600/80" },
    { href: "#actores", label: "Actores de Voz", hoverBg: "hover:bg-indigo-600/80" },
    { href: "#generos", label: "Géneros", hoverBg: "hover:bg-red-600/80" },
];


function PremiosPage() {
    const pageRef = useRef(null);

    // --- State for Awards Data ---
    const [allAwards, setAllAwards] = useState<AwardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Parallax ---
    const { scrollYProgress } = useScroll();
    const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    // --- Set document title ---
    useEffect(() => {
        document.title = "Shiro Awards 2025 | Shiro Nexus";
    }, []);

    // --- Load Awards Data from CMS ---
    useEffect(() => {
        const loadAwards = async () => {
            setIsLoading(true);
            setError(null);
            console.log("PremiosPage: Attempting to load awards...");

            try {
                const modules = import.meta.glob('/content/premios/*.md', {
                    eager: true,
                    query: '?raw',
                    import: 'default'
                });
                console.log("PremiosPage: Files found:", modules);

                const loadedAwards: AwardData[] = [];
                if (Object.keys(modules).length === 0) {
                    console.warn("PremiosPage: No award files found.");
                }

                for (const path in modules) {
                    const rawContent = modules[path];
                    if (typeof rawContent !== 'string') {
                        console.warn(`PremiosPage: Content is not a string for: ${path}`);
                        continue;
                    }
                    try {
                        const { data: frontmatter } = matter(rawContent);
                        const slugMatch = path.match(/([^/]+)\.md$/);
                        const filename = slugMatch ? slugMatch[1] : path;

                        // Determine the correct category based on award_type
                        let resolvedCategory = 'Categoría Desconocida';
                        switch (frontmatter.award_type) {
                            case 'Temporada':
                                resolvedCategory = frontmatter.category_temporada || resolvedCategory;
                                break;
                            case 'Aspecto Técnico':
                                resolvedCategory = frontmatter.category_aspecto || resolvedCategory;
                                break;
                            case 'Actor de Voz':
                                resolvedCategory = frontmatter.category_actor || resolvedCategory;
                                break;
                            case 'Género':
                                resolvedCategory = frontmatter.category_genero || resolvedCategory;
                                break;
                            case 'Ganadores del Año': // Handle new type
                                resolvedCategory = frontmatter.category_anual || resolvedCategory;
                                break;
                        }

                        const awardItem: AwardData = {
                            id: filename,
                            award_type: frontmatter.award_type,
                            resolved_category: resolvedCategory,
                            winner_name: frontmatter.winner_name,
                            winner_image: frontmatter.winner_image,
                            winner_extra: frontmatter.winner_extra,
                            display_color: frontmatter.display_color,
                            order: frontmatter.order,
                            info_url: frontmatter.info_url, // Read info_url
                        };
                        loadedAwards.push(awardItem);
                    } catch (parseError) {
                        console.error(`PremiosPage: Error parsing frontmatter for file: ${path}`, parseError);
                    }
                }

                console.log("PremiosPage: Loaded awards:", loadedAwards);
                setAllAwards(loadedAwards);

            } catch (err) {
                console.error("PremiosPage: Error loading award files:", err);
                setError("Error al cargar los premios.");
            } finally {
                setIsLoading(false);
                console.log("PremiosPage: Finished loading awards.");
            }
        };

        loadAwards();
    }, []);


    // --- Group and Sort Awards ---
    const { yearAwards, seasonAwards, aspectAwards, actorAwards, genreAwards } = useMemo(() => {
        const sorter = (a: AwardData, b: AwardData): number => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return a.resolved_category?.localeCompare(b.resolved_category ?? '') ?? 0;
        };

        return {
            yearAwards: allAwards.filter(a => a.award_type === 'Ganadores del Año').sort(sorter), // Added filter
            seasonAwards: allAwards.filter(a => a.award_type === 'Temporada').sort(sorter),
            aspectAwards: allAwards.filter(a => a.award_type === 'Aspecto Técnico').sort(sorter),
            actorAwards: allAwards.filter(a => a.award_type === 'Actor de Voz').sort(sorter),
            genreAwards: allAwards.filter(a => a.award_type === 'Género').sort(sorter),
        };
    }, [allAwards]);


    // --- Animation variants (defined inside) ---
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


    // --- Helper to map AwardData to Winner props (defined inside) ---
    const mapAwardToWinner = (award: AwardData): Winner => ({
        id: award.id,
        category: award.resolved_category || 'Categoría Desconocida',
        image: award.winner_image || 'https://placehold.co/400x600/7F1D1D/FECACA?text=No+Imagen',
        name: award.winner_name || 'Ganador Desconocido',
        extra: award.winner_extra,
        color: award.display_color || 'default',
        info_url: award.info_url, // Pass info_url
    });

    // --- Loading and Error Display (defined inside) ---
    const LoadingIndicator = () => (
        <div className="text-center py-20 text-gray-400">Cargando premios...</div>
    );
    const ErrorIndicator = ({ message }: { message: string | null }) => ( // Allow null message
        <div className="text-center py-20 text-red-400">{message || "Error al cargar los premios."}</div>
    );

    return (
        // Removed overflow-x-hidden from here previously
        <div ref={pageRef} className="relative">
             {/* Decorative Background Elements */}
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

            {/* Header */}
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

            {/* Sticky Navigation */}
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

            {/* --- Award Sections --- */}
            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <ErrorIndicator message={error} />
            ) : (
                <>
                     {/* --- Annual Awards Section --- */}
                     <motion.section
                        id="anual" // ID for the new section
                        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-amber-400 inline-block pb-2 px-4"> {/* Using amber for gold */}
                                Premios Principales del Año
                            </h2>
                            <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                                Los grandes galardones de Shiro Awards 2025.
                            </motion.p>
                        </div>
                        {yearAwards.length > 0 ? (
                            // Adjust grid columns as needed for this section
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={sectionVariants}>
                                {yearAwards.map(award => (
                                    <WinnerCard key={award.id} winner={mapAwardToWinner(award)} />
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-center text-gray-500 italic">No hay premios anuales definidos.</p>
                        )}
                    </motion.section>
                    {/* --- END: Annual Awards Section --- */}

                    {/* Seasons Section */}
                    <motion.section
                        id="temporadas"
                        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="text-center mb-16">
                             <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-pink-500 inline-block pb-2 px-4">
                                 Ganadores por Temporada
                             </h2>
                             <motion.p className="text-lg text-gray-300 italic max-w-2xl mx-auto" variants={paragraphVariants}>
                                 Un repaso a lo mejor de cada estación del año.
                             </motion.p>
                        </div>
                        {seasonAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                                {seasonAwards.map(award => (
                                    <WinnerCard key={award.id} winner={mapAwardToWinner(award)} />
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-center text-gray-500 italic">No hay premios de temporada definidos.</p>
                        )}
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
                         {aspectAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                                {aspectAwards.map(award => (
                                    <WinnerCard key={award.id} winner={mapAwardToWinner(award)} />
                                ))}
                            </motion.div>
                         ) : (
                            <p className="text-center text-gray-500 italic">No hay premios técnicos definidos.</p>
                         )}
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
                          {actorAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto" variants={sectionVariants}>
                                {actorAwards.map(award => (
                                    <WinnerCard key={award.id} winner={mapAwardToWinner(award)} />
                                ))}
                            </motion.div>
                          ) : (
                            <p className="text-center text-gray-500 italic">No hay premios de actuación definidos.</p>
                          )}
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
                        {genreAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={sectionVariants}>
                                {genreAwards.map(award => (
                                    <WinnerCard key={award.id} winner={mapAwardToWinner(award)} />
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-center text-gray-500 italic">No hay premios por género definidos.</p>
                        )}
                    </motion.section>
                </>
            )}

            <ScrollToTopButton />
            {/* Global styles */}
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
