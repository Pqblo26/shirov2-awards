import React from 'react';
import { motion } from 'framer-motion';

// Define types for props
interface Winner {
    id: string | number;
    category: string;
    image: string;
    name: string;
    extra?: string;
    color: string; // Consider using a specific literal type ('pink' | 'yellow' | ...)
}

interface WinnerCardProps {
    winner: Winner;
}

// Color styles definition (could also be moved to a separate file/theme config)
const colorStyles: { [key: string]: any } = { // Use a more specific type if possible
    pink: { border: 'border-pink-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(236,72,153,0.5)]', ring: 'hover:ring-pink-400/60', text: 'text-pink-400', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-500', buttonBg: 'bg-pink-600', buttonHoverBg: 'hover:bg-pink-500' },
    yellow: { border: 'border-yellow-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(234,179,8,0.5)]', ring: 'hover:ring-yellow-400/60', text: 'text-yellow-400', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-500', buttonBg: 'bg-yellow-600', buttonHoverBg: 'hover:bg-yellow-500' },
    indigo: { border: 'border-indigo-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(99,102,241,0.5)]', ring: 'hover:ring-indigo-400/60', text: 'text-indigo-400', bg: 'bg-indigo-600', hoverBg: 'hover:bg-indigo-500', buttonBg: 'bg-indigo-600', buttonHoverBg: 'hover:bg-indigo-500' },
    red: { border: 'border-red-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(239,68,68,0.5)]', ring: 'hover:ring-red-400/60', text: 'text-red-400', bg: 'bg-red-600', hoverBg: 'hover:bg-red-500', buttonBg: 'bg-red-600', buttonHoverBg: 'hover:bg-red-500' },
    blue: { border: 'border-blue-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.5)]', ring: 'hover:ring-blue-400/60', text: 'text-blue-400', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', buttonBg: 'bg-blue-600', buttonHoverBg: 'hover:bg-blue-500' },
    orange: { border: 'border-orange-500', hoverShadow: 'hover:shadow-[0_0_25px_5px_rgba(249,115,22,0.5)]', ring: 'hover:ring-orange-400/60', text: 'text-orange-400', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-500', buttonBg: 'bg-orange-600', buttonHoverBg: 'hover:bg-orange-500' },
    default: { border: 'border-gray-700', hoverShadow: 'hover:shadow-gray-500/30', ring: 'hover:ring-gray-500/40', text: 'text-gray-300', bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-500', buttonBg: 'bg-gray-600', buttonHoverBg: 'hover:bg-gray-500' }
};


const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
    const styles = colorStyles[winner.color] || colorStyles.default;

    const handleInfoClick = () => {
        console.log(`Mostrar info de: ${winner.name}`);
        // Modal Logic Placeholder
    };

    // Variants for staggering animation (can be defined here or passed as props)
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className={`relative group bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-xl border ${styles.border} transition-all duration-300 text-center hover:ring-2 ${styles.ring} ${styles.hoverShadow} hover:-translate-y-2 flex flex-col`}
            variants={cardVariants} // Use variants for animation within parent stagger
            // Removed initial/animate from here, handled by parent stagger in page component
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        >
            {/* Card Content */}
            <div className="flex-grow">
                <h3 className={`text-xl font-bold mb-3 ${styles.text} drop-shadow-md`}>{winner.category}</h3>
                <div className="overflow-hidden rounded-lg mb-3 border border-gray-700">
                    <motion.img
                        src={winner.image}
                        alt={`Ganador: ${winner.name}`}
                        className="w-full h-60 object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement; // Type assertion
                            target.onerror = null;
                            target.src = "https://placehold.co/400x600/7F1D1D/FECACA?text=Error+Imagen";
                            target.alt = "Error al cargar la imagen";
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-lg font-semibold text-white tracking-wide">{winner.name}</p>
                {winner.extra && <p className="text-sm text-gray-400 mt-1 italic">{winner.extra}</p>}
            </div>
            {/* Info Button */}
            <motion.button
                onClick={handleInfoClick}
                className={`mt-4 ${styles.buttonBg} text-white text-xs px-4 py-1.5 rounded-full shadow ${styles.buttonHoverBg} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${styles.ring} self-center`}
                aria-label={`Ver más información sobre ${winner.name}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                Ver info
            </motion.button>
        </motion.div>
    );
};

export default WinnerCard;