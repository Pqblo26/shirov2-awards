import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Sample Data Structure for a Single Translation ---
// In a real app, you'd fetch this based on the slug/id
// We'll reuse the list data for simulation
const allTranslationsData = [
    { id: "t-main-1", slug: "manga-xyz-10", title: "Avance Capítulo 10 - Manga XYZ", link: "/traducciones/manga-xyz-10", imageUrl: "https://picsum.photos/seed/mangaXYZ10/600/400", tags: ["Otros", "En Progreso"], date: "2025-04-05", source: "Fuente Manga XYZ", content: "<p>Este es el **contenido simulado** para el capítulo 10 del Manga XYZ.</p><p>Aquí iría el texto de la traducción, imágenes, etc.</p><ul><li>Punto 1</li><li>Punto 2</li></ul>" },
    { id: "t-main-2", slug: "entrevista-abc", title: "Entrevista Exclusiva - Autor ABC", link: "/traducciones/entrevista-abc", imageUrl: "https://picsum.photos/seed/autorABC/600/400", tags: ["Otros", "Finalizado"], date: "2025-04-03", source: "Revista Anime Z", content: "<p>Contenido simulado de la entrevista con el Autor ABC.</p><p><strong>Pregunta:</strong> ¿Cuál fue su inspiración?</p><p><strong>Respuesta:</strong> Lorem ipsum...</p>" },
    // Add other items matching the structure...
    { id: "t-main-7", slug: "ova-abc", title: "OVA Especial - Anime ABC", link: "/traducciones/ova-abc", imageUrl: "https://picsum.photos/seed/animeABCova/600/400", tags: ["Anime", "OVA", "Especial", "Finalizado"], date: "2025-03-15", source: "Blu-ray", content: "<p>Contenido de la traducción para la OVA especial.</p>" },
];

type TranslationData = typeof allTranslationsData[0] | undefined;

function SingleTranslationPage() {
    const { slug } = useParams<{ slug: string }>(); // Get slug from URL
    const navigate = useNavigate(); // Hook for navigation
    const [translation, setTranslation] = useState<TranslationData>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        // --- Simulate fetching data based on slug ---
        const timer = setTimeout(() => {
            const foundTranslation = allTranslationsData.find(item => item.slug === slug);
            if (foundTranslation) {
                setTranslation(foundTranslation);
                document.title = `${foundTranslation.title} | Shiro Nexus`;
            } else {
                setError("Traducción no encontrada.");
                document.title = "Error | Shiro Nexus";
                // Optional: Redirect to 404 page after a delay or immediately
                // navigate('/404', { replace: true });
            }
            setIsLoading(false);
        }, 500); // Simulate network delay

        return () => clearTimeout(timer); // Cleanup timer
    }, [slug, navigate]); // Re-run effect if slug changes

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30 rounded-full" ></motion.div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                 <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link to="/traducciones" className="text-green-400 hover:underline">Volver a Traducciones</Link>
                 </motion.div>
            </div>
        );
    }

    // Content Display State
    if (!translation) {
        // Should be handled by error state, but as a fallback
        return <div className="text-center py-12 text-gray-500">Traducción no disponible.</div>;
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Stagger children
        >
            {/* Back Link */}
            <motion.div variants={itemVariants} className="mb-6">
                <Link to="/traducciones" className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a todas las traducciones
                </Link>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translation.title}
            </motion.h1>

            {/* Metadata */}
            <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-6 pb-4 border-b border-gray-700/50">
                 <span className="flex items-center whitespace-nowrap">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                     {translation.date}
                 </span>
                 <span className="flex items-center whitespace-nowrap">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
                     {translation.source}
                 </span>
                 {/* Tags */}
                 <div className="flex flex-wrap gap-1.5">
                     {translation.tags.map(tag => (
                         <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                     ))}
                 </div>
            </motion.div>

            {/* Featured Image */}
            <motion.img
                variants={itemVariants}
                src={translation.imageUrl}
                alt={`Imagen para ${translation.title}`}
                className="w-full rounded-lg shadow-lg mb-8 max-h-[400px] object-cover" // Limit height
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/111827/9CA3AF?text=Error+Imagen'; }}
            />

            {/* Translation Content */}
            {/* Using dangerouslySetInnerHTML for simulated HTML content. Be VERY careful with real data! Sanitize it properly on the backend or use a Markdown renderer. */}
            <motion.div
                variants={itemVariants}
                className="prose prose-sm sm:prose-base prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-headings:text-white" // Tailwind typography plugin styles
                dangerouslySetInnerHTML={{ __html: translation.content }}
            />

            {/* Add comment section placeholder later */}
             <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-gray-700/50">
                 <h3 className="text-xl font-semibold text-white mb-4">Comentarios</h3>
                 <p className="text-gray-500 italic">(La sección de comentarios se implementará aquí)</p>
             </motion.div>
        </motion.div>
    );
}

export default SingleTranslationPage;

