import React from 'react';
import { Link } from 'react-router-dom';

// Define types for the props expected by this card
interface TranslationItem {
    id: string;
    title: string;
    link: string;
    imageUrl: string;
    tags: string[];
    date: string;
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
        // Main Categories
        if (['anime', 'donghua', 'otros'].includes(lowerTag)) return 'bg-blue-600';
        // Format Categories
        if (['tv', 'bd', 'ova', 'especial'].includes(lowerTag)) return 'bg-purple-600';
        // Status Categories
        if (['en progreso'].includes(lowerTag)) return 'bg-yellow-600 text-black';
        if (['finalizado'].includes(lowerTag)) return 'bg-green-600';
        if (['pausado'].includes(lowerTag)) return 'bg-orange-600'; // New color for Pausado
        if (['cancelado'].includes(lowerTag)) return 'bg-red-700'; // New color for Cancelado
        return 'bg-gray-600'; // Default
    };

    return (
        <Link to={item.link} className="group block overflow-hidden rounded-lg shadow-lg bg-gray-800/80 border border-gray-700/50 hover:border-green-400 transition-all duration-300 hover:shadow-green-500/20 hover:shadow-lg flex flex-col h-full">
            {/* Image container with vertical aspect ratio */}
            <div className="relative aspect-[3/4]">
                <img
                    src={item.imageUrl}
                    alt={`Imagen para ${item.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/111827/9CA3AF?text=Error'; }}
                />
                {/* Tags Overlay */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10">
                    {item.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className={`text-white text-[10px] font-semibold px-1.5 py-0.5 rounded ${getTagColor(tag)} opacity-90 group-hover:opacity-100 transition-opacity shadow`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
            {/* Content below image */}
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-base font-semibold text-white group-hover:text-green-300 transition-colors mb-1.5 line-clamp-2" title={item.title}>
                    {item.title}
                </h4>
                <p className="text-xs text-gray-400 mb-2 flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                   {item.date}
                </p>
                <span className="text-xs text-green-400 mt-auto self-start group-hover:underline font-medium pt-1">
                    Leer más &rarr;
                 </span>
            </div>
        </Link>
    );
};

export default TranslationItemCard;
