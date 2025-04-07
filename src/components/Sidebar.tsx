import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Import the type for the props
import { type WipItem } from '../pages/TraduccionesPage'; // Adjust path if needed

// Simple SVG icons
const KofiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M23.88 7.13c-.26-.09-8.28-2.9-8.28-2.9-.21-.08-.48.04-.55.26-.1.3-.19.6-.28.89-.09.29-.01.6.23.76 0 0 6.88 4.78 7.14 5.04.26.26.71.35 1.04.23.69-.26 1.18-1.04 1.04-1.76-.08-.41-.34-.78-.64-1.06zm-11.42 8.9c-2.3 0-4.17-1.86-4.17-4.17 0-2.3 1.87-4.17 4.17-4.17s4.17 1.87 4.17 4.17c0 2.3-1.87 4.17-4.17 4.17zm0-6.8c-1.47 0-2.63 1.17-2.63 2.63s1.17 2.63 2.63 2.63 2.63-1.17 2.63-2.63-1.16-2.63-2.63-2.63zM4.18 19.35h16.6c.46 0 .84-.38.84-.84v-1.1c0-.46-.38-.84-.84-.84H4.18c-.46 0-.84.38-.84.84v1.1c0 .46.38.84.84.84z"></path></svg>;
const PatreonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M15.385.508c-4.274 0-7.74 3.467-7.74 7.742 0 4.274 3.466 7.74 7.74 7.74 4.274 0 7.74-3.466 7.74-7.74C23.124 3.974 19.66.508 15.385.508zM.015.508h4.663v23H.015v-23z"></path></svg>;

// --- Define Props Interface ---
interface SidebarProps {
    currentlyWorkingOn?: WipItem[]; // Accept the array as an optional prop
}

// --- Updated Sidebar Component ---
function Sidebar({ currentlyWorkingOn = [] }: SidebarProps) { // Destructure props with default value
    const sidebarVariants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } } };
    const widgetVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    // Determine the status text color based on the status value (example)
    const getStatusColor = (status?: string): string => {
        switch (status?.toLowerCase()) {
            case 'qc': return 'text-blue-400';
            case 'traduciendo': return 'text-yellow-400';
            case 'corrección': return 'text-orange-400';
            case 'encoding': return 'text-purple-400';
            case 'subiendo': return 'text-pink-400';
            default: return 'text-gray-400'; // Default or 'En Progreso'
        }
    };

    return (
        <motion.aside className="space-y-8 lg:sticky lg:top-24" variants={sidebarVariants} initial="hidden" animate="visible" >
            {/* Support Section (remains the same) */}
            <motion.div variants={widgetVariants} className="bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl p-6 border border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Apoya Shiro Nexus</h3>
                <p className="text-sm text-gray-300 mb-5"> Si te gusta nuestro trabajo, considera apoyarnos para mantener el sitio y traer más contenido. ¡Cada aporte cuenta! </p>
                <div className="space-y-3">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <KofiIcon /> Invítame un café en Ko-fi </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <PatreonIcon /> Conviértete en mecenas </a>
                </div>
            </motion.div>

            {/* --- "Trabajando Actualmente" Widget - Now Dynamic --- */}
            <motion.div variants={widgetVariants} className="bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                 <h3 className="text-xl font-semibold text-white border-b border-gray-600 px-6 py-4">Trabajando Actualmente</h3>
                 {currentlyWorkingOn && currentlyWorkingOn.length > 0 ? (
                     <ul className="divide-y divide-gray-700/50">
                         {/* Use currentlyWorkingOn prop instead of hardcoded wipItems */}
                         {currentlyWorkingOn.map(item => (
                             <li key={item.id} className="group">
                                 {/* Wrap content in Link */}
                                 <Link to={item.link} className="block hover:bg-gray-700/40 transition-colors duration-150">
                                     <div className="flex flex-col">
                                         {/* Image */}
                                         {item.imageUrl ? (
                                             <img
                                                 src={item.imageUrl}
                                                 alt="" // Decorative
                                                 className="w-full h-32 object-cover"
                                                 loading="lazy"
                                                 onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                                             />
                                         ) : (
                                             // Placeholder if no image
                                             <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
                                                 <span className="text-gray-500 text-xs italic">Sin imagen</span>
                                             </div>
                                         )}
                                         {/* Text Content */}
                                         <div className="p-4">
                                             <p className="text-sm font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors mb-1 truncate" title={item.title}>
                                                 {item.title}
                                             </p>
                                             {/* Progress bar */}
                                             {typeof item.progress === 'number' && item.progress >= 0 && ( // Check if progress exists and is valid
                                                <div className="w-full bg-gray-600 rounded-full h-1.5 my-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500 ease-out" // Use Cyan accent
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                             )}
                                             {/* Status Text */}
                                             {item.status && (
                                                <p className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status} {typeof item.progress === 'number' ? `(${item.progress}%)` : ''}
                                                </p>
                                             )}
                                         </div>
                                     </div>
                                 </Link>
                             </li>
                         ))}
                     </ul>
                 ) : (
                     // Message when no items are "In Progress"
                     <div className="p-6 text-center">
                         <p className="text-sm text-gray-400 italic">¡Al día! No hay proyectos activos en este momento.</p>
                     </div>
                 )}
            </motion.div>

        </motion.aside>
    );
}

export default Sidebar;
