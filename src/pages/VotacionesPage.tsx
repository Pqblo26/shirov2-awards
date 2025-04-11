import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import matter from 'gray-matter';
import ScrollToTopButton from '../components/ScrollToTopButton'; // Importar el botón

// --- Interfaces ---
interface NomineeData {
    nominee_id: string;
    nominee_name?: string;
    nominee_image?: string;
    nominee_extra?: string;
}

interface VotingCategoryData {
    id: string; // slug from CMS file
    slug: string;
    award_type?: string;
    resolved_category?: string; // The actual category name
    description?: string;
    is_active?: boolean;
    nominees?: NomineeData[];
    // Raw conditional fields needed temporarily during load
    category_temporada?: string;
    category_aspecto?: string;
    category_actor?: string;
    category_genero?: string;
    category_anual?: string;
}

// Type for storing votes { categorySlug: nomineeId }
type VotesState = {
    [key: string]: string | null;
};

// --- Local Storage Key ---
const VOTES_STORAGE_KEY = 'shiroNexusUserVotes';

function VotacionesPage() {
    // --- State ---
    const [categories, setCategories] = useState<VotingCategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State to hold user's votes, initialized from localStorage
    const [userVotes, setUserVotes] = useState<VotesState>({});

    // --- Effects ---
    useEffect(() => {
        document.title = "Votaciones | Shiro Nexus";
    }, []);

    // Load votes from localStorage on initial mount
    useEffect(() => {
        try {
            const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
            if (savedVotes) {
                setUserVotes(JSON.parse(savedVotes));
            }
        } catch (err) {
            console.error("Error loading votes from localStorage:", err);
            // Optionally clear corrupted storage
            // localStorage.removeItem(VOTES_STORAGE_KEY);
        }
    }, []);

    // Load voting categories from CMS
    useEffect(() => {
        const loadVotingData = async () => {
            setIsLoading(true);
            setError(null);
            console.log("VotacionesPage: Attempting to load voting data...");
            try {
                const modules = import.meta.glob('/content/votaciones/*.md', {
                    eager: true,
                    query: '?raw',
                    import: 'default'
                });
                console.log("VotacionesPage: Files found:", modules);

                const loadedCategories: VotingCategoryData[] = [];
                if (Object.keys(modules).length === 0) {
                    console.warn("VotacionesPage: No voting files found.");
                }

                for (const path in modules) {
                    const rawContent = modules[path];
                    if (typeof rawContent !== 'string') continue;
                    try {
                        const { data: frontmatter } = matter(rawContent);

                        // Determine the correct category name
                        let resolvedCategory = 'Categoría Desconocida';
                        switch (frontmatter.award_type) {
                            case 'Temporada': resolvedCategory = frontmatter.category_temporada || resolvedCategory; break;
                            case 'Aspecto Técnico': resolvedCategory = frontmatter.category_aspecto || resolvedCategory; break;
                            case 'Actor de Voz': resolvedCategory = frontmatter.category_actor || resolvedCategory; break;
                            case 'Género': resolvedCategory = frontmatter.category_genero || resolvedCategory; break;
                            case 'Ganadores del Año': resolvedCategory = frontmatter.category_anual || resolvedCategory; break;
                            case 'Otra': resolvedCategory = frontmatter.category_title || resolvedCategory; break; // Fallback if needed
                        }

                        // Only include active categories
                        if (frontmatter.is_active !== false) {
                             loadedCategories.push({
                                id: frontmatter.slug || path, // Use slug field as ID
                                slug: frontmatter.slug || path,
                                award_type: frontmatter.award_type,
                                resolved_category: resolvedCategory,
                                description: frontmatter.description,
                                is_active: frontmatter.is_active,
                                // Ensure nominees is an array, default to empty if missing/malformed
                                nominees: Array.isArray(frontmatter.nominees) ? frontmatter.nominees : [],
                            });
                        }

                    } catch (parseError) { console.error(`VotacionesPage: Error parsing frontmatter for file: ${path}`, parseError); }
                }
                console.log("VotacionesPage: Loaded active categories:", loadedCategories);
                setCategories(loadedCategories);
            } catch (err) { console.error("VotacionesPage: Error loading voting files:", err); setError("Error al cargar las votaciones.");
            } finally { setIsLoading(false); }
        };
        loadVotingData();
    }, []);

    // --- Group Categories by Type ---
    const groupedCategories = useMemo(() => {
        const groups: { [key: string]: VotingCategoryData[] } = {};
        categories.forEach(cat => {
            const type = cat.award_type || 'Otros'; // Group under 'Otros' if type is missing
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(cat);
        });
        // Optional: Sort groups by a predefined order
        const groupOrder = ["Ganadores del Año", "Temporada", "Aspecto Técnico", "Actor de Voz", "Género", "Otra"];
        const sortedGroups = Object.entries(groups).sort(([typeA], [typeB]) => {
            const indexA = groupOrder.indexOf(typeA);
            const indexB = groupOrder.indexOf(typeB);
            if (indexA === -1 && indexB === -1) return typeA.localeCompare(typeB); // Sort unknown types alphabetically
            if (indexA === -1) return 1; // Unknown types go last
            if (indexB === -1) return -1; // Unknown types go last
            return indexA - indexB; // Sort by predefined order
        });
        return sortedGroups; // Return as array of [type, categories[]]
    }, [categories]);

    // --- Handle Voting ---
    const handleVote = (categorySlug: string, nomineeId: string) => {
        // Check if already voted in this category for this session
        if (userVotes[categorySlug]) {
            console.log(`Ya has votado en la categoría: ${categorySlug}`);
            // Optionally provide user feedback (e.g., using a toast notification library)
            return;
        }

        // IMPORTANT: This only simulates the vote visually and stores it in localStorage.
        // It does NOT send data to a server or provide secure/persistent voting.
        console.log(`Votando por ${nomineeId} en ${categorySlug}`);
        const newVotes = { ...userVotes, [categorySlug]: nomineeId };
        setUserVotes(newVotes);
        try {
            localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(newVotes));
        } catch (err) {
            console.error("Error saving vote to localStorage:", err);
        }
    };

    // --- Animation Variants ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const sectionVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
    const nomineeVariants = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };

    // --- Loading/Error Indicators ---
    const LoadingIndicator = () => <div className="text-center py-20 text-gray-400">Cargando votaciones...</div>;
    const ErrorIndicator = ({ message }: { message: string | null }) => <div className="text-center py-20 text-red-400">{message || "Error al cargar."}</div>;


    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            {/* Page Title */}
            <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                variants={sectionVariants}
            >
                Votaciones Shiro Awards
            </motion.h1>
            <motion.p
                className="text-lg text-gray-300 text-center mb-12 md:mb-16 max-w-2xl mx-auto"
                variants={sectionVariants}
            >
                ¡Tu voto cuenta! Elige a tus favoritos en cada categoría.
                <span className="block text-sm text-gray-500 mt-2">(Recuerda: Solo un voto por categoría. Se sugiere iniciar sesión para futuras mejoras, aunque no es obligatorio ahora).</span>
                 <span className="block text-xs text-amber-400/80 mt-3 font-semibold tracking-wider">AVISO: El estado de votación actual solo se guarda en este navegador.</span>
            </motion.p>

            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <ErrorIndicator message={error} />
            ) : groupedCategories.length === 0 ? (
                 <p className="text-center text-gray-500 text-xl py-10">No hay votaciones activas en este momento.</p>
            ) : (
                // Map over grouped categories
                <div className="space-y-16 md:space-y-20">
                    {groupedCategories.map(([awardType, categoryList]) => (
                        <motion.section key={awardType} variants={sectionVariants}>
                            {/* Group Title (Optional) */}
                            <h2 className="text-3xl font-bold text-center mb-10 text-cyan-300">{awardType}</h2>
                            <div className="space-y-12">
                                {categoryList.map((category) => (
                                    <motion.div key={category.id} variants={sectionVariants} className="bg-gray-900/50 border border-gray-700/80 rounded-xl p-6 shadow-lg">
                                        <h3 className="text-2xl font-semibold text-center mb-3 text-white">{category.resolved_category}</h3>
                                        {category.description && <p className="text-sm text-gray-400 text-center mb-8 max-w-xl mx-auto">{category.description}</p>}

                                        {/* Nominees Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                            {(category.nominees ?? []).map((nominee) => {
                                                const hasVotedInCategory = !!userVotes[category.slug];
                                                const isSelected = userVotes[category.slug] === nominee.nominee_id;
                                                const canVote = !hasVotedInCategory;

                                                return (
                                                    <motion.div
                                                        key={nominee.nominee_id}
                                                        variants={nomineeVariants}
                                                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out flex flex-col text-center group
                                                            ${isSelected ? 'border-cyan-500 shadow-cyan-500/30 shadow-lg scale-105' : 'border-gray-700'}
                                                            ${canVote ? 'cursor-pointer hover:border-cyan-600 hover:shadow-md' : 'opacity-70 cursor-not-allowed'}
                                                            ${hasVotedInCategory && !isSelected ? 'opacity-50' : ''}
                                                        `}
                                                        onClick={canVote ? () => handleVote(category.slug, nominee.nominee_id) : undefined}
                                                        whileHover={canVote ? { y: -5 } : {}}
                                                        whileTap={canVote ? { scale: 0.97 } : {}}
                                                    >
                                                        {/* Image */}
                                                        {nominee.nominee_image ? (
                                                            <img
                                                                src={nominee.nominee_image}
                                                                alt={nominee.nominee_name || 'Nominado'}
                                                                className="w-full h-40 object-cover bg-gray-700" // Fixed height for consistency
                                                                loading="lazy"
                                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-500 text-xs italic">Sin Imagen</div>
                                                        )}
                                                        {/* Details */}
                                                        <div className="p-3 bg-gray-800/80 flex-grow flex flex-col justify-center">
                                                            <p className={`font-semibold text-sm mb-1 ${isSelected ? 'text-cyan-300' : 'text-gray-100'} group-hover:text-cyan-400 transition-colors`}>
                                                                {nominee.nominee_name || '??'}
                                                            </p>
                                                            {nominee.nominee_extra && <p className="text-xs text-gray-400">{nominee.nominee_extra}</p>}
                                                        </div>
                                                        {/* Voted Indicator */}
                                                        {isSelected && (
                                                            <div className="absolute top-1 right-1 bg-cyan-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                                                Votado
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        {hasVotedInCategory && (
                                            <p className="text-center text-xs text-cyan-400/80 mt-4 font-semibold tracking-wide">Ya has votado en esta categoría.</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            )}

            {/* Botón para volver arriba */}
            <ScrollToTopButton />

        </motion.div>
    );
}

export default VotacionesPage;
