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
}

// --- Interface expected by WinnerCard ---
interface Winner {
    id: string | number;
    category: string;
    image: string;
    name: string;
    extra?: string;
    color: string;
}

// Sticky Nav Links - Added "Premios Anuales"
const sectionLinks = [
    { href: "#anual", label: "Premios Anuales", hoverBg: "hover:bg-amber-500/80" }, // Added link for annual awards
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

    // --- Parallax (unchanged) ---
    const { scrollYProgress } = useScroll();
    const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    // --- Set document title (unchanged) ---
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
                            // --- ADDED: Handle new award type ---
                            case 'Ganadores del Año':
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
    const { yearAwards, seasonAwards, aspectAwards, actorAwards, genreAwards } = useMemo(() => { // Added yearAwards
        const sorter = (a: AwardData, b: AwardData): number => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            return a.resolved_category?.localeCompare(b.resolved_category ?? '') ?? 0;
        };

        return {
            // --- ADDED: Filter for year awards ---
            yearAwards: allAwards.filter(a => a.award_type === 'Ganadores del Año').sort(sorter),
            seasonAwards: allAwards.filter(a => a.award_type === 'Temporada').sort(sorter),
            aspectAwards: allAwards.filter(a => a.award_type === 'Aspecto Técnico').sort(sorter),
            actorAwards: allAwards.filter(a => a.award_type === 'Actor de Voz').sort(sorter),
            genreAwards: allAwards.filter(a => a.award_type === 'Género').sort(sorter),
        };
    }, [allAwards]);


    // --- Animation variants (unchanged) ---
    const sectionVariants = { /* ... */ };
    const paragraphVariants = { /* ... */ };


    // --- Helper to map AwardData to Winner props (unchanged) ---
    const mapAwardToWinner = (award: AwardData): Winner => ({
        id: award.id,
        category: award.resolved_category || 'Categoría Desconocida',
        image: award.winner_image || 'https://placehold.co/400x600/7F1D1D/FECACA?text=No+Imagen',
        name: award.winner_name || 'Ganador Desconocido',
        extra: award.winner_extra,
        color: award.display_color || 'default',
    });

    // --- Loading and Error Display (unchanged) ---
    const LoadingIndicator = () => (/* ... */);
    const ErrorIndicator = ({ message }: { message: string }) => (/* ... */);


    return (
        <div ref={pageRef} className="relative overflow-x-hidden">
             {/* Decorative Background Elements (unchanged) */}
             {/* ... */}

            {/* Header (unchanged) */}
            <header className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-purple-950/80 via-purple-900/70 to-gray-950/60 shadow-xl">
                {/* ... */}
            </header>

            {/* Sticky Navigation (updated links) */}
            <nav className="sticky top-0 z-40 bg-gray-950/70 backdrop-blur-xl py-3 shadow-lg border-b border-gray-500/20">
                 <ul className="flex justify-center flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-pink-100 px-4">
                     {sectionLinks.map(item => ( // sectionLinks now includes "Premios Anuales"
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
                    {/* --- ADDED: Annual Awards Section --- */}
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
            {/* Global styles (unchanged) */}
            <style jsx global>{`/* ... styles unchanged ... */`}</style>
        </div>
    );
}

// --- Re-add definitions for variants and indicators ---
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
const LoadingIndicator = () => <div className="text-center py-20 text-gray-400">Cargando premios...</div>;
const ErrorIndicator = ({ message }: { message: string }) => <div className="text-center py-20 text-red-400">{message || "Error al cargar los premios."}</div>;


export default PremiosPage;
