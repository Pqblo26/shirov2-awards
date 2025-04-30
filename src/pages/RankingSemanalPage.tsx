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
    UniqueIdentifier,
    DragOverlay,
    defaultDropAnimationSideEffects, // Importar para dropAnimation
    DropAnimation,
    useDroppable, // Importar useDroppable
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
import { Download, User, Search, Loader2, GripVertical } from 'lucide-react'; // Asegurarse que GripVertical está si se usa handle
import ScrollToTopButton from '../components/ScrollToTopButton';
import { createPortal } from 'react-dom';

// --- Interfaces ---
interface AnimeData {
    id: UniqueIdentifier;
    title: string;
    image_horizontal: string;
    season: string;
    year: number;
}

// --- Componente para un Anime Arrastrable (Restaurado) ---
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
        listeners, // Aplicar al div principal
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging && !isOverlay ? 0.5 : 1,
        cursor: isOverlay ? 'grabbing' : 'grab',
        boxShadow: isOverlay ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)' : '',
        zIndex: isOverlay ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className={`flex items-center p-2 rounded-md transition-colors duration-150 mb-2 relative group ${
                isRanked
                 ? 'bg-gray-700/60 border border-gray-600/50'
                 : 'bg-gray-800/50 hover:bg-gray-700/70 border border-transparent hover:border-cyan-500/50'
             } ${isOverlay ? 'ring-2 ring-cyan-400 shadow-2xl' : ''}`}
        >
            {/* Handle Opcional (Comentado) */}
            {/* <button {...listeners} className={`absolute ${isRanked ? 'left-1' : '-left-5'} ...`}><GripVertical size={16} /></button> */}
            {isRanked && rank !== undefined && (
                <span className="text-xl font-bold w-8 text-center mr-3 text-cyan-300 flex-shrink-0">{rank + 1}</span>
            )}
            <img
                src={anime.image_horizontal}
                alt={`Imagen de ${anime.title}`}
                className={`flex-shrink-0 rounded ${isRanked ? 'w-16 h-10' : 'w-20 h-12'} object-cover mr-3`}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x60/7F1D1D/FECACA?text=Error`; }}
            />
            <span className={`text-sm font-medium flex-grow text-left ${isRanked ? 'text-gray-100' : 'text-gray-200'}`}>{anime.title}</span>
        </div>
    );
}

// --- Componente Contenedor Droppable (Necesario) ---
interface DroppableContainerProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

function DroppableContainer({ id, children, className }: DroppableContainerProps) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const containerStyle: React.CSSProperties = {
        border: isOver ? '2px dashed #63b3ed' : '2px dashed transparent', // Borde visual opcional al pasar por encima
        padding: '1px', // Evitar colapso de borde
        borderRadius: '8px',
        transition: 'border-color 0.2s ease-in-out',
    };
    return ( <div ref={setNodeRef} style={containerStyle} className={className}> {children} </div> );
}


// --- Componente Principal ---
function RankingSemanalPage() {
    // --- Estados Restaurados ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allAnime, setAllAnime] = useState<AnimeData[]>([]); // Lista completa para buscar en overlay
    const [availableAnime, setAvailableAnime] = useState<AnimeData[]>([]); // Lista izquierda
    const [rankedAnime, setRankedAnime] = useState<AnimeData[]>([]); // Lista derecha (Top 10)
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // ID del item arrastrándose
    const [userName, setUserName] = useState('Anonymous');
    const [searchTerm, setSearchTerm] = useState('');
    const rankingImageRef = useRef<HTMLDivElement>(null);
    const currentSeason = "Invierno";
    const currentYear = 2025;

    // --- Effects Restaurados ---
    useEffect(() => { document.title = `Ranking Semanal ${currentSeason} ${currentYear} | Shiro Nexus`; }, [currentSeason, currentYear]);

    useEffect(() => { // Cargar Anime de la Temporada Actual
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
                setAllAnime(loadedAnime); // Guardar todos para el overlay
                setAvailableAnime(loadedAnime); // Inicialmente todos disponibles
                setRankedAnime([]); // Ranking vacío
            } catch (err) { console.error("Error loading seasonal anime:", err); setError("Error al cargar los animes."); }
            finally { setIsLoading(false); }
        };
        loadSeasonalAnime();
    }, [currentSeason, currentYear]);

    // Filtrar anime disponible basado en búsqueda
    const filteredAvailableAnime = useMemo(() => {
        return availableAnime.filter(anime => anime.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [availableAnime, searchTerm]);

    // --- Lógica de Drag and Drop (Basada en la prueba simple funcional) ---
    const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );

    const handleDragStart = (event: DragStartEvent) => { setActiveId(event.active.id); };

    // Helper para encontrar contenedor (Usa los arrays de estado reales)
    const findContainer = (id: UniqueIdentifier | null): 'ranked' | 'available' | null => {
        if (!id) return null;
        if (id === 'ranked-container' || rankedAnime.some(item => item.id === id)) return 'ranked';
        if (id === 'available-container' || availableAnime.some(item => item.id === id)) return 'available';
        return null;
    };

    // handleDragEnd (Lógica adaptada de la prueba simple)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        console.log(`DragEnd: Active ${activeId} (${activeContainer}) -> Over ${overId} (${overContainer})`);

        if (!activeContainer || !overContainer) return;

        // --- Caso 1: Mover dentro del mismo contenedor (Reordenar) ---
        if (activeContainer === overContainer) {
            if (activeId !== overId) {
                if (activeContainer === 'ranked') {
                    const oldIndex = rankedAnime.findIndex(item => item.id === activeId);
                    const newIndex = overId === 'ranked-container' ? oldIndex : rankedAnime.findIndex(item => item.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        setRankedAnime(prev => arrayMove(prev, oldIndex, newIndex));
                    }
                } else { // activeContainer === 'available'
                     const oldIndex = availableAnime.findIndex(item => item.id === activeId);
                     const newIndex = overId === 'available-container' ? oldIndex : availableAnime.findIndex(item => item.id === overId);
                     if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        setAvailableAnime(prev => arrayMove(prev, oldIndex, newIndex));
                     }
                }
            }
        }
        // --- Caso 2: Mover ENTRE contenedores ---
        else {
            let itemToMove: AnimeData | undefined;
            let oldIndex: number = -1;
            let newIndex: number = -1;

            if (activeContainer === 'available' && overContainer === 'ranked') {
                if (rankedAnime.length >= 10) { console.log("Ranked list full"); return; }
                oldIndex = availableAnime.findIndex(item => item.id === activeId);
                if (oldIndex === -1) return;
                itemToMove = availableAnime[oldIndex];
                newIndex = overId === 'ranked-container' ? rankedAnime.length : rankedAnime.findIndex(item => item.id === overId);
                if (newIndex === -1 && overId !== 'ranked-container') return;
                const insertIndex = newIndex === -1 ? rankedAnime.length : newIndex;

                setAvailableAnime(prev => prev.filter(item => item.id !== activeId));
                setRankedAnime(prev => [...prev.slice(0, insertIndex), itemToMove as AnimeData, ...prev.slice(insertIndex)]);

            } else if (activeContainer === 'ranked' && overContainer === 'available') {
                oldIndex = rankedAnime.findIndex(item => item.id === activeId);
                if (oldIndex === -1) return;
                itemToMove = rankedAnime[oldIndex];
                newIndex = overId === 'available-container' ? availableAnime.length : availableAnime.findIndex(item => item.id === overId);
                if (newIndex === -1 && overId !== 'available-container') return;
                const insertIndex = newIndex === -1 ? availableAnime.length : newIndex;

                setRankedAnime(prev => prev.filter(item => item.id !== activeId));
                setAvailableAnime(prev => [...prev.slice(0, insertIndex), itemToMove as AnimeData, ...prev.slice(insertIndex)]);
            }
        }
    };
    // --- FIN Lógica Drag and Drop ---


    // --- Función para Descargar Imagen ---
    const handleDownloadImage = useCallback(() => { /* ... sin cambios ... */ }, [userName]);

    // --- Renderizado ---
    if (isLoading) return <LoadingIndicator />;
    if (error) return <ErrorIndicator message={error} />;

    // Encontrar el anime activo completo para el overlay
    const activeAnime = activeId ? (availableAnime.find(item => item.id === activeId) || rankedAnime.find(item => item.id === activeId)) : null;

    const dropAnimation: DropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

                        {/* Lista de Animes Disponibles - Envuelto en DroppableContainer */}
                        <DroppableContainer id="available-container" className="max-h-[70vh] overflow-y-auto pr-2 space-y-2"> {/* Añadido space-y-2 */}
                            <SortableContext items={filteredAvailableAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                {filteredAvailableAnime.length > 0 ? (
                                    filteredAvailableAnime.map(anime => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isDragging={activeId === anime.id} /> ))
                                ) : ( <p className="text-center text-gray-500 italic py-4"> {availableAnime.length > 0 ? 'No se encontraron animes.' : 'No hay animes disponibles.'} </p> )}
                            </SortableContext>
                        </DroppableContainer>
                    </motion.div>

                    {/* Columna Derecha: Ranking Top 10 */}
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        {/* Div que se capturará para la imagen */}
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
                            {/* Fin Cabecera */}

                            {/* Lista del Ranking - Envuelto en DroppableContainer */}
                            <DroppableContainer id="ranked-container" className="min-h-[60vh] space-y-2"> {/* Añadido space-y-2 */}
                                <SortableContext items={rankedAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    {rankedAnime.map((anime, index) => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isRanked={true} rank={index} isDragging={activeId === anime.id} /> ))}
                                     {Array.from({ length: Math.max(0, 10 - rankedAnime.length) }).map((_, index) => ( <div key={`placeholder-${index}`} className="flex items-center p-2 rounded-md mb-2 bg-gray-700/30 border border-dashed border-gray-600/50 h-[52px]"> <span className="text-xl font-bold w-8 text-center mr-3 text-gray-500">{rankedAnime.length + index + 1}</span> <span className="text-sm text-gray-600 italic">Arrastra un anime aquí</span> </div> ))}
                                </SortableContext>
                            </DroppableContainer>
                             {/* Fin Lista */}
                            {/* Pie del Ranking */}
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-600 text-xs text-gray-500">
                                <span>This list was created by <span className="font-semibold text-gray-400">{userName}</span></span>
                                <span>Create your own list on shironexus.vercel.app</span>
                            </div>
                             {/* Fin Pie */}
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
                         {/* Fin Controles */}
                    </motion.div>
                </div>

                {/* Drag Overlay */}
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeId && activeAnime ? (
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
