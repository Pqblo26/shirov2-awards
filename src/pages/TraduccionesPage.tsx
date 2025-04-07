import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import TranslationItemCard from '../components/TranslationItemCard';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import matter from 'gray-matter';
import ScrollToTopButton from '../components/ScrollToTopButton';

// Define structure for parsed data - Added progress field
// Make sure this interface matches or is compatible with Sidebar props
interface TranslationItemData {
    id: string;
    slug: string;
    filename: string;
    title: string;
    link: string;
    imageUrl?: string;
    tags?: string[]; // Combined tags for filtering
    date: string;
    status?: string; // Needed for filtering WIP
    mainCategory?: string;
    format?: string;
    specification?: string;
    source?: string;
    excerpt?: string;
    progress?: number; // Added progress field
}
// Define a specific type for items passed to Sidebar
export interface WipItem {
    id: string;
    title: string;
    link: string;
    imageUrl?: string;
    status?: string; // Or a more specific status for WIP steps?
    progress?: number;
}


type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

// --- Helper function to get display value from select/other pairs ---
const getDisplayValue = (selectValue?: string, otherValue?: string): string | undefined => {
    if (selectValue === "Otro") { return otherValue || undefined; }
    return selectValue;
};


// --- Main Page Component ---
function TraduccionesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTag = searchParams.get('tag');

    useEffect(() => { document.title = "Traducciones | Shiro Nexus"; }, []);

    // --- State ---
    const [allTranslations, setAllTranslations] = useState<TranslationItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

     // --- Data Loading ---
     useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log("Attempting to load translations...");
        try {
            const modules = import.meta.glob('/content/traducciones/**/*.md', {
                eager: true, query: '?raw', import: 'default'
            });
            const loadedTranslations: TranslationItemData[] = [];
            for (const path in modules) {
                const rawContent = modules[path];
                 if (typeof rawContent !== 'string') { continue; }
                try {
                    const { data: frontmatter } = matter(rawContent);
                    const slugMatch = path.match(/([^/]+)\.md$/);
                    const filename = slugMatch ? slugMatch[1] : path;
                    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
                    const displayFormat = getDisplayValue(frontmatter.format_select, frontmatter.format_other);
                    const displaySpecification = getDisplayValue(frontmatter.specification_select, frontmatter.specification_other);
                    const displaySource = getDisplayValue(frontmatter.source_select, frontmatter.source_other);
                    const tags = [
                        frontmatter.status, frontmatter.mainCategory, displayFormat, displaySpecification,
                        ...(Array.isArray(frontmatter.tags) ? frontmatter.tags : [])
                    ].filter(Boolean) as string[];

                    const translationItem: TranslationItemData = {
                        id: filename, slug: slug, filename: filename,
                        title: frontmatter.title ?? `Sin Título (${filename})`,
                        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
                        imageUrl: frontmatter.imageUrl, tags: tags, status: frontmatter.status,
                        mainCategory: frontmatter.mainCategory, format: displayFormat,
                        specification: displaySpecification, source: displaySource,
                        excerpt: frontmatter.excerpt, link: `/traducciones/${filename}`,
                        progress: frontmatter.progress // Read the progress field
                    };
                    loadedTranslations.push(translationItem);
                } catch (parseError) { console.error(`Error parsing frontmatter for file: ${path}`, parseError); }
            }
            setAllTranslations(loadedTranslations);
        } catch (err) { console.error("Error loading translation files:", err); setError("Error al cargar las traducciones.");
        } finally { setIsLoading(false); }
    }, []);

    // ... (useEffect for searchParams) ...
    useEffect(() => { const tagFromURL = searchParams.get('tag'); if (tagFromURL && !selectedTags.includes(tagFromURL)) { setSelectedTags([tagFromURL]); } }, [searchParams, selectedTags]);


    // --- Available Tags for Filtering ---
    const mainCategoryTags = ["Anime", "Donghua", "Otros"];
    const formatTags = ["TV", "OVA", "Especial", "Película"];
    const specificationTags = ["MKV", "MP4", "AVI"];
    const statusTags = ["En Progreso", "Finalizado", "Pausado", "Cancelado"];

    // --- Filtering Logic ---
    const filteredData = useMemo(() => {
        // ... (filtering logic remains the same) ...
        let filtered = allTranslations;
        if (searchTerm) { filtered = filtered.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())); }
        if (selectedTags.length > 0) { filtered = filtered.filter(item => item.tags && selectedTags.every(tag => item.tags?.includes(tag))); }
        return filtered;
       }, [searchTerm, selectedTags, allTranslations]);

    // --- Grouping and Sorting Logic ---
    const { inProgressItems, finishedItems, pausedItems, cancelledItems } = useMemo(() => {
        // ... (grouping and sorting logic remains the same) ...
        const progress: TranslationItemData[] = []; const finished: TranslationItemData[] = []; const paused: TranslationItemData[] = []; const cancelled: TranslationItemData[] = [];
        filteredData.forEach(item => { if (item.tags?.includes("En Progreso")) progress.push(item); else if (item.tags?.includes("Pausado")) paused.push(item); else if (item.tags?.includes("Cancelado")) cancelled.push(item); else finished.push(item); });
        const sortArray = (arr: TranslationItemData[]) => { switch (sortBy) { case 'oldest': return [...arr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); case 'title-asc': return [...arr].sort((a, b) => a.title.localeCompare(b.title)); case 'title-desc': return [...arr].sort((a, b) => b.title.localeCompare(a.title)); case 'newest': default: return [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); } };
        return { inProgressItems: sortArray(progress), finishedItems: sortArray(finished), pausedItems: sortArray(paused), cancelledItems: sortArray(cancelled) };
       }, [filteredData, sortBy]);

    // --- MODIFIED: Prepare data specifically for Sidebar ---
    const currentlyWorkingOnItems = useMemo(() => {
        // Filter all translations, not just the currently displayed page/filtered ones
        // Or use `inProgressItems` if you only want currently filtered items shown
        return allTranslations
            .filter(item => item.status === "En Progreso")
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by newest first
            .slice(0, 5) // Limit to max 5 items for the sidebar
            .map(item => ({ // Map to the WipItem structure expected by Sidebar
                id: item.id,
                title: item.title,
                link: item.link,
                imageUrl: item.imageUrl,
                status: item.status, // Pass the specific status if needed in sidebar
                progress: item.progress
            }));
    }, [allTranslations]); // Depend on all translations

    // --- Event Handlers ---
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(event.target.value); };
    const handleTagClick = (tag: string) => { setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setSortBy(event.target.value as SortOption); };

    // --- Animation Variants ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

    // --- Helper Components (Spinner, Filter Group, Section Grid) ---
    const LoadingSpinner = () => ( <div className="flex justify-center items-center py-20"> <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-t-cyan-500 border-r-cyan-500/30 border-b-cyan-500/30 border-l-cyan-500/30 rounded-full" ></motion.div> </div> );
    const renderFilterTagGroup = (title: string, tags: string[], colorClassActive: string | ((tag: string) => string)) => ( /* ... */ ); // Unchanged
    const renderSectionGrid = (title: string, items: TranslationItemData[], icon: React.ReactNode, borderColor: string) => ( /* ... */ ); // Unchanged


    return (
        <>
            <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" initial="hidden" animate="visible" variants={containerVariants} >
                {/* ... Title, Description ... */}
                 <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-cyan-400">Traducciones</motion.h1>
                 <motion.p variants={itemVariants} className="text-center text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto"> Explora nuestras últimas traducciones y filtra según tus preferencias.</motion.p>

                {/* --- Main content area with Sidebar --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

                    {/* --- Main Content Column (Filters + Sections) --- */}
                    <div className="lg:col-span-2">
                         {/* ... Filters Section ... */}
                         <motion.div variants={itemVariants} className="mb-12 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/80 rounded-xl border border-gray-700/50 shadow-xl backdrop-blur-sm">
                             {/* Search and Sort */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 items-end mb-6">
                                 {/* Search Input */}
                                 <div> <label htmlFor="search-traducciones" className="block text-sm font-medium text-gray-300 mb-1.5">Buscar por Título</label> <div className="relative"> <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></span> <input type="search" id="search-traducciones" placeholder="Buscar..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 bg-gray-700/60 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"/> </div> </div>
                                 {/* Sort Select */}
                                 <div> <label htmlFor="sort-traducciones" className="block text-sm font-medium text-gray-300 mb-1.5">Ordenar por</label> <select id="sort-traducciones" value={sortBy} onChange={handleSortChange} className="w-full px-4 py-2 bg-gray-700/60 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em'}}> <option value="newest">Más Recientes</option><option value="oldest">Más Antiguos</option><option value="title-asc">Título (A-Z)</option><option value="title-desc">Título (Z-A)</option> </select> </div>
                             </div>
                             {/* Filter Tags */}
                             <div className="space-y-4">
                                 {renderFilterTagGroup("Categoría Principal", mainCategoryTags, "bg-blue-600")}
                                 {renderFilterTagGroup("Formato", formatTags, "bg-purple-600")}
                                 {renderFilterTagGroup("Especificaciones", specificationTags, "bg-indigo-600")}
                                 {renderFilterTagGroup("Estado", statusTags, (tag) => { if (tag === 'En Progreso') return 'bg-yellow-500 text-black'; if (tag === 'Finalizado') return 'bg-cyan-600'; if (tag === 'Pausado') return 'bg-orange-500'; if (tag === 'Cancelado') return 'bg-red-600'; return 'bg-gray-600'; })}
                                 {selectedTags.length > 0 && ( <div className="pt-3 text-right border-t border-gray-700/50 mt-4"> <button onClick={() => { setSelectedTags([]); }} className="px-3 py-1 text-xs rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors" > Limpiar Filtros </button> </div> )}
                             </div>
                         </motion.div>

                        {/* Anchor for scrolling */}
                        <div id="translation-list-start" className="pt-4"></div>

                        {/* --- Loading State or Display Sections --- */}
                        {isLoading ? ( <LoadingSpinner /> ) : error ? ( /* Error Message */ ) : filteredData.length === 0 ? ( /* Empty State */ ) : (
                            // Render Sections
                            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                {renderSectionGrid("En Progreso", inProgressItems, <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-yellow-500")}
                                {renderSectionGrid("Pausado", pausedItems, <svg className="h-6 w-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-orange-500")}
                                {renderSectionGrid("Finalizado", finishedItems, <svg className="h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-cyan-500")}
                                {renderSectionGrid("Cancelado", cancelledItems, <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>, "border-red-700")}
                            </motion.div>
                        )}
                    </div> {/* End Main Content Column */}

                    {/* --- Sidebar Column --- */}
                    <div className="lg:col-span-1 mt-12 lg:mt-0">
                        {/* --- MODIFIED: Pass currentlyWorkingOnItems to Sidebar --- */}
                        <Sidebar currentlyWorkingOn={currentlyWorkingOnItems} />
                    </div>

                </div> {/* End Grid Layout */}
            </motion.div>

            <ScrollToTopButton />
        </>
    );
}

export default TraduccionesPage;
