import React from 'react';
import { Link } from 'react-router-dom';
// Removed motion import, parent handles animation

// Define types for the props expected by this card
interface TranslationItem {
    id: string;
    title: string;
    link: string;
    imageUrl: string;
    tags: string[]; // Array of tags (e.g., ["Manga", "TV", "En Progreso"])
}

interface TranslationItemCardProps {
    item: TranslationItem;
}

const TranslationItemCard: React.FC<TranslationItemCardProps> = ({ item }) => {
    // Function to assign colors based on tag content (customize as needed)
    const getTagColor = (tag: string): string => {
        tag = tag.toLowerCase();
        // Main Categories
        if (['manga', 'donghua', 'anime', 'otros', 'videojuego', 'novela', 'entrevista', 'noticia', 'guía', 'análisis'].includes(tag)) return 'bg-blue-600';
        // Format Categories
        if (['tv', 'web', 'bd', 'ova', 'especial'].includes(tag)) return 'bg-purple-600';
        // Status Categories
        if (['en progreso'].includes(tag)) return 'bg-yellow-600 text-black'; // Example different color
        if (['finalizado'].includes(tag)) return 'bg-green-600';
        return 'bg-gray-600'; // Default for any other tag
    };

    return (
         // Root element is the Link itself
        <Link to={item.link} className="group block overflow-hidden rounded-lg shadow-lg bg-gray-800/80 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-green-500/10">
            {/* Image container */}
            <div className="relative aspect-video"> {/* Use aspect ratio for consistent image size */}
                <img
                    src={item.imageUrl}
                    alt={`Imagen para ${item.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/320x180/111827/9CA3AF?text=Error'; }} // Placeholder matching aspect ratio
                />
                {/* Tags Overlay */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10">
                    {item.tags.slice(0, 3).map((tag) => ( // Limit number of visible tags if needed
                        <span
                            key={tag}
                            className={`text-white text-[10px] font-semibold px-1.5 py-0.5 rounded ${getTagColor(tag)} opacity-90 group-hover:opacity-100 transition-opacity shadow`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                 {/* Optional: Gradient overlay for better tag visibility */}
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </div>
            {/* Title below image */}
            <div className="p-3">
                <h4 className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors truncate" title={item.title}> {/* Truncate long titles */}
                    {item.title}
                </h4>
                {/* Add excerpt or other info here if needed */}
            </div>
        </Link>
    );
};

export default TranslationItemCard;
