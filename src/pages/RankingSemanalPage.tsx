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
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy, // Para la lista de ranking
    rectSortingStrategy, // Para la lista de disponibles (puede ser grid)
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import { Download, User, Search } from 'lucide-react'; // Icons
import ScrollToTopButton from '../components/ScrollToTopButton';

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
    isOverlay?: boolean; // Para el drag overlay
    isRanked?: boolean; // Estilo diferente si está en el ranking
    rank?: number; // Número del ranking si aplica
}

function SortableAnimeItem({ id, anime, isOverlay = false, isRanked = false, rank }: SortableAnimeItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging || isOverlay ? 10 : 1, // Poner encima al arrastrar
        cursor: isOverlay ? 'grabbing' : 'grab',
        boxShadow: isOverlay ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)' : '',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className={`flex items-center p-2 rounded-md transition-colors duration-150 mb-2 ${
                isRanked
                 ? 'bg-gray-700/60 border border-gray-600/50' // Estilo en ranking
                 : 'bg-gray-800/50 hover:bg-gray-700/70 border border-transparent hover:border-cyan-500/50' // Estilo en lista disponible
             } ${isOverlay ? 'ring-2 ring-cyan-400' : ''}`}
        >
            {/* Número del ranking si aplica */}
            {isRanked && rank !== undefined && (
                <span className="text-xl font-bold w-8 text-center mr-3 text-cyan-300">{rank + 1}</span>
            )}
            {/* Imagen */}
            <img
                src={anime.image_horizontal}
                alt={`Imagen de ${anime.title}`}
                className={`flex-shrink-0 rounded ${isRanked ? 'w-16 h-10' : 'w-20 h-12'} object-cover mr-3`} // Tamaño diferente
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x60/7F1D1D/FECACA?text=Error`; }}
            />
            {/* Título */}
            <span className={`text-sm font-medium ${isRanked ? 'text-gray-100' : 'text-gray-200'}`}>{anime.title}</span>
        </div>
    );
}


// --- Componente Principal ---
function RankingSemanalPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allAnime, setAllAnime] = useState<AnimeData[]>([]); // Todos los anime cargados
    const [availableAnime, setAvailableAnime] = useState<AnimeData[]>([]); // Anime no rankeados
    const [rankedAnime, setRankedAnime] = useState<AnimeData[]>([]); // Anime en el Top 10
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // ID del item arrastrándose
    const [userName, setUserName] = useState('Anonymous'); // Nombre del usuario
    const [searchTerm, setSearchTerm] = useState(''); // Para búsqueda

    const rankingImageRef = useRef<HTMLDivElement>(null); // Ref para el div a capturar

    const currentSeason = "Invierno"; // TODO: Hacer esto dinámico o seleccionable
    const currentYear = 2025;       // TODO: Hacer esto dinámico o seleccionable

    useEffect(() => {
        document.title = `Ranking Semanal ${currentSeason} ${currentYear} | Shiro Nexus`;
    }, [currentSeason, currentYear]);

    // --- Cargar Anime de la Temporada Actual ---
    useEffect(() => {
        const loadSeasonalAnime = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const modules = import.meta.glob('/content/seasonal_anime/*.md', { eager: true, query: '?raw', import: 'default' });
                const loadedAnime: AnimeData[] = [];
                for (const path in modules) {
                    const rawContent = modules[path];
                    if (typeof rawContent !== 'string') continue;
                    try {
                        const { data: frontmatter } = matter(rawContent);
                        // Filtrar por temporada y año actual y si está activo
                        if (frontmatter.is_active_for_ranking !== false &&
                            frontmatter.season === currentSeason &&
                            frontmatter.year === currentYear)
                        {
                            loadedAnime.push({
                                id: frontmatter.slug || path, // Usar slug como ID
                                title: frontmatter.title || 'Sin Título',
                                image_horizontal: frontmatter.image_horizontal || '',
                                season: frontmatter.season,
                                year: frontmatter.year,
                            });
                        }
                    } catch (parseError) { console.error(`Error parsing ${path}:`, parseError); }
                }
                setAllAnime(loadedAnime);
                setAvailableAnime(loadedAnime); // Inicialmente todos están disponibles
                setRankedAnime([]); // Ranking vacío al inicio
            } catch (err) {
                console.error("Error loading seasonal anime:", err);
                setError("Error al cargar los animes de la temporada.");
            } finally {
                setIsLoading(false);
            }
        };
        loadSeasonalAnime();
    }, [currentSeason, currentYear]); // Recargar si cambia temporada/año

    // --- Filtrar anime disponible basado en búsqueda ---
    const filteredAvailableAnime = useMemo(() => {
        return availableAnime.filter(anime =>
            anime.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableAnime, searchTerm]);

    // --- Lógica de Drag and Drop (dnd-kit) ---
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Mover item entre contenedores
        if (activeContainer === 'available' && overContainer === 'ranked' && rankedAnime.length < 10) {
            const activeIndex = availableAnime.findIndex(item => item.id === active.id);
            const overIndex = rankedAnime.findIndex(item => item.id === over.id); // Puede ser -1 si se suelta sobre el área
            const itemToMove = availableAnime[activeIndex];

            setAvailableAnime(prev => prev.filter(item => item.id !== active.id));
            setRankedAnime(prev => {
                const newIndex = overIndex >= 0 ? overIndex : prev.length;
                return [...prev.slice(0, newIndex), itemToMove, ...prev.slice(newIndex)];
            });
        } else if (activeContainer === 'ranked' && overContainer === 'available') {
             const activeIndex = rankedAnime.findIndex(item => item.id === active.id);
             // No necesitamos overIndex aquí, simplemente lo añadimos al final de available
             const itemToMove = rankedAnime[activeIndex];

             setRankedAnime(prev => prev.filter(item => item.id !== active.id));
             setAvailableAnime(prev => [...prev, itemToMove]); // Añadir al final
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const activeContainer = findContainer(active.id);
            const overContainer = findContainer(over.id);

            if (activeContainer === overContainer) {
                // Reordenar dentro del mismo contenedor
                if (activeContainer === 'ranked') {
                    const oldIndex = rankedAnime.findIndex(item => item.id === active.id);
                    const newIndex = rankedAnime.findIndex(item => item.id === over.id);
                    if (oldIndex !== newIndex) {
                        setRankedAnime(prev => arrayMove(prev, oldIndex, newIndex));
                    }
                } else if (activeContainer === 'available') {
                    // Reordenar en available (usar filteredAvailableAnime para índices correctos si hay filtro)
                     const oldIndex = filteredAvailableAnime.findIndex(item => item.id === active.id);
                     const newIndex = filteredAvailableAnime.findIndex(item => item.id === over.id);
                     if (oldIndex !== newIndex) {
                         // Mover en el array original 'availableAnime' basado en los índices filtrados
                         const originalOldIndex = availableAnime.findIndex(item => item.id === active.id);
                         const originalNewIndex = availableAnime.findIndex(item => item.id === over.id);
                         setAvailableAnime(prev => arrayMove(prev, originalOldIndex, originalNewIndex));
                     }
                }
            } else {
                 // El movimiento entre contenedores ya se manejó en handleDragOver
                 // Pero si se suelta sobre un área vacía del contenedor destino:
                 if (activeContainer === 'available' && overContainer === 'ranked' && rankedAnime.length < 10) {
                     // Si se soltó sobre el contenedor 'ranked' pero no sobre un item específico
                     // (ya debería haberse movido en handleDragOver, pero por si acaso)
                     if (!rankedAnime.some(item => item.id === active.id)) {
                         const activeIndex = availableAnime.findIndex(item => item.id === active.id);
                         const itemToMove = availableAnime[activeIndex];
                         setAvailableAnime(prev => prev.filter(item => item.id !== active.id));
                         setRankedAnime(prev => [...prev, itemToMove]); // Añadir al final
                     }
                 } else if (activeContainer === 'ranked' && overContainer === 'available') {
                      if (!availableAnime.some(item => item.id === active.id)) {
                         const activeIndex = rankedAnime.findIndex(item => item.id === active.id);
                         const itemToMove = rankedAnime[activeIndex];
                         setRankedAnime(prev => prev.filter(item => item.id !== active.id));
                         setAvailableAnime(prev => [...prev, itemToMove]);
                     }
                 }
            }
        }
    };

    // Helper para encontrar en qué contenedor está un item
    const findContainer = (id: UniqueIdentifier) => {
        if (rankedAnime.some(item => item.id === id)) return 'ranked';
        if (availableAnime.some(item => item.id === id)) return 'available';
        return null;
    };

    // --- Función para Descargar Imagen ---
    const handleDownloadImage = useCallback(() => {
        const element = rankingImageRef.current;
        if (element) {
            html2canvas(element, {
                backgroundColor: '#1f2937', // Fondo oscuro para la captura
                useCORS: true, // Intentar cargar imágenes externas
                scale: 2, // Aumentar resolución
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `shiro-nexus-ranking-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error("Error generating image:", err);
                alert("Error al generar la imagen. Asegúrate de que todas las imágenes se cargaron correctamente.");
            });
        }
    }, [userName]);

    // --- Renderizado ---
    if (isLoading) return <LoadingIndicator />;
    if (error) return <ErrorIndicator message={error} />;

    const activeItem = activeId ? allAnime.find(item => item.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-gray-950 text-gray-200 px-4 py-8 md:py-16">
                <motion.h1
                    className="text-3xl sm:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                >
                    Crea tu Ranking Semanal - {currentSeason} {currentYear}
                </motion.h1>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Animes Disponibles */}
                    <motion.div
                        className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50"
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Animes Disponibles</h2>
                        {/* Barra de Búsqueda */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Buscar anime..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>

                        {/* Lista de Animes Disponibles */}
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            <SortableContext items={filteredAvailableAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                {filteredAvailableAnime.length > 0 ? (
                                    filteredAvailableAnime.map(anime => (
                                        <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 italic py-4">
                                        {availableAnime.length > 0 ? 'No se encontraron animes con ese nombre.' : 'No hay animes disponibles.'}
                                    </p>
                                )}
                            </SortableContext>
                        </div>
                    </motion.div>

                    {/* Columna Derecha: Ranking Top 10 */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    >
                        {/* Div que se capturará para la imagen */}
                        <div ref={rankingImageRef} id="rankingImage" className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                            {/* Cabecera del Ranking */}
                            <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-3">
                                <div className="flex items-center gap-3">
                                     {/* Placeholder para logo pequeño */}
                                     <img src="https://placehold.co/40x40/1F2937/4B5563?text=SN" alt="Logo Shiro Nexus" className="h-8 w-8 rounded-full"/>
                                     <div>
                                        <h2 className="text-lg font-bold text-white">MY TOP 10 ANIME RANKINGS</h2>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{currentSeason.toUpperCase()} {currentYear} | COMMUNITY ANIME RANKINGS</p>
                                     </div>
                                </div>
                                <span className="text-sm font-semibold text-cyan-400">Shiro Nexus</span>
                            </div>

                            {/* Lista del Ranking */}
                            <div className="min-h-[60vh]"> {/* Altura mínima para soltar */}
                                <SortableContext items={rankedAnime.map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    {rankedAnime.map((anime, index) => (
                                        <SortableAnimeItem key={anime.id} id={anime.id} anime={anime} isRanked={true} rank={index} />
                                    ))}
                                     {/* Espacios vacíos si hay menos de 10 */}
                                     {Array.from({ length: Math.max(0, 10 - rankedAnime.length) }).map((_, index) => (
                                         <div key={`placeholder-${index}`} className="flex items-center p-2 rounded-md mb-2 bg-gray-700/30 border border-dashed border-gray-600/50 h-[52px]"> {/* Altura similar a item */}
                                             <span className="text-xl font-bold w-8 text-center mr-3 text-gray-500">{rankedAnime.length + index + 1}</span>
                                             <span className="text-sm text-gray-600 italic">Arrastra un anime aquí</span>
                                         </div>
                                     ))}
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
                                <input
                                    type="text"
                                    placeholder="Tu nombre (Opcional)"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value || 'Anonymous')}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <button
                                onClick={handleDownloadImage}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors"
                            >
                                <Download size={16} />
                                Descargar Ranking
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Drag Overlay para mostrar el item mientras se arrastra */}
                {/* {createPortal( // Necesitaría instalar react-dom y usar createPortal si no
                    <DragOverlay>
                        {activeId && activeItem ? (
                            <SortableAnimeItem id={activeId} anime={activeItem} isOverlay />
                        ) : null}
                    </DragOverlay>,
                    document.body // Montar overlay en el body
                )} */}
                 {/* Simplificado sin Portal/Overlay por ahora para evitar complejidad inicial */}


                <ScrollToTopButton />
            </div>
        </DndContext>
    );
}

// --- Loading/Error Components (Definiciones completas) ---
const LoadingIndicator = () => <div className="flex justify-center items-center min-h-[50vh]"><Loader2 size={48} className="animate-spin text-cyan-500" /></div>;
const ErrorIndicator = ({ message }: { message: string | null }) => <div className="text-center py-20 text-red-400">{message || "Error al cargar."}</div>;


export default RankingSemanalPage;

