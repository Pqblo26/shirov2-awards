import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import matter from 'gray-matter';
import ScrollToTopButton from '../components/ScrollToTopButton'; // Assuming it's in src/components

// --- Interfaces (DownloadLink, SingleTranslationData) ---
interface DownloadLink { quality_select?: string; quality_other?: string; format_select?: string; format_other?: string; server_select?: string; server_other?: string; url: string; notes?: string; }
// --- Updated SingleTranslationData Interface ---
interface SingleTranslationData {
    slug: string; filename: string; title: string; date: string; imageUrl?: string;
    tags?: string[]; status?: string; mainCategory?: string; excerpt?: string; content: string;
    externalResources?: string;
    // Fields with select + other options
    format_select?: string; format_other?: string;
    source_select?: string; source_other?: string;
    resolution_select?: string; resolution_other?: string;
    videoCodec_select?: string; videoCodec_other?: string;
    audioCodec_select?: string; audioCodec_other?: string;
    specification_select?: string; specification_other?: string; // <-- ADDED Specifications fields
    // Downloads list
    downloads?: DownloadLink[];
}

// --- Icon Components ---
const IconClipboardList: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h10.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z" /> </svg> );
const IconBookOpen: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> </svg> );
const IconDownload: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg> );
const IconChatBubbleLeft: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-2.138a1.125 1.125 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /> </svg> );
const IconTag: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /> </svg> );
const IconExternalLink: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /> </svg> );


function SingleTranslationPage() {
    const { filename } = useParams<{ filename: string }>();
    const [translation, setTranslation] = useState<SingleTranslationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true); setError(null); setTranslation(null);
        const loadTranslation = async () => {
            if (!filename) { setError("Nombre de archivo inválido."); setIsLoading(false); return; }
            try {
                const module = await import(`../../content/traducciones/${filename}.md?raw`);
                const rawContent = module.default;
                if (typeof rawContent !== 'string') { throw new Error('El contenido importado no es una cadena de texto válida.'); }
                const { data: frontmatter, content: markdownContent } = matter(rawContent);
                const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
                const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
                const downloads = Array.isArray(frontmatter.downloads) ? frontmatter.downloads : [];

                // Map frontmatter data including new specification fields
                const loadedTranslation: SingleTranslationData = {
                    filename: filename, slug: slug,
                    title: frontmatter.title ?? 'Sin Título',
                    date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
                    imageUrl: frontmatter.imageUrl, tags: tags, status: frontmatter.status,
                    mainCategory: frontmatter.mainCategory, excerpt: frontmatter.excerpt, content: markdownContent,
                    externalResources: frontmatter.externalResources,
                    format_select: frontmatter.format_select, format_other: frontmatter.format_other,
                    source_select: frontmatter.source_select, source_other: frontmatter.source_other,
                    resolution_select: frontmatter.resolution_select, resolution_other: frontmatter.resolution_other,
                    videoCodec_select: frontmatter.videoCodec_select, videoCodec_other: frontmatter.videoCodec_other,
                    audioCodec_select: frontmatter.audioCodec_select, audioCodec_other: frontmatter.audioCodec_other,
                    specification_select: frontmatter.specification_select, // <-- ADDED reading from frontmatter
                    specification_other: frontmatter.specification_other, // <-- ADDED reading from frontmatter
                    downloads: downloads,
                };
                setTranslation(loadedTranslation);
                document.title = `${loadedTranslation.title} | Shiro Nexus`;
            } catch (err) {
                console.error(`Error loading translation for filename "${filename}":`, err);
                 if (err instanceof Error && (err.message.includes('Failed to fetch dynamically imported module') || err.message.includes('Unknown variable dynamic import'))) { setError(`No se pudo cargar el contenido para ${filename}. Verifica que el archivo existe y la ruta es correcta.`); }
                 else if (err instanceof Error && err.message.includes('Imported content is not a string')) { setError(`Error: El contenido importado para /content/traducciones/${filename}.md no es texto.`); }
                 else { setError("Traducción no encontrada o error al cargarla."); }
                 document.title = "Error | Shiro Nexus";
            } finally { setIsLoading(false); }
        };
        loadTranslation();
    }, [filename]);

    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

    // --- Loading / Error / Not Found States ---
    if (isLoading) { /* ... loading spinner ... */ }
    if (error) { /* ... error message ... */ }
    if (!translation) { /* ... not found message ... */ }

    // --- Helper function to get display value ---
    const getDisplayValue = (selectValue?: string, otherValue?: string): string | undefined => {
        if (selectValue === "Otro") { return otherValue || undefined; }
        return selectValue;
    };

    // --- Prepare details list data - ADDED Specifications ---
    const detailsList = [
        { label: "Fansubbing Work", value: getDisplayValue(translation.source_select, translation.source_other) },
        // { label: "Recursos externos", value: translation.externalResources }, // Handled separately
        { label: "Formato", value: getDisplayValue(translation.format_select, translation.format_other) },
        { label: "Especificaciones", value: getDisplayValue(translation.specification_select, translation.specification_other) }, // <-- ADDED Specifications item
        { label: "Resolución", value: getDisplayValue(translation.resolution_select, translation.resolution_other) },
        { label: "Video", value: getDisplayValue(translation.videoCodec_select, translation.videoCodec_other) },
        { label: "Audio", value: getDisplayValue(translation.audioCodec_select, translation.audioCodec_other) },
        { label: "Estado", value: translation.status },
    ].filter(item => item.value); // Filter out items without a final value

    // Helper component for Detail Item Block
    const DetailItem: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => { /* ... component code ... */
        if (!value) return null;
        return ( <div className="border-l-4 border-cyan-500 pl-4 py-2.5 bg-gray-700/40 rounded-r-md shadow-sm"> <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p> <p className="text-base text-white break-words">{value}</p> </div> );
     };

    // --- Function to determine External Link Text ---
    const getExternalLinkText = (url: string): string => { /* ... function code ... */
        try { const hostname = new URL(url).hostname.toLowerCase(); if (hostname.includes('myanimelist.net')) return "Ver en MyAnimeList"; if (hostname.includes('anilist.co')) return "Ver en Anilist"; } catch (e) { /* Invalid URL? Fallback */ } return "Visitar Enlace Externo";
    };


    // --- Content Display State ---
    return (
        <>
            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans"
                initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
                {/* Back Link */}
                <motion.div variants={itemVariants} className="mb-6">
                     <Link to="/traducciones" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center group"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /> </svg> Volver a todas las traducciones </Link>
                </motion.div>

                {/* Title */}
                <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10">
                    {translation.title}
                </motion.h1>

                {/* --- Main Info Section (Image + Details) --- */}
                <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                    {/* Left Column: Image */}
                    <div className="lg:col-span-1">
                         {/* ... Image rendering ... */}
                         <div className="rounded-lg shadow-xl overflow-hidden border border-gray-700/50">
                             {translation.imageUrl ? ( <motion.img src={translation.imageUrl} alt={`Imagen para ${translation.title}`} className="w-full h-auto object-cover aspect-[2/3]" loading="lazy" onError={(e) => { const imgElement = e.target as HTMLImageElement; imgElement.style.display = 'none'; const placeholder = imgElement.parentElement?.querySelector('.placeholder-image'); placeholder?.classList.remove('hidden'); }} /> ) : null}
                             <div className={`placeholder-image w-full h-auto bg-gray-800/50 aspect-[2/3] flex items-center justify-center ${translation.imageUrl ? 'hidden' : ''}`}> <span className="text-gray-500 italic">Imagen no disponible</span> </div>
                        </div>
                    </div>
                    {/* Right Column: Details Box */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg shadow-xl border border-gray-700/50 p-6">
                        <h2 className="flex items-center text-xl font-semibold text-white mb-5 border-b border-cyan-500/30 pb-2">
                            <IconClipboardList className="w-5 h-5 mr-2 text-cyan-400"/> Detalles Técnicos
                        </h2>
                        {/* Updated grid to include Specifications */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {detailsList.map((item) => (
                                <DetailItem key={item.label} label={item.label} value={item.value} />
                            ))}
                            {translation.externalResources && (
                                 <div className="border-l-4 border-cyan-500 pl-4 py-2.5 bg-gray-700/40 rounded-r-md shadow-sm">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Recursos Externos</p>
                                    <a href={translation.externalResources} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-base text-cyan-400 hover:text-cyan-300 hover:underline transition-colors break-all" >
                                        {getExternalLinkText(translation.externalResources)}
                                        <IconExternalLink className="w-4 h-4 ml-1.5 shrink-0"/>
                                    </a>
                                </div>
                            )}
                             {translation.tags && translation.tags.length > 0 && (
                                 <div className="sm:col-span-2 border-l-4 border-cyan-500 pl-4 py-2.5 bg-gray-700/40 rounded-r-md shadow-sm">
                                      <p className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"> <IconTag className="w-3.5 h-3.5 mr-1.5"/> Tags </p>
                                      <div className="flex flex-wrap gap-2 items-center mt-1.5">
                                          {translation.tags.map(tag => ( <motion.span key={tag} className="text-sm bg-gray-600 text-gray-200 px-3 py-1 rounded-full cursor-default shadow-sm" whileHover={{ scale: 1.05, backgroundColor: 'rgb(103 232 249 / 0.3)'}} transition={{ duration: 0.2 }} > {tag} </motion.span> ))}
                                      </div>
                                  </div>
                             )}
                        </div>
                         {/* Updated condition for no details message */}
                         {detailsList.length === 0 && !translation.externalResources && (!translation.tags || translation.tags.length === 0) && ( <p className="text-gray-500 italic text-sm mt-4">No hay detalles técnicos disponibles.</p> )}
                    </div>
                </motion.section>

                 {/* --- Sinopsis Section --- */}
                 {translation.excerpt && (
                    <motion.section variants={itemVariants} className="mb-12 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg shadow-xl border border-gray-700/50">
                         <h2 className="flex items-center text-xl font-semibold text-white mb-3 border-b border-cyan-500/30 pb-2"> <IconBookOpen className="w-5 h-5 mr-2 text-cyan-400"/> Sinopsis </h2>
                         <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                             {translation.excerpt}
                         </p>
                    </motion.section>
                 )}

                {/* --- Downloads Section --- */}
                <motion.section variants={itemVariants} className="mb-12 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg shadow-xl border border-gray-700/50">
                     <h2 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-cyan-500/30 pb-2"> <IconDownload className="w-5 h-5 mr-2 text-cyan-400"/> Descargas </h2>
                     {/* ... Downloads rendering logic ... */}
                     {translation.downloads && translation.downloads.length > 0 ? ( <div className="space-y-4"> {translation.downloads.map((link, index) => { const quality = getDisplayValue(link.quality_select, link.quality_other); const format = getDisplayValue(link.format_select, link.format_other); const server = getDisplayValue(link.server_select, link.server_other); return ( <motion.div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-700/60 rounded-lg border border-gray-600/50 shadow-sm" whileHover={{ backgroundColor: 'rgb(55 65 81 / 0.8)', scale: 1.01 }} transition={{ duration: 0.2 }} > <div className="flex-1 mb-3 sm:mb-0 mr-4"> <span className="font-semibold text-white text-base"> {quality || 'Archivo'} {format ? `[${format}]` : ''} {server ? `- ${server}` : ''} </span> {link.notes && <p className="text-xs text-gray-400 mt-1">{link.notes}</p>} </div> <motion.a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-cyan-600 text-white text-sm font-bold py-2 px-5 rounded-md shadow-md whitespace-nowrap" whileHover={{ scale: 1.05, backgroundColor: 'rgb(8 145 178)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'}} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }} > Descargar </motion.a> </motion.div> ); })} </div> ) : ( <p className="text-gray-500 italic">No hay enlaces de descarga disponibles para esta traducción.</p> )}
                </motion.section>

                {/* --- Comment section placeholder --- */}
                <motion.section variants={itemVariants} className="mt-16 pt-8 border-t border-gray-600">
                     <h3 className="flex items-center text-xl font-semibold text-white mb-4"> <IconChatBubbleLeft className="w-5 h-5 mr-2 text-gray-400"/> Comentarios </h3>
                     <p className="text-gray-500 italic">(La sección de comentarios se implementará aquí)</p>
                </motion.section>

            </motion.div>

            <ScrollToTopButton />
        </>
    );
}

export default SingleTranslationPage;
