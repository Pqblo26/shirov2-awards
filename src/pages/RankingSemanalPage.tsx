import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import matter from 'gray-matter';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    // DragOverEvent, // No necesitamos DragOver para la lógica principal de mover
    UniqueIdentifier,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import { Download, User, Search, Loader2, GripVertical } from 'lucide-react'; // Añadido GripVertical
import ScrollToTopButton from '../components/ScrollToTopButton';
import { createPortal } from 'react-dom'; // Necesario para DragOverlay

// --- Interfaces ---
interface AnimeData {
    id: UniqueIdentifier; // Usaremos el slug como ID único
    title: string;
    image_horizontal: string;
    season: string;
    year: number;
}

// --- Componente para un Anime Arrastrable ---
interface SortableAnimeItemProps {
    id: UniqueIdentifier;
    anime: AnimeData;
    isOverlay?: boolean;
    isRanked?: boolean;
    rank?: number;
    isDragging?: boolean;
}

function SortableAnimeItem({ id, anime, isOverlay = false, isRanked = false, rank, isDragging }: SortableAnimeItemProps) {
    const {
        attributes,
        listeners, // Aplicar listeners al handle
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging && !isOverlay ? 0.5 : 1,
        cursor: isOverlay ? 'grabbing' : 'grab', // Cambiar cursor en overlay
        boxShadow: isOverlay ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)' : '',
        zIndex: isOverlay ? 999 : 'auto',
    };

    return (
        // Quitar listeners del div principal
        <div ref={setNodeRef} style={style} {...attributes}
             className={`flex items-center p-2 rounded-md transition-colors duration-150 mb-2 relative group ${
                isRanked
                 ? 'bg-gray-700/60 border border-gray-600/50'
                 : 'bg-gray-800/50 hover:bg-gray-700/70 border border-transparent hover:border-cyan-500/50'
             } ${isOverlay ? 'ring-2 ring-cyan-400 shadow-2xl' : ''}`}
        >
             {/* Handle de Arrastre (listeners aquí) */}
             <button {...listeners} className={`absolute ${isRanked ? 'left-1' : '-left-5'} top-1/2 -translate-y-1/2 p-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded z-10`}>
                <GripVertical size={16} />
             </button>

            {/* Número del ranking */}
            {isRanked && rank !== undefined && (
                <span className="text-xl font-bold w-8 text-center ml-4 mr-3 text-cyan-300 flex-shrink-0">{rank + 1}</span>
            )}
            {/* Imagen */}
            <img
                src={anime.image_horizontal}
                alt={`Imagen de ${anime.title}`}
                className={`flex-shrink-0 rounded ${isRanked ? 'w-16 h-10' : 'w-20 h-12'} object-cover ${isRanked ? 'ml-0' : 'ml-6'} mr-3`}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x60/7F1D1D/FECACA?text=Error`; }}
            />
            {/* Título */}
            <span className={`text-sm font-medium flex-grow text-left ${isRanked ? 'text-gray-100' : 'text-gray-200'}`}>{anime.title}</span>
        </div>
    );
}


// --- Componente Principal ---
function RankingSemanalPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allAnime, setAllAnime] = useState<AnimeData[]>([]);
    const [availableAnime, setAvailableAnime] = useState<AnimeData[]>([]);
    const [rankedAnime, setRankedAnime] = useState<AnimeData[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [userName, setUserName] = useState('Anonymous');
    const [searchTerm, setSearchTerm] = useState('');

    const rankingImageRef = useRef<HTMLDivElement>(null);

    const currentSeason = "Invierno"; // TODO: Hacer dinámico
    const currentYear = 2025;       // TODO: Hacer dinámico

    useEffect(() => { document.title = `Ranking Semanal ${currentSeason} ${currentYear} | Shiro Nexus`; }, [currentSeason, currentYear]);

    // Cargar Anime de la Temporada Actual
    useEffect(() => {
        const loadSeasonalAnime = async () => {
            setIsLoading(true); setError(null);
            try {
                const modules = import.meta.glob('/content/seasonal_anime/*.md', { eager: true, query: '?raw', import: 'default' });
                const loadedAnime: AnimeData[] = [];
                for (const path in modules) {
                    const rawContent = modules[path]; if (typeof rawContent !== 'string') continue;
                    try {
                        const { data: frontmatter } = matter(rawContent);
                        if (frontmatter.is_active_for_ranking !== false && frontmatter.season === currentSeason && frontmatter.year === currentYear) {
                            loadedAnime.push({
                                id: frontmatter.slug || path, title: frontmatter.title || 'Sin Título',
                                image_horizontal: frontmatter.image_horizontal || '',
                                season: frontmatter.season, year: frontmatter.year,
                            });
                        }
                    } catch (parseError) { console.error(`Error parsing ${path}:`, parseError); }
                }
                loadedAnime.sort((a, b) => a.title.localeCompare(b.title));
                setAllAnime(loadedAnime); setAvailableAnime(loadedAnime); setRankedAnime([]);
            } catch (err) { console.error("Error loading seasonal anime:", err); setError("Error al cargar los animes."); }
            finally { setIsLoading(false); }
        };
        loadSeasonalAnime();
    }, [currentSeason, currentYear]);

    // Filtrar anime disponible basado en búsqueda
    const filteredAvailableAnime = useMemo(() => {
        return availableAnime.filter(anime => anime.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [availableAnime, searchTerm]);

    // --- Lógica de Drag and Drop (Revisada) ---
    const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );

    const handleDragStart = (event: DragStartEvent) => { setActiveId(event.active.id); };

    // Helper para encontrar contenedor (incluye contenedores droppables)
    const findContainer = (id: UniqueIdentifier | null): 'ranked' | 'available' | null => {
        if (!id) return null;
        if (id === 'ranked-container' || rankedAnime.some(item => item.id === id)) return 'ranked';
        if (id === 'available-container' || availableAnime.some(item => item.id === id)) return 'available';
        return null;
    };

    // --- handleDragOver simplificado o eliminado si no se usa ---
    // const handleDragOver = (event: DragOverEvent) => { ... };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) { console.log("DragEnd: Dropped outside"); return; }

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId); // Puede ser 'ranked', 'available', o null si es sobre un placeholder

        console.log(`DragEnd: Active ${activeId} (${activeContainer}) -> Over ${overId} (${overContainer})`);

        if (!activeContainer) { console.log("DragEnd: Could not determine active container."); return; }

        // --- Caso 1: Mover dentro del mismo contenedor (Reordenar) ---
        if (activeContainer === overContainer && overContainer !== null) {
            if (activeId !== overId) {
                if (activeContainer === 'ranked') {
                    const oldIndex = rankedAnime.findIndex(item => item.id === activeId);
                    // Si overId es el contenedor, newIndex será el final. Si es un item, su índice.
                    const newIndex = overId === 'ranked-container' ? rankedAnime.length -1 : rankedAnime.findIndex(item => item.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        console.log(`Reordering in ranked: ${oldIndex} -> ${newIndex}`);
                        setRankedAnime(prev => arrayMove(prev, oldIndex, newIndex));
                    } else {
                         console.log("Reordering in ranked: Invalid index found.");
                    }
                } else if (activeContainer === 'available') {
                     // Usar el array original 'availableAnime' para reordenar
                     const oldIndex = availableAnime.findIndex(item => item.id === activeId);
                     const newIndex = overId === 'available-container' ? availableAnime.length -1 : availableAnime.findIndex(item => item.id === overId);
                     if (oldIndex !== -1 && newIndex !== -1) {
                        console.log(`Reordering in available: ${oldIndex} -> ${newIndex}`);
                        setAvailableAnime(prev => arrayMove(prev, oldIndex, newIndex));
                     } else {
                         console.log("Reordering in available: Invalid index found.");
                     }
                }
            } else { console.log("DragEnd: Dropped on self."); }
        }
        // --- Caso 2: Mover ENTRE contenedores ---
        else if (activeContainer !== overContainer && overContainer !== null) {
            if (activeContainer === 'available' && overContainer === 'ranked') {
                // Mover de Available a Ranked
                if (rankedAnime.length < 10) {
                    const activeIndex = availableAnime.findIndex(item => item.id === activeId);
                    if (activeIndex === -1) { console.log("Move Error: Active item not found in available"); return; }
                    const itemToMove = availableAnime[activeIndex];

                    const newIndex = overId === 'ranked-container' ? rankedAnime.length : rankedAnime.findIndex(item => item.id === overId);
                     if (newIndex === -1 && overId !== 'ranked-container') {
                         console.log("Move Error: Target item not found in ranked list.");
                         return;
                     }

                    console.log(`Moving ${activeId} from available to ranked at index ${newIndex}`);
                    setAvailableAnime(prev => prev.filter(item => item.id !== activeId));
                    setRankedAnime(prev => {
                        const insertIndex = newIndex === rankedAnime.length ? newIndex : (newIndex < 0 ? 0 : newIndex); // Handle -1 for dropping on container
                        return [...prev.slice(0, insertIndex), itemToMove, ...prev.slice(insertIndex)];
                    });

                } else { console.log("Ranked list is full."); }
            } else if (activeContainer === 'ranked' && overContainer === 'available') {
                // Mover de Ranked a Available
                const activeIndex = rankedAnime.findIndex(item => item.id === activeId);
                if (activeIndex === -1) { console.log("Move Error: Active item not found in ranked"); return; }
                const itemToMove = rankedAnime[activeIndex];

                const newIndex = overId === 'available-container' ? availableAnime.length : availableAnime.findIndex(item => item.id === overId);
                 if (newIndex === -1 && overId !== 'available-container') {
                     console.log("Move Error: Target item not found in available list.");
                     return;
                 }

                console.log(`Moving ${activeId} from ranked to available at index ${newIndex}`);
                setRankedAnime(prev => prev.filter(item => item.id !== activeId));
                 setAvailableAnime(prev => {
                     const insertIndex = newIndex === availableAnime.length ? newIndex : (newIndex < 0 ? 0 : newIndex); // Handle -1 for dropping on container
                     return [...prev.slice(0, insertIndex), itemToMove, ...prev.slice(insertIndex)];
                 });
            }
        } else {
             console.log("DragEnd: Invalid container combination or drop outside.");
        }
    };
    // --- FIN Lógica Drag and Drop ---


    // --- Función para Descargar Imagen ---
    const handleDownloadImage = useCallback(() => {
        const element = rankingImageRef.current;
        if (element) {
            html2canvas(element, { backgroundColor: '#111827', useCORS: true, scale: 2 })
                .then(canvas => {
                    const link = document.createElement('a');
                    link.download = `shiro-nexus-ranking-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(err => { console.error("Error generating image:", err); alert("Error al generar la imagen."); });
        }
    }, [userName]);

    // --- Renderizado ---
    if (isLoading) return <LoadingIndicator />;
    if (error) return <ErrorIndicator message={error} />;

    const activeAnime = activeId ? allAnime.find(item => item.id === activeId) : null;

    const dropAnimation: DropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} /* onDragOver quitado */ >
            <div className="min-h-screen bg-gray-950 text-gray-200 px-4 py-8 md:py-16">
                <motion.h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    Crea tu Ranking Semanal - {currentSeason} {currentYear}
                </motion.h1>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Animes Disponibles */}
                    <motion.div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Animes Disponibles</h2>
                        <div className="relative mb-4"> {/* Barra de Búsqueda */}
                            <input type="text" placeholder="Buscar anime..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500" />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        {/* Lista de Animes Disponibles */}
                        <div className="max-h-[70vh] overflow-y-auto pr-2" id="available-container"> {/* ID Contenedor */}
                            <SortableContext items={filteredAvailableAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                {filteredAvailableAnime.length > 0 ? (
                                    filteredAvailableAnime.map(anime => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isDragging={activeId === anime.id} /> ))
                                ) : ( <p className="text-center text-gray-500 italic py-4"> {availableAnime.length > 0 ? 'No se encontraron animes.' : 'No hay animes disponibles.'} </p> )}
                            </SortableContext>
                        </div>
                    </motion.div>

                    {/* Columna Derecha: Ranking Top 10 */}
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <div ref={rankingImageRef} id="rankingImage" className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                            {/* Cabecera del Ranking */}
                            <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-3">
                                <div className="flex items-center gap-3">
                                     <img src="https://placehold.co/40x40/1F2937/4B5563?text=SN" alt="Logo Shiro Nexus" className="h-8 w-8 rounded-full"/>
                                     <div>
                                        <h2 className="text-lg font-bold text-white">MY TOP 10 ANIME RANKINGS</h2>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{currentSeason.toUpperCase()} {currentYear} | COMMUNITY ANIME RANKINGS</p>
                                     </div>
                                </div>
                                <span className="text-sm font-semibold text-cyan-400">Shiro Nexus</span>
                            </div>
                            {/* Lista del Ranking */}
                            <div className="min-h-[60vh]" id="ranked-container"> {/* ID Contenedor */}
                                <SortableContext items={rankedAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    {rankedAnime.map((anime, index) => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isRanked={true} rank={index} isDragging={activeId === anime.id} /> ))}
                                     {Array.from({ length: Math.max(0, 10 - rankedAnime.length) }).map((_, index) => ( <div key={`placeholder-${index}`} className="flex items-center p-2 rounded-md mb-2 bg-gray-700/30 border border-dashed border-gray-600/50 h-[52px]"> <span className="text-xl font-bold w-8 text-center mr-3 text-gray-500">{rankedAnime.length + index + 1}</span> <span className="text-sm text-gray-600 italic">Arrastra un anime aquí</span> </div> ))}
                                </SortableContext>
                            </div>
                            {/* Pie del Ranking */}
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-600 text-xs text-gray-500">
                                <span>This list was created by <span className="font-semibold text-gray-400">{userName}</span></span>
                                <span>Create your own list on shironexus.vercel.app</span>
                            </div>
                        </div>
                        {/* Controles de Descarga */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                            <div className="relative flex-grow w-full sm:w-auto">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" placeholder="Tu nombre (Opcional)" value={userName} onChange={(e) => setUserName(e.target.value || 'Anonymous')} className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <button onClick={handleDownloadImage} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors">
                                <Download size={16} /> Descargar Ranking
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Drag Overlay */}
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeId && activeAnime ? (
                            // Pasamos el estado isDragging como true al overlay para que no se vea semitransparente
                            <SortableAnimeItem id={activeId} anime={activeAnime} isOverlay isRanked={findContainer(activeId) === 'ranked'} isDragging={false} />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}

                <ScrollToTopButton />
            </div>
        </DndContext>
    );
}

// --- Loading/Error Components ---
const LoadingIndicator = () => <div className="flex justify-center items-center min-h-[50vh]"><Loader2 size={48} className="animate-spin text-cyan-500" /></div>;
const ErrorIndicator = ({ message }: { message: string | null }) => <div className="text-center py-20 text-red-400">{message || "Error al cargar."}</div>;


export default RankingSemanalPage;
