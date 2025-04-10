import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WinnerCard from '../components/WinnerCard'; // Import reusable component
import ScrollToTopButton from '../components/ScrollToTopButton'; // Import scroll button
import matter from 'gray-matter'; // Import gray-matter

// --- Interface for data loaded from CMS ---
interface AwardData {
    id: string; // Filename as ID
    award_type?: string; // Temporada, Aspecto Técnico, etc.
    // Specific category fields are read but stored in resolved_category
    // category_temporada?: string;
    // category_aspecto?: string;
    // category_actor?: string;
    // category_genero?: string;
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

// Sticky Nav Links (unchanged)
const sectionLinks = [
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

                        // --- Determine the correct category based on award_type ---
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
                        }
                        // --- End category determination ---

                        const awardItem: AwardData = {
                            id: filename,
                            award_type: frontmatter.award_type,
                            resolved_category: resolvedCategory, // Store the resolved category
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
    const { seasonAwards, aspectAwards, actorAwards, genreAwards } = useMemo(() => {
        const sorter = (a: AwardData, b: AwardData): number => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            if (a.order !== undefined) return -1;
            if (b.order !== undefined) return 1;
            // --- MODIFIED: Fallback sort uses resolved_category ---
            return a.resolved_category?.localeCompare(b.resolved_category ?? '') ?? 0;
        };

        return {
            seasonAwards: allAwards.filter(a => a.award_type === 'Temporada').sort(sorter),
            aspectAwards: allAwards.filter(a => a.award_type === 'Aspecto Técnico').sort(sorter),
            actorAwards: allAwards.filter(a => a.award_type === 'Actor de Voz').sort(sorter),
            genreAwards: allAwards.filter(a => a.award_type === 'Género').sort(sorter),
        };
    }, [allAwards]);


    // --- Animation variants (unchanged) ---
    const sectionVariants = { /* ... */ };
    const paragraphVariants = { /* ... */ };


    // --- Helper to map AwardData to Winner props ---
    const mapAwardToWinner = (award: AwardData): Winner => ({
        id: award.id,
        // --- MODIFIED: Use resolved_category ---
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
                {/* ... header content unchanged ... */}
            </header>

            {/* Sticky Navigation (unchanged) */}
            <nav className="sticky top-0 z-40 bg-gray-950/70 backdrop-blur-xl py-3 shadow-lg border-b border-gray-500/20">
                 {/* ... nav content unchanged ... */}
             </nav>

            {/* --- Award Sections (Render logic updated) --- */}
            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <ErrorIndicator message={error} />
            ) : (
                <>
                    {/* Seasons Section */}
                    <motion.section
                        id="temporadas"
                        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
                        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="text-center mb-16">
                            {/* ... title unchanged ... */}
                        </div>
                        {seasonAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                                {/* Map over dynamic data */}
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
                            {/* ... title unchanged ... */}
                         </div>
                         {aspectAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={sectionVariants}>
                                {/* Map over dynamic data */}
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
                             {/* ... title unchanged ... */}
                          </div>
                          {actorAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto" variants={sectionVariants}>
                                {/* Map over dynamic data */}
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
                            {/* ... title unchanged ... */}
                        </div>
                        {genreAwards.length > 0 ? (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={sectionVariants}>
                                {/* Map over dynamic data */}
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

// --- Minimal LoadingIndicator and ErrorIndicator for brevity ---
const LoadingIndicator = () => <div className="text-center py-20 text-gray-400">Cargando premios...</div>;
const ErrorIndicator = ({ message }: { message: string }) => <div className="text-center py-20 text-red-400">{message || "Error al cargar los premios."}</div>;

// --- Re-add definitions for variants if they were removed or defined outside ---
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


export default PremiosPage;
