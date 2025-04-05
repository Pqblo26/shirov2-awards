import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Simple SVG icons
const KofiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M23.88 7.13c-.26-.09-8.28-2.9-8.28-2.9-.21-.08-.48.04-.55.26-.1.3-.19.6-.28.89-.09.29-.01.6.23.76 0 0 6.88 4.78 7.14 5.04.26.26.71.35 1.04.23.69-.26 1.18-1.04 1.04-1.76-.08-.41-.34-.78-.64-1.06zm-11.42 8.9c-2.3 0-4.17-1.86-4.17-4.17 0-2.3 1.87-4.17 4.17-4.17s4.17 1.87 4.17 4.17c0 2.3-1.87 4.17-4.17 4.17zm0-6.8c-1.47 0-2.63 1.17-2.63 2.63s1.17 2.63 2.63 2.63 2.63-1.17 2.63-2.63-1.16-2.63-2.63-2.63zM4.18 19.35h16.6c.46 0 .84-.38.84-.84v-1.1c0-.46-.38-.84-.84-.84H4.18c-.46 0-.84.38-.84.84v1.1c0 .46.38.84.84.84z"></path></svg>;
const PatreonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M15.385.508c-4.274 0-7.74 3.467-7.74 7.742 0 4.274 3.466 7.74 7.74 7.74 4.274 0 7.74-3.466 7.74-7.74C23.124 3.974 19.66.508 15.385.508zM.015.508h4.663v23H.015v-23z"></path></svg>;

// Updated data for "Work in Progress" widget - using landscape image ratio
const wipItems = [
    { id: 'wip1', title: 'Kijin Gentoushou - 01', status: 'QC', imageUrl: 'https://picsum.photos/seed/wip1/320/180' }, // 16:9 aspect ratio
    { id: 'wip2', title: 'Manga XYZ - Cap 11', status: 'Traduciendo', imageUrl: 'https://picsum.photos/seed/wip2/320/180' },
    { id: 'wip3', title: 'Sorairo Utility (TV) - Batch', status: 'Corrección', imageUrl: 'https://picsum.photos/seed/wip3/320/180' },
];

function Sidebar() {
    const sidebarVariants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } } };
    const widgetVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    return (
        <motion.aside className="space-y-8 lg:sticky lg:top-24" variants={sidebarVariants} initial="hidden" animate="visible" >
            {/* Support Section */}
            <motion.div variants={widgetVariants} className="bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-xl p-6 border border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">Apoya Shiro Nexus</h3>
                <p className="text-sm text-gray-300 mb-5"> Si te gusta nuestro trabajo, considera apoyarnos para mantener el sitio y traer más contenido. ¡Cada aporte cuenta! </p>
                <div className="space-y-3">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <KofiIcon /> Invítame un café en Ko-fi </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow hover:shadow-md"> <PatreonIcon /> Conviértete en mecenas </a>
                </div>
            </motion.div>

            {/* --- "Trabajando Actualmente" Widget (Redesigned) --- */}
            <motion.div variants={widgetVariants} className="bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                 <h3 className="text-xl font-semibold text-white border-b border-gray-600 px-6 py-4">Trabajando Actualmente</h3>
                 <ul className="divide-y divide-gray-700/50"> {/* Use divide for separators */}
                    {wipItems.map(item => (
                        // Each item is now a self-contained block
                        <li key={item.id} className="group">
                             {/* Optional Link Wrapper */}
                             {/* <Link to="#" className="block hover:bg-gray-700/40 transition-colors"> */}
                                <div className="flex flex-col">
                                     {/* Image on Top */}
                                     <img
                                        src={item.imageUrl}
                                        alt="" // Decorative
                                        className="w-full h-32 object-cover" // Full width, fixed height
                                        loading="lazy"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                                     />
                                     {/* Text Content Below */}
                                     <div className="p-4">
                                         <p className="text-sm font-semibold text-gray-100 group-hover:text-green-300 transition-colors mb-1" title={item.title}>
                                             {item.title}
                                         </p>
                                         {/* Progress bar placeholder */}
                                         <div className="my-1.5 h-1.5 w-full bg-gray-600 rounded-full overflow-hidden">
                                             <div className="h-full bg-green-500" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                                         </div>
                                         <p className="text-xs text-yellow-400 font-medium">{item.status}</p>
                                     </div>
                                </div>
                             {/* </Link> */}
                        </li>
                    ))}
                 </ul>
            </motion.div>

            {/* Tag Cloud Removed */}

        </motion.aside>
    );
}

export default Sidebar;

