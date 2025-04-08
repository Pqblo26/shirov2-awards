import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

// Simple SVG icons (KofiIcon, PatreonIcon remain the same)
const KofiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M23.88 7.13c-.26-.09-8.28-2.9-8.28-2.9-.21-.08-.48.04-.55.26-.1.3-.19.6-.28.89-.09.29-.01.6.23.76 0 0 6.88 4.78 7.14 5.04.26.26.71.35 1.04.23.69-.26 1.18-1.04 1.04-1.76-.08-.41-.34-.78-.64-1.06zm-11.42 8.9c-2.3 0-4.17-1.86-4.17-4.17 0-2.3 1.87-4.17 4.17-4.17s4.17 1.87 4.17 4.17c0 2.3-1.87 4.17-4.17 4.17zm0-6.8c-1.47 0-2.63 1.17-2.63 2.63s1.17 2.63 2.63 2.63 2.63-1.17 2.63-2.63-1.16-2.63-2.63-2.63zM4.18 19.35h16.6c.46 0 .84-.38.84-.84v-1.1c0-.46-.38-.84-.84-.84H4.18c-.46 0-.84.38-.84.84v1.1c0 .46.38.84.84.84z"></path></svg>;
const PatreonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M15.385.508c-4.274 0-7.74 3.467-7.74 7.742 0 4.274 3.466 7.74 7.74 7.74 4.274 0 7.74-3.466 7.74-7.74C23.124 3.974 19.66.508 15.385.508zM.015.508h4.663v23H.015v-23z"></path></svg>;

// --- Define Structure for WIP items ---
interface WipItemData {
    id: string;
    title?: string;
    image?: string;
    wip_status?: string;
    progress?: number;
    link?: string;
    order?: number;
    date?: string;
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
        setIsLoadingWip(true);
        setWipError(null);
        try {
            // --- MODIFIED: Use relative path for import.meta.glob ---
            // Assuming Sidebar.tsx is in src/components/ and content is at the root
            // Path goes up two levels ../../ to reach root, then into content/wip/
            const modules = import.meta.glob('../../content/wip/*.md', { // <-- Relative path
                eager: true,
                query: '?raw',
                import: 'default'
            });
            // --- END MODIFICATION ---

            const loadedItems: WipItemData[] = [];
            for (const path in modules) {
                const rawContent = modules[path];
                if (typeof rawContent !== 'string') continue;
                try {
                    const { data: frontmatter } = matter(rawContent);
                    const slugMatch = path.match(/([^/]+)\.md$/);
                    const id = slugMatch ? slugMatch[1] : path;

                    loadedItems.push({
                        id: id,
                        title: frontmatter.title,
                        image: frontmatter.image,
                        wip_status: frontmatter.wip_status,
                        progress: frontmatter.progress,
                        link: frontmatter.link,
                        order: frontmatter.order,
                        date: frontmatter.date
                    });
                } catch (parseError) {
                    console.error(`Error parsing WIP item: ${path}`, parseError);
                }
            }

            // Sort items
            loadedItems.sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) { return a.order - b.order; }
                if (a.order !== undefined) return -1;
                if (b.order !== undefined) return 1;
                return a.title?.localeCompare(b.title ?? '') ?? 0;
            });

            setWipItems(loadedItems);

        } catch (err) {
            console.error("Error loading WIP items:", err);
            setWipError("Error al cargar tareas en progreso.");
        } finally {
            setIsLoadingWip(false);
        }
    }, []);


    // Determine status color
    const getStatusColor = (status?: string): string => {
        switch (status?.toLowerCase()) {
            case 'traduciendo': return 'text-yellow-400';
            case 'editando': return 'text-blue-400';
            case 'corrigiendo': return 'text-orange-400';
            case 'q.c.': return 'text-purple-400';
            case 'encoding': return 'text-indigo-400';
            case 'subiendo': return 'text-pink-400';
            case 'otro': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.aside className="space-y-8 lg:sticky lg:top-24" variants={sidebarVariants} initial="hidden" animate="visible" >
            {/* Support Section */}
            <motion.div variants={widgetVariants} className="bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl p-6 border border-gray-700/50 shadow-lg">
                 <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Apoya Shiro Nexus</h3>
                 <p className="text-sm text-gray-300 mb-5"> Si te gusta nuestro trabajo, considera apoyarnos para mantener el sitio y traer más contenido. ¡Cada aporte cuenta! </p>
                 <div className="space-y-3"> <a href="https://ko-fi.com/shirooo26" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <KofiIcon /> Invítame un café en Ko-fi </a> <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <PatreonIcon /> Conviértete en mecenas </a> </div>
            </motion.div>

            {/* --- "Trabajando Actualmente" Widget --- */}
            <motion.div variants={widgetVariants} className="bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                 <h3 className="text-xl font-semibold text-white border-b border-gray-600 px-6 py-4">Trabajando Actualmente</h3>
                 {isLoadingWip ? (
                     <div className="p-6 text-center text-gray-400">Cargando...</div>
                 ) : wipError ? (
                     <div className="p-6 text-center text-red-400">{wipError}</div>
                 ) : wipItems && wipItems.length > 0 ? (
                     <ul className="divide-y divide-gray-700/50">
                         {wipItems.map(item => (
                             <li key={item.id} className="group">
                                 {item.link ? (
                                     <Link to={item.link} className="block hover:bg-gray-700/40 transition-colors duration-150">
                                         <WipItemContent item={item} getStatusColor={getStatusColor} />
                                     </Link>
                                 ) : (
                                     <div className="block">
                                         <WipItemContent item={item} getStatusColor={getStatusColor} />
                                     </div>
                                 )}
                             </li>
                         ))}
                     </ul>
                 ) : (
                     <div className="p-6 text-center">
                         <p className="text-sm text-gray-400 italic">¡Al día! No hay tareas activas.</p>
                     </div>
                 )}
            </motion.div>

        </motion.aside>
    );
}

// --- Helper component to render WIP item content ---
const WipItemContent: React.FC<{item: WipItemData, getStatusColor: (status?: string) => string}> = ({ item, getStatusColor }) => (
    <div className="flex flex-col">
        {item.image ? (
            <img src={item.image} alt="" className="w-full h-32 object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
        ) : (
            <div className="w-full h-32 bg-gray-700 flex items-center justify-center"> <span className="text-gray-500 text-xs italic">Sin imagen</span> </div>
        )}
        <div className="p-4">
            <p className="text-sm font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors mb-1 truncate" title={item.title}> {item.title || "Sin Título"} </p>
            {typeof item.progress === 'number' && item.progress >= 0 && (
               <div className="w-full bg-gray-600 rounded-full h-1.5 my-1.5 overflow-hidden">
                   <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${item.progress}%` }} ></div>
               </div>
            )}
            {item.wip_status && (
               <p className={`text-xs font-medium ${getStatusColor(item.wip_status)}`}> {item.wip_status} {typeof item.progress === 'number' ? `(${item.progress}%)` : ''} </p>
            )}
        </div>
    </div>
);


export default Sidebar;
