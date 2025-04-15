import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import matter from 'gray-matter';
import ScrollToTopButton from '../components/ScrollToTopButton';
// Importar Loader2 para el spinner
import { CheckCircle, Circle, Award, Tv, MicVocal, Library, Users, Code, Wind, Database, Feather, Loader2 } from 'lucide-react';

// --- Interfaces ---
interface NomineeData {
    nominee_id: string;
    nominee_name?: string;
    nominee_image?: string;
    nominee_extra?: string;
    image_position_select?: string;
}

interface VotingCategoryData {
    id: string;
    slug: string;
    award_type?: string;
    resolved_category?: string;
    description?: string;
    is_active?: boolean;
    nominees?: NomineeData[];
    category_temporada?: string;
    category_aspecto?: string;
    category_actor?: string;
    category_genero?: string;
    category_anual?: string;
}

type VotesState = { [key: string]: string | null };

// --- Local Storage Key ---
const VOTES_STORAGE_KEY = 'shiroNexusUserVotes';

// --- Helper to get styles based on Award Type ---
const getGroupStyles = (awardType?: string) => {
    // Returns border color, text color, and icon component
    switch (awardType) {
        case 'Ganadores del Año': return { border: 'border-amber-500', text: 'text-amber-300', icon: Award };
        case 'Temporada': return { border: 'border-pink-500', text: 'text-pink-300', icon: Tv };
        case 'Aspecto Técnico': return { border: 'border-yellow-500', text: 'text-yellow-300', icon: Code };
        case 'Actor de Voz': return { border: 'border-indigo-500', text: 'text-indigo-300', icon: MicVocal };
        case 'Género': return { border: 'border-red-500', text: 'text-red-300', icon: Library };
        case 'Otra': return { border: 'border-gray-500', text: 'text-gray-300', icon: Users };
        default: return { border: 'border-gray-600', text: 'text-gray-400', icon: Circle };
    }
};


function VotacionesPage() {
    // --- State ---
    const [categories, setCategories] = useState<VotingCategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // General loading error
    const [selectedVotes, setSelectedVotes] = useState<VotesState>({}); // Votos temporales
    const [userVotes, setUserVotes] = useState<VotesState>({}); // Votos confirmados (leídos de localStorage para UI)
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para indicar envío API
    // --- AÑADIDO: Estado para mensajes de feedback ---
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // --- Effects ---
    useEffect(() => { document.title = "Votaciones | Shiro Nexus"; }, []);

    useEffect(() => { // Load votes from localStorage
        try {
            const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
            if (savedVotes) {
                setUserVotes(JSON.parse(savedVotes));
            }
            console.log("Votos cargados de localStorage:", savedVotes ? JSON.parse(savedVotes) : {});
        } catch (err) {
            console.error("Error loading votes from localStorage:", err);
        }
    }, []);

    useEffect(() => { // Load voting data from CMS
        const loadVotingData = async () => {
            setIsLoading(true); setError(null);
            try {
                const modules = import.meta.glob('/content/votaciones/*.md', { eager: true, query: '?raw', import: 'default' });
                console.log("VotacionesPage: Files found:", modules);
                const loadedCategories: VotingCategoryData[] = [];
                if (Object.keys(modules).length === 0) {
                    console.warn("VotacionesPage: No voting files found.");
                }

                for (const path in modules) {
                    const rawContent = modules[path];
                    if (typeof rawContent !== 'string') {
                         console.warn(`VotacionesPage: Content is not a string for: ${path}`);
                         continue;
                    }
                    try {
                        const { data: frontmatter } = matter(rawContent);
                        let resolvedCategory = 'Categoría Desconocida';
                        switch (frontmatter.award_type) {
                            case 'Temporada': resolvedCategory = frontmatter.category_temporada || resolvedCategory; break;
                            case 'Aspecto Técnico': resolvedCategory = frontmatter.category_aspecto || resolvedCategory; break;
                            case 'Actor de Voz': resolvedCategory = frontmatter.category_actor || resolvedCategory; break;
                            case 'Género': resolvedCategory = frontmatter.category_genero || resolvedCategory; break;
                            case 'Ganadores del Año': resolvedCategory = frontmatter.category_anual || resolvedCategory; break;
                            case 'Otra': resolvedCategory = frontmatter.category_title || resolvedCategory; break;
                        }
                        if (frontmatter.is_active !== false) {
                             loadedCategories.push({
                                id: frontmatter.slug || path,
                                slug: frontmatter.slug || path,
                                award_type: frontmatter.award_type,
                                resolved_category: resolvedCategory,
                                description: frontmatter.description,
                                is_active: frontmatter.is_active,
                                nominees: Array.isArray(frontmatter.nominees) ? frontmatter.nominees.map((n: any) => ({
                                    nominee_id: n.nominee_id,
                                    nominee_name: n.nominee_name,
                                    nominee_image: n.nominee_image,
                                    nominee_extra: n.nominee_extra,
                                    image_position_select: n.image_position_select
                                })) : [],
                                category_temporada: frontmatter.category_temporada,
                                category_aspecto: frontmatter.category_aspecto,
                                category_actor: frontmatter.category_actor,
                                category_genero: frontmatter.category_genero,
                                category_anual: frontmatter.category_anual,
                            });
                        }
                    } catch (parseError) { console.error(`Parse error: ${path}`, parseError); }
                }
                console.log("VotacionesPage: Loaded active categories:", loadedCategories);
                setCategories(loadedCategories);
            } catch (err) { console.error("Load error:", err); setError("Error al cargar votaciones."); }
            finally { setIsLoading(false); }
        };
        loadVotingData();
     }, []);

     // --- Effect to clear feedback message after a delay ---
     useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage(null);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    // --- Group Categories by Type ---
    const groupedCategories = useMemo(() => {
        const groups: { [key: string]: VotingCategoryData[] } = {};
        categories.forEach(cat => {
            const type = cat.award_type || 'Otros';
            if (!groups[type]) groups[type] = [];
            groups[type].push(cat);
        });
        const groupOrder = ["Ganadores del Año", "Temporada", "Aspecto Técnico", "Actor de Voz", "Género", "Otra"];
        const sortedGroups = Object.entries(groups).sort(([typeA], [typeB]) => {
            const indexA = groupOrder.indexOf(typeA); const indexB = groupOrder.indexOf(typeB);
            if (indexA === -1 && indexB === -1) return typeA.localeCompare(typeB);
            if (indexA === -1) return 1; if (indexB === -1) return -1;
            return indexA - indexB;
        });
        return sortedGroups;
    }, [categories]);

    // --- Handle Selecting a Nominee ---
    const handleSelectNominee = (categorySlug: string, nomineeId: string) => {
        if (userVotes[categorySlug]) return; // Do nothing if already confirmed
        setFeedbackMessage(null); // Clear feedback when selection changes
        setSelectedVotes(prev => ({ ...prev, [categorySlug]: prev[categorySlug] === nomineeId ? null : nomineeId }));
    };

    // --- Handle Confirming All Selections (MODIFIED for feedback) ---
    const handleConfirmVotes = async () => {
        setIsSubmitting(true);
        setFeedbackMessage(null); // Clear previous feedback
        // setError(null); // Clear general error as well? Maybe not, keep it for loading errors.

        const votesToSubmit = { ...selectedVotes };
        const votePromises: Promise<Response>[] = [];

        for (const categorySlug in votesToSubmit) {
            const nomineeId = votesToSubmit[categorySlug];
            if (nomineeId) {
                votePromises.push( fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categorySlug, nomineeId }) }) );
            }
        }

        try {
            const results = await Promise.all(votePromises);
            const allSucceeded = results.every(res => res.ok);

            if (allSucceeded) {
                const newConfirmedVotes = { ...userVotes, ...votesToSubmit };
                Object.keys(newConfirmedVotes).forEach(key => { if (newConfirmedVotes[key] === null) delete newConfirmedVotes[key]; });
                setUserVotes(newConfirmedVotes);
                localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(newConfirmedVotes));
                setSelectedVotes({});
                // --- USAR setFeedbackMessage en lugar de alert ---
                setFeedbackMessage({ type: 'success', message: '¡Votos registrados con éxito!' });
            } else {
                console.error('Algunos votos no se pudieron registrar:', results);
                // --- USAR setFeedbackMessage en lugar de alert ---
                setFeedbackMessage({ type: 'error', message: 'Error al registrar algunos votos. Inténtalo de nuevo.' });
            }
        } catch (fetchError) {
            console.error('Error al enviar los votos:', fetchError);
             // --- USAR setFeedbackMessage en lugar de alert ---
            setFeedbackMessage({ type: 'error', message: 'Error de red al enviar los votos. Comprueba tu conexión.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- FIN MODIFICACIÓN ---

    // --- Animation Variants ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const sectionVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
    const nomineeVariants = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 15 } } };

    // --- Loading/Error Indicators ---
    const LoadingIndicator = () => <div className="text-center py-24 text-gray-400 text-lg">Cargando votaciones...</div>;
    const ErrorIndicator = ({ message }: { message: string | null }) => <div className="text-center py-24 text-red-400 text-lg">{message || "Error al cargar."}</div>;

    // Check if there are any temporary selections made
    const hasPendingSelections = Object.values(selectedVotes).some(vote => vote !== null);

    return (
        // Main Container with background and full width
        <motion.div
            className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-gray-950"
            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
        >
            {/* Inner Centering Container */}
            <div className="max-w-7xl mx-auto">

                {/* Page Title */}
                <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-8 md:mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                    variants={sectionVariants}
                >
                    Votaciones Shiro Awards
                </motion.h1>
                {/* Page Subtitle/Description */}
                <motion.p
                    className="text-lg text-gray-300 text-center mb-20 md:mb-24 max-w-3xl mx-auto leading-relaxed"
                    variants={sectionVariants}
                >
                    ¡Tu voto cuenta! Elige a tus favoritos en cada categoría.
                    <span className="block text-sm text-gray-500 mt-3">(Recuerda: Solo un voto por categoría. Puedes cambiar tu selección hasta que confirmes).</span>
                    <span className="block text-sm text-amber-500/90 mt-3 font-medium tracking-wide">AVISO: El estado de votación actual solo se guarda en este navegador.</span>
                </motion.p>

                {/* Loading / Error / No Data States */}
                {isLoading ? ( <LoadingIndicator /> ) : error ? ( <ErrorIndicator message={error} /> ) : groupedCategories.length === 0 ? (
                    <p className="text-center text-gray-500 text-2xl py-16">No hay votaciones activas en este momento.</p>
                ) : (
                    // Main Content: Categories and Nominees
                    <div className="space-y-20 md:space-y-24">
                        {groupedCategories.map(([awardType, categoryList], groupIndex) => {
                            const groupStyle = getGroupStyles(awardType);
                            const GroupIcon = groupStyle.icon;

                            return (
                                // Section for each Award Type Group
                                <motion.section key={awardType} variants={sectionVariants}>
                                    {/* Group Title */}
                                    <div className={`text-center mb-16 md:mb-18`}>
                                        <h2 className={`inline-flex items-center gap-3 text-3xl md:text-4xl font-bold ${groupStyle.text} border-b-2 ${groupStyle.border} pb-3 px-6`}>
                                            <GroupIcon size={28} /> {awardType}
                                        </h2>
                                    </div>
                                    {/* List of Categories within this Group */}
                                    <div className="space-y-16">
                                        {categoryList.map((category) => {
                                            const isCategoryConfirmed = !!userVotes[category.slug];
                                            const currentSelection = selectedVotes[category.slug] ?? null;
                                            const confirmedVote = userVotes[category.slug] ?? null;

                                            return (
                                                // Container for one voting category - Estilo base
                                                <motion.div
                                                    key={category.id}
                                                    variants={sectionVariants}
                                                    className="bg-gray-800/30 border border-gray-700/40 rounded-2xl p-8 md:p-10 shadow-lg" // Borde simple gris
                                                >
                                                    {/* Category Title - Blanco */}
                                                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white">{category.resolved_category}</h3>
                                                    {/* Category Description - Tamaño ajustado */}
                                                    {category.description && <p className="text-lg text-gray-300 text-center mb-12 max-w-xl mx-auto leading-relaxed">{category.description}</p>}

                                                    {/* Nominees Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mt-8">
                                                        {/* --- INICIO RENDERIZADO NOMINADOS (COMPLETO) --- */}
                                                        {(category.nominees ?? []).map((nominee) => {
                                                            const isSelected = currentSelection === nominee.nominee_id;
                                                            const isConfirmed = confirmedVote === nominee.nominee_id;
                                                            const canInteract = !isCategoryConfirmed;
                                                            let cardStyle = 'border-gray-700/50 bg-gray-800/40';
                                                            let hoverStyle = 'hover:border-cyan-500 hover:bg-gray-700/50 hover:shadow-lg';
                                                            let textStyle = 'text-gray-100'; let indicator = null; let scaleEffect = '';
                                                            if (isConfirmed) { cardStyle = 'border-green-600/80 bg-green-900/20 opacity-70 shadow-md'; hoverStyle = ''; textStyle = 'text-green-200'; indicator = <CheckCircle size={18} className="text-green-400" />; scaleEffect = 'scale-105';
                                                            } else if (isSelected) { cardStyle = 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-900/30 shadow-lg'; hoverStyle = 'hover:border-cyan-300'; textStyle = 'text-cyan-200'; indicator = <Circle size={18} className="text-cyan-300" />; scaleEffect = 'scale-105';
                                                            } else if (isCategoryConfirmed) { cardStyle = 'border-gray-800 bg-gray-800/20 opacity-50'; hoverStyle = ''; }
                                                            const imageStyle: React.CSSProperties = { objectPosition: nominee.image_position_select || 'center center' };

                                                            return (
                                                                <motion.div
                                                                    key={nominee.nominee_id} variants={nomineeVariants}
                                                                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ease-out flex flex-col text-center group ${cardStyle} ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed' } ${canInteract ? hoverStyle : ''} ${scaleEffect}`}
                                                                    onClick={canInteract ? () => handleSelectNominee(category.slug, nominee.nominee_id) : undefined}
                                                                    whileHover={canInteract ? { y: -4, transition: { type: 'spring', stiffness: 300 } } : {}}
                                                                    whileTap={canInteract ? { scale: isSelected ? 1.03 : 0.98 } : {}}
                                                                >
                                                                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                                                                        {nominee.nominee_image ? ( <img src={nominee.nominee_image} alt={nominee.nominee_name || 'Nominado'} className="w-full h-full object-cover" style={imageStyle} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/300x400/7F1D1D/FECACA?text=Error`; (e.target as HTMLImageElement).alt="Error Imagen"; }} /> )
                                                                        : ( <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs italic">Sin Imagen</div> )}
                                                                    </div>
                                                                    <div className="p-3 flex-grow flex flex-col justify-center min-h-[5.5rem]">
                                                                        <p className={`font-semibold text-base leading-tight mb-1 ${textStyle} group-hover:text-cyan-300 transition-colors`}>
                                                                            {nominee.nominee_name || '??'}
                                                                        </p>
                                                                        {nominee.nominee_extra && <p className="text-xs text-gray-400/90 mt-0.5">{nominee.nominee_extra}</p>}
                                                                    </div>
                                                                    {(isSelected || isConfirmed) && ( <div className={`absolute top-1.5 right-1.5 p-0.5 rounded-full shadow ${isConfirmed ? 'bg-green-600/80' : 'bg-cyan-500/80'} backdrop-blur-sm`}> {indicator} </div> )}
                                                                </motion.div>
                                                            );
                                                        })}
                                                        {/* --- FIN RENDERIZADO NOMINADOS --- */}
                                                    </div>
                                                    {/* Message indicating vote is confirmed */}
                                                    {isCategoryConfirmed && (
                                                        <div className="flex items-center justify-center gap-2 mt-8">
                                                             <CheckCircle size={16} className="text-green-400"/>
                                                             <p className="text-sm text-green-300/90 font-medium tracking-wide">Voto confirmado en esta categoría.</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    {/* Divider between groups */}
                                    {groupIndex < groupedCategories.length - 1 && (
                                        <hr className="my-20 md:my-24 border-t-2 border-dashed border-gray-700/50"/>
                                    )}
                                </motion.section>
                            );
                        })}
                    </div>
                )} {/* End main conditional rendering block */}

                 {/* --- Confirmation Button Area --- */}
                 {/* Added min-height to prevent layout shift when button/message appears/disappears */}
                 <div className="mt-24 text-center min-h-[6rem]">
                    <AnimatePresence>
                        {hasPendingSelections && !isSubmitting && ( // Show button only if pending and not submitting
                             <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                             >
                                <button
                                    onClick={handleConfirmVotes}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                                    disabled={isSubmitting}
                                >
                                    {/* Spinner añadido aquí */}
                                    {isSubmitting && <Loader2 size={20} className="animate-spin -ml-1 mr-2" />}
                                    {isSubmitting ? 'Enviando...' : 'Confirmar Mis Votos Seleccionados'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Indicador de Carga/Feedback */}
                    <AnimatePresence>
                        {isSubmitting && ( // Mostrar texto de envío solo si no hay mensaje de feedback aún
                            !feedbackMessage &&
                            <motion.div
                                className="flex items-center justify-center gap-2 mt-4 text-blue-300"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            >
                                <Loader2 size={20} className="animate-spin" />
                                <span>Enviando votos...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                       {feedbackMessage && (
                            <motion.div
                                key={feedbackMessage.message} // Key to re-trigger animation on message change
                                className={`mt-4 px-4 py-2 rounded-md text-sm font-medium inline-block ${
                                    feedbackMessage.type === 'success' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'
                                }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {feedbackMessage.message}
                            </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Subtexto del botón */}
                    {hasPendingSelections && !isSubmitting && (
                         <p className="text-sm text-gray-500/90 mt-4">
                            (Los votos confirmados se guardarán solo en este navegador)
                        </p>
                    )}
                </div>

                <ScrollToTopButton />

            </div> {/* Closing inner centering container */}
        </motion.div> // Closing main page container div
    );
}

export default VotacionesPage;
