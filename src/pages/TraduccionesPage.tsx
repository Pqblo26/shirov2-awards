import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Import the new components
import TranslationItemCard from '../components/TranslationItemCard';
import Sidebar from '../components/Sidebar';

// --- Updated Sample Data ---
// Added tags array including main category, format, and status
const allTranslationsData = [
    { id: "t-main-1", title: "Avance Capítulo 10 - Manga XYZ", link: "/traducciones/manga-xyz-10", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Manga+XYZ", tags: ["Manga", "En Progreso"] },
    { id: "t-main-2", title: "Entrevista Exclusiva - Autor ABC", link: "/traducciones/entrevista-abc", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Entrevista", tags: ["Entrevista", "Otros", "Finalizado"] },
    { id: "t-main-3", title: "Noticia Importante - Evento Anime", link: "/traducciones/noticia-evento", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Noticia", tags: ["Noticia", "Web", "Finalizado"] },
    { id: "t-main-4", title: "Análisis Episodio Final - Anime ZZZ (TV)", link: "/traducciones/analisis-zzz", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Análisis", tags: ["Análisis", "Anime", "TV", "Finalizado"] },
    { id: "t-main-5", title: "Guía de Personajes - Juego AAA", link: "/traducciones/guia-aaa", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Guía", tags: ["Guía", "Videojuego", "Otros", "En Progreso"] },
    { id: "t-main-6", title: "Donghua XYZ - Episodio 5 (BD)", link: "/traducciones/donghua-xyz-5", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Donghua", tags: ["Donghua", "BD", "En Progreso"] },
    { id: "t-main-7", title: "OVA Especial - Anime ABC", link: "/traducciones/ova-abc", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=OVA", tags: ["Anime", "OVA", "Finalizado"] },
    { id: "t-main-8", title: "Resumen Novela Ligera Vol. 3", link: "/traducciones/nl-vol3", imageUrl: "https://placehold.co/320x180/111827/4ADE80?text=Novela", tags: ["Novela", "Finalizado"] },
    // Add more translation items...
];

function TraduccionesPage() {
    useEffect(() => {
        document.title = "Traducciones | Shiro Nexus";
    }, []);

     // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07 } // Faster stagger for grid items
        }
    };
     const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-400">Traducciones</h1>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Explora nuestras últimas traducciones de manga, entrevistas, noticias y más contenido exclusivo del mundo del anime y manga.
            </p>

            {/* Main content area with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12"> {/* Increased gap */}

                {/* Main Content Column */}
                <motion.div
                    className="lg:col-span-2" // Takes 2 out of 3 columns on large screens
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                     {/* Placeholder for Filters/Search */}
                    <div className="mb-8 p-4 bg-gray-800/50 rounded-lg">
                        <h3 className="text-sm font-semibold text-white mb-3 text-center sm:text-left">Filtrar por:</h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            <button className="px-2.5 py-1 text-xs rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">Todo</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-blue-600/50 hover:bg-blue-600 transition-colors">Anime</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-blue-600/50 hover:bg-blue-600 transition-colors">Donghua</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-blue-600/50 hover:bg-blue-600 transition-colors">Manga</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-blue-600/50 hover:bg-blue-600 transition-colors">Otros</button>
                            <span className="border-l border-gray-600 mx-2"></span> {/* Separator */}
                            <button className="px-2.5 py-1 text-xs rounded-full bg-purple-600/50 hover:bg-purple-600 transition-colors">TV</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-purple-600/50 hover:bg-purple-600 transition-colors">BD</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-purple-600/50 hover:bg-purple-600 transition-colors">Web</button>
                            <button className="px-2.5 py-1 text-xs rounded-full bg-purple-600/50 hover:bg-purple-600 transition-colors">OVA</button>
                            {/* Add more filters... */}
                        </div>
                    </div>

                    {/* Grid of Translation Items */}
                    {/* Adjusted grid columns for better density */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                        variants={containerVariants} // Apply stagger to this container
                    >
                        {allTranslationsData.map((item) => (
                            // Apply item variant to the wrapper motion.div
                            <motion.div key={item.id} variants={itemVariants}>
                                <TranslationItemCard item={item} />
                            </motion.div>
                        ))}
                    </motion.div>

                     {/* Placeholder for Pagination */}
                     <div className="mt-12 pt-6 border-t border-gray-700/50 text-center">
                         <p className="text-sm text-gray-500 mb-4">
                            Mostrando 1-8 de XX traducciones
                         </p>
                         <div className="flex justify-center space-x-2 mt-4">
                             <button className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-400 cursor-not-allowed">Anterior</button>
                             <button className="px-3 py-1 text-xs rounded bg-green-600 text-white">1</button>
                             <button className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600">2</button>
                             <button className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600">3</button>
                             <span className="text-gray-500 px-1">...</span>
                             <button className="px-3 py-1 text-xs rounded bg-gray-700 text-gray-400 hover:bg-gray-600">Siguiente</button>
                         </div>
                     </div>

                </motion.div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 mt-12 lg:mt-0"> {/* Added more top margin on mobile */}
                    <Sidebar />
                </div>

            </div>
        </motion.div>
    );
}

export default TraduccionesPage;
