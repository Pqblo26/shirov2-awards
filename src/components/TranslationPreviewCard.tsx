import React from 'react';
import { Link } from 'react-router-dom';
// Removed motion import, assuming parent handles animation

// Define types for the props expected by this card
interface TranslationPreview {
    id: string;
    title: string;
    excerpt: string;
    link: string;
    imageUrl: string;
    tag: string;
    date: string;
    source: string;
}

interface TranslationPreviewCardProps {
    item: TranslationPreview;
}

const TranslationPreviewCard: React.FC<TranslationPreviewCardProps> = ({ item }) => {
    return (
        // Root element is a standard div, parent motion.div handles animation
        <div className="bg-gradient-to-tr from-gray-800/70 to-gray-900/80 rounded-xl shadow-lg overflow-hidden border border-gray-700/60 hover:border-green-500/60 transition-all duration-300 group flex flex-col sm:flex-row h-full">
            {/* Left: Image */}
            <div className="flex-shrink-0 sm:w-40 md:w-48">
                <img
                    src={item.imageUrl}
                    alt={`Imagen para ${item.title}`}
                    className="w-full h-32 sm:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/111827/9CA3AF?text=Error'; }}
                />
            </div>
            {/* Right: Content */}
            <Link to={item.link} className="p-4 sm:p-5 flex flex-col flex-grow relative">
                 <span className="absolute top-3 right-3 bg-green-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
                    {item.tag}
                 </span>
                <h4 className="text-base md:text-lg font-semibold mb-1.5 text-white group-hover:text-green-300 transition-colors pr-16">
                    {item.title}
                </h4>
                 <div className="flex items-center flex-wrap gap-x-3 text-xs text-gray-400 mb-2">
                     <span className="flex items-center whitespace-nowrap">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                         {item.date}
                     </span>
                     <span className="flex items-center truncate whitespace-nowrap">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
                         {item.source}
                     </span>
                 </div>
                <p className="text-sm text-gray-300/90 flex-grow mb-3 line-clamp-2">
                    {item.excerpt}
                </p>
                 <span className="text-xs text-green-400 mt-auto pt-2 self-start group-hover:underline font-medium">
                    Leer más &rarr;
                 </span>
            </Link>
        </div>
    );
};

export default TranslationPreviewCard;
