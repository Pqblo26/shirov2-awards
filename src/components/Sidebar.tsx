import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

// Simple SVG icons
// Using HeartIcon from previous step
const HeartIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 shrink-0"><path fillRule="evenodd" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.11-4.789 9.27a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" clipRule="evenodd" /></svg>;
const PatreonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 shrink-0"><path d="M15.385.508c-4.274 0-7.74 3.467-7.74 7.742 0 4.274 3.466 7.74 7.74 7.74 4.274 0 7.74-3.466 7.74-7.74C23.124 3.974 19.66.508 15.385.508zM.015.508h4.663v23H.015v-23z"></path></svg>;

// --- Define Structure for WIP items ---
interface WipItemData {
    id: string; title?: string; image?: string; wip_status?: string;
    progress?: number; link?: string; order?: number; date?: string;
}

// --- Updated Sidebar Component ---
function Sidebar() {
    const sidebarVariants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } } };
    const widgetVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    // --- State for loading WIP items ---
    const [wipItems, setWipItems] = useState<WipItemData[]>([]);
    const [isLoadingWip, setIsLoadingWip] = useState(true);
    const [wipError, setWipError] = useState<string | null>(null);

    // --- Load WIP items ---
    useEffect(() => {
        // ... (WIP loading logic remains the same) ...
        setIsLoadingWip(true); setWipError(null);
        try {
            const modules = import.meta.glob('../../content/wip/*.md', { eager: true, query: '?raw', import: 'default' });
            const loadedItems: WipItemData[] = [];
            for (const path in modules) {
                 const rawContent = modules[path]; if (typeof rawContent !== 'string') continue; try { const { data: frontmatter } = matter(rawContent); const slugMatch = path.match(/([^/]+)\.md$/); const id = slugMatch ? slugMatch[1] : path; loadedItems.push({ id: id, title: frontmatter.title, image: frontmatter.image, wip_status: frontmatter.wip_status, progress: frontmatter.progress, link: frontmatter.link, order: frontmatter.order, date: frontmatter.date }); } catch (parseError) { console.error(`Error parsing WIP item: ${path}`, parseError); }
             }
            loadedItems.sort((a, b) => { if (a.order !== undefined && b.order !== undefined) { return a.order - b.order; } if (a.order !== undefined) return -1; if (b.order !== undefined) return 1; return a.title?.localeCompare(b.title ?? '') ?? 0; });
            setWipItems(loadedItems);
        } catch (err) { console.error("Error loading WIP items:", err); setWipError("Error al cargar tareas en progreso.");
        } finally { setIsLoadingWip(false); }
    }, []);


    // Determine status color
    const getStatusColor = (status?: string): string => {
         switch (status?.toLowerCase()) { case 'traduciendo': return 'text-yellow-400'; case 'editando': return 'text-blue-400'; case 'corrigiendo': return 'text-orange-400'; case 'q.c.': return 'text-purple-400'; case 'encoding': return 'text-indigo-400'; case 'subiendo': return 'text-pink-400'; case 'otro': return 'text-gray-400'; default: return 'text-gray-400'; }
     };

    return (
        <motion.aside className="space-y-8 lg:sticky lg:top-24" variants={sidebarVariants} initial="hidden" animate="visible" >

            {/* --- Support Section - CARD STYLE with Background Color --- */}
            <motion.div variants={widgetVariants} className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600/50 pb-2">Apoya Shiro Nexus</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Tu apoyo nos ayuda a mantener el sitio activo. ¡Gracias!
                </p>
                {/* Stack cards vertically */}
                <div className="space-y-4">
                    {/* Ko-fi Card Link - MODIFIED BACKGROUND/TEXT/ICON COLORS */}
                    <a
                        href="https://ko-fi.com/shirooo26" // Replace with your actual Ko-fi link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-cyan-700 border border-cyan-600 shadow-sm hover:bg-cyan-600 hover:border-cyan-500 transition-all duration-200 ease-in-out group"
                        // Removed background/border classes: bg-gray-700/40 border-gray-600/50 hover:bg-gray-700/70 hover:border-cyan-500/50
                        // Added new background/border classes
                    >
                        <div className="flex items-center space-x-3">
                            {/* Icon color changed to white */}
                            <HeartIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                            <div>
                                {/* Text color changed to white */}
                                <span className="font-semibold text-base text-white transition-colors">
                                    Apóyame en Ko-fi
                                </span>
                                {/* Description color changed for better contrast */}
                                <span className="text-xs text-cyan-100 block group-hover:text-white transition-colors">
                                    Donación única o recurrente
                                </span>
                            </div>
                        </div>
                    </a>

                    {/* Patreon Card Link - MODIFIED BACKGROUND/TEXT/ICON COLORS */}
                    <a
                        href="#" // Replace with your actual Patreon link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-orange-600 border border-orange-500 shadow-sm hover:bg-orange-500 hover:border-orange-400 transition-all duration-200 ease-in-out group"
                         // Removed background/border classes: bg-gray-700/40 border-gray-600/50 hover:bg-gray-700/70 hover:border-orange-500/50
                         // Added new background/border classes
                    >
                         <div className="flex items-center space-x-3">
                             {/* Icon color changed to white */}
                            <PatreonIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                            <div>
                                 {/* Text color changed to white */}
                                <span className="font-semibold text-base text-white transition-colors">
                                    Apóyame en Patreon
                                </span>
                                 {/* Description color changed for better contrast */}
                                <span className="text-xs text-orange-100 block group-hover:text-white transition-colors">
                                    Apoyo mensual con ventajas
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </motion.div>
            {/* --- End Support Section Modification --- */}


            {/* --- "Trabajando Actualmente" Widget --- */}
            <motion.div variants={widgetVariants} className="bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                 <h3 className="text-xl font-semibold text-white border-b border-gray-600 px-6 py-4">Trabajando Actualmente</h3>
                 {/* ... WIP list rendering logic ... */}
                 {isLoadingWip ? ( <div className="p-6 text-center text-gray-400">Cargando...</div> )
                  : wipError ? ( <div className="p-6 text-center text-red-400">{wipError}</div> )
                  : wipItems && wipItems.length > 0 ? ( <ul className="divide-y divide-gray-700/50"> {wipItems.map(item => ( <li key={item.id} className="group"> {item.link ? ( <Link to={item.link} className="block hover:bg-gray-700/40 transition-colors duration-150"> <WipItemContent item={item} getStatusColor={getStatusColor} /> </Link> ) : ( <div className="block"> <WipItemContent item={item} getStatusColor={getStatusColor} /> </div> )} </li> ))} </ul> )
                  : ( <div className="p-6 text-center"> <p className="text-sm text-gray-400 italic">¡Al día! No hay tareas activas.</p> </div> )}
            </motion.div>

        </motion.aside>
    );
}

// --- Helper component WipItemContent ---
const WipItemContent: React.FC<{item: WipItemData, getStatusColor: (status?: string) => string}> = ({ item, getStatusColor }) => (
    // ... WipItemContent JSX remains the same ...
    <div className="flex flex-col">
        {item.image ? ( <img src={item.image} alt="" className="w-full h-32 object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} /> )
         : ( <div className="w-full h-32 bg-gray-700 flex items-center justify-center"> <span className="text-gray-500 text-xs italic">Sin imagen</span> </div> )}
        <div className="p-4">
            <p className="text-sm font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors mb-1 truncate" title={item.title}> {item.title || "Sin Título"} </p>
            {typeof item.progress === 'number' && item.progress >= 0 && ( <div className="w-full bg-gray-600 rounded-full h-1.5 my-1.5 overflow-hidden"> <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${item.progress}%` }} ></div> </div> )}
            {item.wip_status && ( <p className={`text-xs font-medium ${getStatusColor(item.wip_status)}`}> {item.wip_status} {typeof item.progress === 'number' ? `(${item.progress}%)` : ''} </p> )}
        </div>
    </div>
);

export default Sidebar;
