import React from 'react';
import { Link } from 'react-router-dom';

// Define types for the props expected by this card
interface TranslationItem {
    id: string; // Contains the full filename (e.g., "2025-04-05-manga-xyz-10")
    slug: string; // Generated slug (e.g., "manga-xyz-10") - No longer used for linking
    filename?: string; // Redundant if id holds the filename
    title: string;
    link?: string; // Redundant now
    imageUrl?: string;
    tags?: string[];
    date: string;
    status?: string;
    mainCategory?: string;
    format?: string;
    source?: string;
    excerpt?: string;
}

interface TranslationItemCardProps {
    item: TranslationItem;
}

const TranslationItemCard: React.FC<TranslationItemCardProps> = ({ item }) => {
    // Function to assign colors based on tag content
    const getTagColor = (tag: string): string => {
        const lowerTag = tag.toLowerCase();
        if (['anime', 'donghua', 'otros'].includes(lowerTag)) return 'bg-blue-600';
        if (['tv', 'bd', 'ova', 'especial'].includes(lowerTag)) return 'bg-purple-600';
        if (['en progreso'].includes(lowerTag)) return 'bg-yellow-600 text-black';
        if (['finalizado'].includes(lowerTag)) return 'bg-green-600';
        if (['pausado'].includes(lowerTag)) return 'bg-orange-600';
        if (['cancelado'].includes(lowerTag)) return 'bg-red-700';
        return 'bg-gray-600';
    };

    // --- FIX: Use item.id (which contains the full filename) for the link destination ---
    // The 'id' field should hold the filename like "2025-04-05-manga-xyz-10"
    // as set in TraduccionesPage.tsx
    const destination = `/traducciones/${item.id}`;
    const displayTags = item.tags ?? [];

    return (
        // The Link component now uses the corrected destination
        <Link to={destination} className="group block overflow-hidden rounded-lg shadow-lg bg-gray-800/80 border border-gray-700/50 hover:border-green-400 transition-all duration-300 hover:shadow-green-500/20 hover:shadow-lg flex flex-col h-full">
            {/* Image container */}
            <div className="relative aspect-[3/4]">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={`Imagen para ${item.title}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/111827/9CA3AF?text=Error'; }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                         <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                )}
                {/* Tags Overlay */}
                {displayTags.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10">
                        {displayTags.slice(0, 3).map((tag) => (
                            <span key={tag} className={`text-white text-[10px] font-semibold px-1.5 py-0.5 rounded ${getTagColor(tag)} opacity-90 group-hover:opacity-100 transition-opacity shadow`} >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
            {/* Content below image */}
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors mb-1.5 line-clamp-2" title={item.title}>
                    {item.title}
                </h4>
                <p className="text-xs text-gray-400 mb-2 flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                   {new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className="text-xs text-green-400 mt-auto self-start group-hover:underline font-medium pt-1">
                    Leer más &rarr;
                 </span>
            </div>
        </Link>
    );
};

export default TranslationItemCard;
