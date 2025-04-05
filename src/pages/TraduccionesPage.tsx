import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import TranslationItemCard from '../components/TranslationItemCard';
import Sidebar from '../components/Sidebar';
// Import the ScrollToTopButton component (NEW)
import ScrollToTopButton from '../components/ScrollToTopButton';

// --- Sample Data ---
const allTranslationsData = [
    { id: "t-main-1", title: "Avance Capítulo 10 - Manga XYZ", link: "/traducciones/manga-xyz-10", imageUrl: "https://picsum.photos/seed/mangaXYZ10/300/400", tags: ["Otros", "En Progreso"], date: "2025-04-05" },
    { id: "t-main-2", title: "Entrevista Exclusiva - Autor ABC", link: "/traducciones/entrevista-abc", imageUrl: "https://picsum.photos/seed/autorABC/300/400", tags: ["Otros", "Finalizado"], date: "2025-04-03" },
    { id: "t-main-3", title: "Noticia Importante - Evento Anime", link: "/traducciones/noticia-evento", imageUrl: "https://picsum.photos/seed/eventoAnime/300/400", tags: ["Otros", "Finalizado"], date: "2025-04-01" },
    { id: "t-main-4", title: "Análisis Episodio Final - Anime ZZZ (TV)", link: "/traducciones/analisis-zzz", imageUrl: "https://picsum.photos/seed/animeZZZfinal/300/400", tags: ["Otros", "Anime", "TV", "Finalizado"], date: "2025-03-30" },
    { id: "t-main-5", title: "Guía de Personajes - Juego AAA", link: "/traducciones/guia-aaa", imageUrl: "https://picsum.photos/seed/juegoAAA/300/400", tags: ["Otros", "En Progreso"], date: "2025-03-25" },
    { id: "t-main-6", title: "Donghua XYZ - Episodio 5 (BD)", link: "/traducciones/donghua-xyz-5", imageUrl: "https://picsum.photos/seed/donghuaXYZ5/300/400", tags: ["Donghua", "BD", "En Progreso"], date: "2025-03-28" },
    { id: "t-main-7", title: "OVA Especial - Anime ABC", link: "/traducciones/ova-abc", imageUrl: "https://picsum.photos/seed/animeABCova/300/400", tags: ["Anime", "OVA", "Especial", "Finalizado"], date: "2025-03-15" },
    { id: "t-main-8", title: "Resumen Novela Ligera Vol. 3", link: "/traducciones/nl-vol3", imageUrl: "https://picsum.photos/seed/novelaLigera3/300/400", tags: ["Otros", "Finalizado"], date: "2025-03-10" },
    { id: "t-main-9", title: "Manga XYZ - Capítulo 9", link: "/traducciones/manga-xyz-9", imageUrl: "https://picsum.photos/seed/mangaXYZ9/300/400", tags: ["Otros", "En Progreso"], date: "2025-03-29" },
    { id: "t-main-10", title: "Anime ZZZ - Episodio 11 (TV)", link: "/traducciones/anime-zzz-11", imageUrl: "https://picsum.photos/seed/animeZZZ11/300/400", tags: ["Anime", "TV", "En Progreso"], date: "2025-03-23" },
    { id: "t-main-11", title: "Web Comic Corto - Autor Y", link: "/traducciones/webcomic-y", imageUrl: "https://picsum.photos/seed/webcomicY/300/400", tags: ["Otros", "Finalizado"], date: "2025-03-05" },
    { id: "t-main-12", title: "Donghua XYZ - Episodio 4 (BD)", link: "/traducciones/donghua-xyz-4", imageUrl: "https://picsum.photos/seed/donghuaXYZ4/300/400", tags: ["Donghua", "BD", "En Progreso"], date: "2025-03-21" },
    { id: "t-main-13", title: "Anime Pelicula - Proyecto Pausado", link: "/traducciones/peli-pausada", imageUrl: "https://picsum.photos/seed/peliPausada/300/400", tags: ["Anime", "Pausado"], date: "2025-02-20" },
    { id: "t-main-14", title: "Manga ABC - Cancelado", link: "/traducciones/manga-abc-cancel", imageUrl: "https://picsum.photos/seed/mangaABCcancel/300/400", tags: ["Otros", "Cancelado"], date: "2025-01-15" },
    { id: "t-main-15", title: "Donghua QRS - Pausado Indefinidamente", link: "/traducciones/donghua-qrs-pausa", imageUrl: "https://picsum.photos/seed/donghuaQRSpausa/300/400", tags: ["Donghua", "TV", "Pausado"], date: "2025-02-01" },
];

// Define types for data and state
type TranslationItemData = typeof allTranslationsData[0];
type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

// --- Main Page Component ---
function TraduccionesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTag = searchParams.get('tag');

    useEffect(() => { document.title = "Traducciones | Shiro Nexus"; }, []);

    // --- State ---
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

     // Simulate loading data
     useEffect(() => { const timer = setTimeout(() => { setIsLoading(false); }, 500); return () => clearTimeout(timer); }, []);

    // Update selectedTags if URL parameter changes
    useEffect(() => { const tagFromURL = searchParams.get('tag'); if (tagFromURL && !selectedTags.includes(tagFromURL)) { setSelectedTags([tagFromURL]); } }, [searchParams, selectedTags]);

    // --- Available Tags for Filtering ---
    const mainCategoryTags = ["Anime", "Donghua", "Otros"];
    const formatTags = ["TV", "BD", "OVA", "Especial"];
    const statusTags = ["En Progreso", "Finalizado", "Pausado", "Cancelado"];

    // --- Filtering and Sorting Logic ---
    const filteredData = useMemo(() => { /* ... */
        let filtered = allTranslationsData;
        if (searchTerm) { filtered = filtered.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())); }
        if (selectedTags.length > 0) { filtered = filtered.filter(item => selectedTags.every(tag => item.tags.includes(tag))); }
        return filtered;
     }, [searchTerm, selectedTags]);

    // --- Split and Sort Logic ---
    const { inProgressItems, finishedItems, pausedItems, cancelledItems } = useMemo(() => { /* ... */
        const progress: TranslationItemData[] = []; const finished: TranslationItemData[] = []; const paused: TranslationItemData[] = []; const cancelled: TranslationItemData[] = [];
        filteredData.forEach(item => { if (item.tags.includes("En Progreso")) progress.push(item); else if (item.tags.includes("Pausado")) paused.push(item); else if (item.tags.includes("Cancelado")) cancelled.push(item); else finished.push(item); });
        const sortArray = (arr: TranslationItemData[]) => {
            switch (sortBy) {
                case 'oldest': return [...arr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                case 'title-asc': return [...arr].sort((a, b) => a.title.localeCompare(b.title));
                case 'title-desc': return [...arr].sort((a, b) => b.title.localeCompare(a.title));
                case 'newest': default: return [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            } };
        return { inProgressItems: sortArray(progress), finishedItems: sortArray(finished), pausedItems: sortArray(paused), cancelledItems: sortArray(cancelled) };
     }, [filteredData, sortBy]);

    // --- Event Handlers ---
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(event.target.value); };
    const handleTagClick = (tag: string) => { setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setSortBy(event.target.value as SortOption); };

    // --- Animation Variants ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

    // Simple Spinner Component
    const LoadingSpinner = () => ( <div className="flex justify-center items-center py-20"> <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30 rounded-full" ></motion.div> </div> );

    // Helper function to render tag groups in filters
    const renderFilterTagGroup = (title: string, tags: string[], colorClassActive: string | ((tag: string) => string)) => ( /* ... */
        <fieldset className="mt-4 pt-4 border-t border-gray-700/60 first:mt-0 first:pt-0 first:border-none">
            <legend className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider px-1">{title}</legend>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                    const isActive = selectedTags.includes(tag);
                    let activeClass = '';
                    if (isActive) { activeClass = typeof colorClassActive === 'function' ? colorClassActive(tag) : colorClassActive; }
                    return ( <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${ isActive ? `${activeClass} text-white border-transparent shadow-md scale-105` : 'bg-gray-700/70 text-gray-300 border-gray-600 hover:bg-gray-600/80 hover:border-gray-500 hover:text-white' }`} > {tag} </button> );
                })}
            </div>
        </fieldset>
     );

    // Helper function to render a section grid
    const renderSectionGrid = (title: string, items: TranslationItemData[], icon: React.ReactNode, borderColor: string) => ( /* ... */
        items.length > 0 && (
            <motion.section variants={itemVariants} className="mb-16">
                <div className={`flex items-center mb-8 border-l-4 ${borderColor} pl-4 py-1 bg-gray-800/30 rounded-r-md`}>
                    {icon}
                    <h2 className="text-2xl font-bold text-white tracking-tight"> {title} <span className="text-lg font-medium text-gray-400">({items.length})</span></h2>
                </div>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                    {items.map(item => (
                         <motion.div key={item.id} variants={itemVariants}> <TranslationItemCard item={item} /> </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        )
    );

    return (
        // Changed main wrapper to React.Fragment as motion.div was redundant with containerVariants on inner div
        <>
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Page Title & Description */}
                <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-green-400">Traducciones</motion.h1>
                <motion.p variants={itemVariants} className="text-center text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto"> Explora nuestras últimas traducciones...</motion.p>

                {/* --- Main content area with Sidebar --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

                    {/* --- Main Content Column (Filters + Sections) --- */}
                    <div className="lg:col-span-2">
                        {/* --- Filters, Search, Sort Section --- */}
                        <motion.div variants={itemVariants} className="mb-12 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/80 rounded-xl border border-gray-700/50 shadow-xl backdrop-blur-sm">
                            {/* Search and Sort Row */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 items-end mb-6">
                                {/* Search Input */}
                                <div> <label htmlFor="search-traducciones" className="block text-sm font-medium text-gray-300 mb-1.5">Buscar por Título</label> <div className="relative"> <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> </span> <input type="search" id="search-traducciones" placeholder="Buscar..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 bg-gray-700/60 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" /> </div> </div>
                                {/* Sort Select */}
                                <div> <label htmlFor="sort-traducciones" className="block text-sm font-medium text-gray-300 mb-1.5">Ordenar por</label> <select id="sort-traducciones" value={sortBy} onChange={handleSortChange} className="w-full px-4 py-2 bg-gray-700/60 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-no-repeat bg-right pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }} > <option value="newest">Más Recientes</option> <option value="oldest">Más Antiguos</option> <option value="title-asc">Título (A-Z)</option> <option value="title-desc">Título (Z-A)</option> </select> </div>
                             </div>
                             {/* Filter Tags Section */}
                             <div className="space-y-4">
                                 {renderFilterTagGroup("Categoría Principal", mainCategoryTags, "bg-blue-600")}
                                 {renderFilterTagGroup("Formato", formatTags, "bg-purple-600")}
                                 {renderFilterTagGroup("Estado", statusTags, (tag) => { if (tag === 'En Progreso') return 'bg-yellow-600 text-black'; if (tag === 'Finalizado') return 'bg-green-600'; if (tag === 'Pausado') return 'bg-orange-600'; if (tag === 'Cancelado') return 'bg-red-700'; return 'bg-gray-600'; })}
                                 {/* Clear Filters Button */}
                                 {selectedTags.length > 0 && ( <div className="pt-3 text-right border-t border-gray-700/50 mt-4"> <button onClick={() => { setSelectedTags([]); }} className="px-3 py-1 text-xs rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors" > Limpiar Filtros </button> </div> )}
                             </div>
                        </motion.div>

                        {/* Anchor for scrolling */}
                        <div id="translation-list-start" className="pt-4"></div>

                        {/* --- Loading State or Display Sections --- */}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            filteredData.length === 0 ? (
                                // Empty State Message
                                <motion.div variants={itemVariants} className="text-center text-gray-500 py-16 px-6 bg-gray-800/30 rounded-lg border border-dashed border-gray-700 flex flex-col items-center mt-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" /></svg>
                                    <h3 className="mt-2 text-xl font-semibold text-gray-300">Sin Resultados</h3>
                                    <p className="mt-1 text-sm max-w-sm">No se encontraron traducciones que coincidan con tu búsqueda o filtros.</p>
                                    <button onClick={() => { setSearchTerm(''); setSelectedTags([]); }} className="mt-6 px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors" > Mostrar Todo </button>
                                </motion.div>
                            ) : (
                                // Render ALL filtered & sorted items, grouped
                                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                    {/* Render sections dynamically */}
                                    {renderSectionGrid("En Progreso", inProgressItems, <svg className="h-6 w-6 mr-2 text-yellow-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-yellow-500")}
                                    {renderSectionGrid("Pausado", pausedItems, <svg className="h-6 w-6 mr-2 text-orange-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-orange-500")}
                                    {renderSectionGrid("Finalizado", finishedItems, <svg className="h-6 w-6 mr-2 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, "border-green-500")}
                                    {renderSectionGrid("Cancelado", cancelledItems, <svg className="h-6 w-6 mr-2 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>, "border-red-700")}
                                </motion.div>
                            )
                        )}
                         {/* Pagination Removed */}
                    </div> {/* End Main Content Column */}

                    {/* --- Sidebar Column --- */}
                    <div className="lg:col-span-1 mt-12 lg:mt-0">
                        <Sidebar />
                    </div>

                </div> {/* End Grid Layout */}
            </motion.div>

             {/* Render ScrollToTopButton outside the main page container if needed,
                 or ensure its fixed positioning works correctly within */}
             <ScrollToTopButton />
        </> // Changed main wrapper to React.Fragment
    );
}

export default TraduccionesPage;
