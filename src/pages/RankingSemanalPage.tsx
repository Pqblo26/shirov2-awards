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
    DragOverEvent,
    UniqueIdentifier,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
    MeasuringStrategy, // Importar estrategia de medición
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
import { Download, User, Search, Loader2, GripVertical } from 'lucide-react';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { createPortal } from 'react-dom';

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
        listeners,
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
        <div ref={setNodeRef} style={style}
             className={`flex items-center p-2 rounded-md transition-colors duration-150 mb-2 relative group ${
                isRanked
                 ? 'bg-gray-700/60 border border-gray-600/50'
                 : 'bg-gray-800/50 hover:bg-gray-700/70 border border-transparent hover:border-cyan-500/50'
             } ${isOverlay ? 'ring-2 ring-cyan-400 shadow-2xl' : ''}`}
             {...attributes} // Mover attributes aquí para que apliquen a todo el div
        >
             {/* Handle de Arrastre (listeners aquí) */}
             <button {...listeners} className={`absolute ${isRanked ? 'left-1' : '-left-5'} top-1/2 -translate-y-1/2 p-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded z-10`}> {/* Añadido z-10 */}
                <GripVertical size={16} />
             </button>

            {/* Número del ranking */}
            {isRanked && rank !== undefined && (
                <span className="text-xl font-bold w-8 text-center ml-4 mr-3 text-cyan-300 flex-shrink-0">{rank + 1}</span> // Añadido flex-shrink-0
            )}
            {/* Imagen */}
            <img
                src={anime.image_horizontal}
                alt={`Imagen de ${anime.title}`}
                // Ajustar margen izquierdo si no está rankeado para dejar espacio al handle
                className={`flex-shrink-0 rounded ${isRanked ? 'w-16 h-10' : 'w-20 h-12'} object-cover ${isRanked ? 'ml-0' : 'ml-6'} mr-3`}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x60/7F1D1D/FECACA?text=Error`; }}
            />
            {/* Título (permitir que ocupe espacio restante) */}
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
    useEffect(() => { /* ... Load seasonal anime ... */ }, [currentSeason, currentYear]);

    // Filtrar anime disponible basado en búsqueda
    const filteredAvailableAnime = useMemo(() => { /* ... */ }, [availableAnime, searchTerm]);

    // --- Lógica de Drag and Drop (Revisada) ---
    const sensors = useSensors( useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) );

    const handleDragStart = (event: DragStartEvent) => { setActiveId(event.active.id); };

    // Helper para encontrar contenedor
    const findContainer = (id: UniqueIdentifier): 'ranked' | 'available' | null => {
        if (rankedAnime.some(item => item.id === id)) return 'ranked';
        if (availableAnime.some(item => item.id === id)) return 'available';
        // Comprobar si el ID es el de los contenedores droppables
        if (id === 'ranked-container' || rankedAnime.some(item => item.id === id)) return 'ranked';
        if (id === 'available-container' || availableAnime.some(item => item.id === id)) return 'available';
        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null); // Limpiar item activo

        if (!over) return; // Si se suelta fuera

        const activeId = active.id;
        const overId = over.id; // Puede ser el ID de un item o del contenedor

        const activeContainer = findContainer(activeId);
        // Determinar el contenedor de destino (si es un item, usar su contenedor; si es el contenedor, usarlo directamente)
        const overContainer = findContainer(overId);

        console.log(`Drag End: Active ${activeId} (${activeContainer}) -> Over ${overId} (${overContainer})`);


        if (!activeContainer || !overContainer) {
            console.log("Drag End: Could not determine containers.");
            return; // No se pudo determinar origen o destino
        }

        // --- Caso 1: Mover dentro del mismo contenedor (Reordenar) ---
        if (activeContainer === overContainer) {
            if (activeId !== overId) { // Asegurarse de que no se soltó sobre sí mismo
                if (activeContainer === 'ranked') {
                    const oldIndex = rankedAnime.findIndex(item => item.id === activeId);
                    // Si overId es el contenedor, newIndex será el final. Si es un item, su índice.
                    const newIndex = overId === 'ranked-container' ? rankedAnime.length -1 : rankedAnime.findIndex(item => item.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1) {
                        console.log(`Reordering in ranked: ${oldIndex} -> ${newIndex}`);
                        setRankedAnime(prev => arrayMove(prev, oldIndex, newIndex));
                    }
                } else if (activeContainer === 'available') {
                    // Usar el array original 'availableAnime' para reordenar
                     const oldIndex = availableAnime.findIndex(item => item.id === activeId);
                     const newIndex = overId === 'available-container' ? availableAnime.length -1 : availableAnime.findIndex(item => item.id === overId);
                     if (oldIndex !== -1 && newIndex !== -1) {
                        console.log(`Reordering in available: ${oldIndex} -> ${newIndex}`);
                        setAvailableAnime(prev => arrayMove(prev, oldIndex, newIndex));
                     }
                }
            }
        }
        // --- Caso 2: Mover ENTRE contenedores ---
        else {
            if (activeContainer === 'available' && overContainer === 'ranked') {
                // Mover de Available a Ranked
                if (rankedAnime.length < 10) {
                    const activeIndex = availableAnime.findIndex(item => item.id === activeId);
                    if (activeIndex === -1) return; // Item no encontrado
                    const itemToMove = availableAnime[activeIndex];

                    const newIndex = overId === 'ranked-container' ? rankedAnime.length : rankedAnime.findIndex(item => item.id === overId);
                    if (newIndex === -1 && overId !== 'ranked-container') return; // Si overId no es un item ni el contenedor

                    console.log(`Moving ${activeId} from available to ranked at index ${newIndex}`);
                    setAvailableAnime(prev => prev.filter(item => item.id !== activeId));
                    setRankedAnime(prev => [...prev.slice(0, newIndex), itemToMove, ...prev.slice(newIndex)]);
                } else {
                    console.log("Ranked list is full.");
                }
            } else if (activeContainer === 'ranked' && overContainer === 'available') {
                // Mover de Ranked a Available
                const activeIndex = rankedAnime.findIndex(item => item.id === activeId);
                if (activeIndex === -1) return; // Item no encontrado
                const itemToMove = rankedAnime[activeIndex];

                // Encontrar dónde insertarlo en available (podría ser al final o donde estaba el cursor)
                const newIndex = overId === 'available-container' ? availableAnime.length : availableAnime.findIndex(item => item.id === overId);
                if (newIndex === -1 && overId !== 'available-container') return; // Si overId no es un item ni el contenedor

                console.log(`Moving ${activeId} from ranked to available at index ${newIndex}`);
                setRankedAnime(prev => prev.filter(item => item.id !== activeId));
                setAvailableAnime(prev => [...prev.slice(0, newIndex), itemToMove, ...prev.slice(newIndex)]);
            }
        }
    };
    // --- FIN Lógica Drag and Drop ---


    // --- Función para Descargar Imagen ---
    const handleDownloadImage = useCallback(() => { /* ... sin cambios ... */ }, [userName]);

    // --- Renderizado ---
    if (isLoading) return <LoadingIndicator />;
    if (error) return <ErrorIndicator message={error} />;

    const activeAnime = activeId ? allAnime.find(item => item.id === activeId) : null;

    const dropAnimation: DropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <div className="min-h-screen bg-gray-950 text-gray-200 px-4 py-8 md:py-16">
                <motion.h1 /* ... Título ... */ > Crea tu Ranking Semanal - {currentSeason} {currentYear} </motion.h1>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Animes Disponibles */}
                    <motion.div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Animes Disponibles</h2>
                        <div className="relative mb-4"> {/* Barra de Búsqueda */}
                            <input /* ... */ /> <Search /* ... */ />
                        </div>
                        {/* Lista de Animes Disponibles */}
                        {/* --- Añadido ID al contenedor --- */}
                        <div className="max-h-[70vh] overflow-y-auto pr-2" id="available-container">
                            <SortableContext items={filteredAvailableAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                {filteredAvailableAnime.length > 0 ? (
                                    filteredAvailableAnime.map(anime => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isDragging={activeId === anime.id} /> ))
                                ) : ( <p /* ... */ > {availableAnime.length > 0 ? 'No se encontraron animes.' : 'No hay animes disponibles.'} </p> )}
                            </SortableContext>
                        </div>
                    </motion.div>

                    {/* Columna Derecha: Ranking Top 10 */}
                    <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <div ref={rankingImageRef} id="rankingImage" className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                            {/* Cabecera del Ranking */}
                            <div /* ... */ >{/* ... */}</div>
                            {/* Lista del Ranking */}
                             {/* --- Añadido ID al contenedor --- */}
                            <div className="min-h-[60vh]" id="ranked-container">
                                <SortableContext items={rankedAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    {rankedAnime.map((anime, index) => ( <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isRanked={true} rank={index} isDragging={activeId === anime.id} /> ))}
                                     {Array.from({ length: Math.max(0, 10 - rankedAnime.length) }).map((_, index) => ( <div key={`placeholder-${index}`} /* ... Placeholder ... */ > {/* ... */} </div> ))}
                                </SortableContext>
                            </div>
                            {/* Pie del Ranking */}
                            <div /* ... */ >{/* ... */}</div>
                        </div>
                        {/* Controles de Descarga */}
                        <div /* ... */ >{/* ... */}</div>
                    </motion.div>
                </div>

                {/* Drag Overlay */}
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeId && activeAnime ? (
                            <SortableAnimeItem id={activeId} anime={activeAnime} isOverlay isRanked={findContainer(activeId) === 'ranked'} />
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
