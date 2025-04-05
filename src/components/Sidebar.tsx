import React from 'react';
import { motion } from 'framer-motion';

// Simple SVG icons (replace with better ones or react-icons if preferred)
const KofiIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M23.88 7.13c-.26-.09-8.28-2.9-8.28-2.9-.21-.08-.48.04-.55.26-.1.3-.19.6-.28.89-.09.29-.01.6.23.76 0 0 6.88 4.78 7.14 5.04.26.26.71.35 1.04.23.69-.26 1.18-1.04 1.04-1.76-.08-.41-.34-.78-.64-1.06zm-11.42 8.9c-2.3 0-4.17-1.86-4.17-4.17 0-2.3 1.87-4.17 4.17-4.17s4.17 1.87 4.17 4.17c0 2.3-1.87 4.17-4.17 4.17zm0-6.8c-1.47 0-2.63 1.17-2.63 2.63s1.17 2.63 2.63 2.63 2.63-1.17 2.63-2.63-1.16-2.63-2.63-2.63zM4.18 19.35h16.6c.46 0 .84-.38.84-.84v-1.1c0-.46-.38-.84-.84-.84H4.18c-.46 0-.84.38-.84.84v1.1c0 .46.38.84.84.84z"></path></svg>;
const PatreonIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1.5"><path d="M15.385.508c-4.274 0-7.74 3.467-7.74 7.742 0 4.274 3.466 7.74 7.74 7.74 4.274 0 7.74-3.466 7.74-7.74C23.124 3.974 19.66.508 15.385.508zM.015.508h4.663v23H.015v-23z"></path></svg>;


function Sidebar() {
    // Animation for the sidebar itself
    const sidebarVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.3 } } // Added delay
    };

    return (
        <motion.aside
            className="space-y-6 lg:sticky lg:top-24" // Sticky on large screens, top-24 assumes top nav height + margin
            variants={sidebarVariants}
            initial="hidden"
            // Use whileInView for scroll-triggered animation if preferred
            // whileInView="visible"
            // viewport={{ once: true, amount: 0.2 }}
            animate="visible" // Animate on initial load
        >
            {/* Support Section */}
            <div className="bg-gray-800/70 rounded-lg p-5 border border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">Apoya Shiro Nexus</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Si te gusta nuestro trabajo (traducciones, noticias, premios...), considera apoyarnos para mantener el sitio activo.
                </p>
                <div className="space-y-3">
                    {/* Ko-fi Button Placeholder */}
                    <a
                        href="#" // Replace with your Ko-fi link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors shadow hover:shadow-md"
                    >
                        <KofiIcon />
                        Invítame un café en Ko-fi
                    </a>
                    {/* Patreon Button Placeholder */}
                    <a
                        href="#" // Replace with your Patreon link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors shadow hover:shadow-md"
                    >
                       <PatreonIcon />
                        Conviértete en mecenas en Patreon
                    </a>
                </div>
            </div>

            {/* Add more sidebar widgets here later */}

        </motion.aside>
    );
}

export default Sidebar;
