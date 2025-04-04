import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Importa un icono para el botón de scroll (ejemplo con lucide-react, necesitarías instalarlo)
// O usa un SVG/emoji directamente si prefieres no añadir dependencias.
// import { ArrowUp } from 'lucide-react';

// --- Datos de los Premios ---
// Es mejor gestionar los datos fuera del componente principal.
// Reemplaza estos datos de ejemplo con los ganadores reales.

const seasonWinnersData = [
  {
    id: "winter",
    category: "Mejor Anime de Invierno",
    image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Invierno+Ganador",
    name: "Anime Ejemplo Invierno",
    extra: "Estudio MAPPA",
    color: "blue", // Color asociado a la sección
  },
  {
    id: "spring",
    category: "Mejor Anime de Primavera",
    image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Primavera+Ganador",
    name: "Anime Ejemplo Primavera",
    extra: "Estudio WIT",
    color: "pink", // Cambiado para variedad
  },
  {
    id: "summer",
    category: "Mejor Anime de Verano",
    image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Verano+Ganador",
    name: "Anime Ejemplo Verano",
    extra: "Estudio Bones",
    color: "orange", // Cambiado para variedad
  },
  {
    id: "fall",
    category: "Mejor Anime de Otoño",
    image: "https://placehold.co/400x600/1F2937/E5E7EB?text=Otoño+Ganador",
    name: "Anime Ejemplo Otoño",
    extra: "Estudio Ufotable",
    color: "red", // Cambiado para variedad
  },
];

const aspectWinnersData = [
  { id: "adaptacion", category: "Mejor Adaptación", image: "https://placehold.co/400x600/374151/D1D5DB?text=Adaptación", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
  { id: "animacion", category: "Mejor Animación", image: "https://placehold.co/400x600/374151/D1D5DB?text=Animación", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
  { id: "banda_sonora", category: "Mejor Banda Sonora", image: "https://placehold.co/400x600/374151/D1D5DB?text=B.Sonora", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
  { id: "estudio", category: "Mejor Estudio", image: "https://placehold.co/400x600/374151/D1D5DB?text=Estudio", name: "Nombre Ganador", extra: "Detalles", color: "yellow" },
];

const actorWinnersData = [
  { id: "actor_voz", category: "Mejor Actor de Voz", image: "https://placehold.co/400x600/4B5563/9CA3AF?text=Actor+Voz", name: "Nombre Ganador", extra: "Personaje", color: "indigo" },
  { id: "actriz_voz", category: "Mejor Actriz de Voz", image: "https://placehold.co/400x600/4B5563/9CA3AF?text=Actriz+Voz", name: "Nombre Ganador", extra: "Personaje", color: "indigo" },
];

const genreWinnersData = [
  { id: "accion", category: "Acción", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Acción", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  { id: "aventura", category: "Aventura", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Aventura", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  { id: "comedia", category: "Comedia", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Comedia", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  { id: "drama", category: "Drama", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Drama", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  { id: "deporte", category: "Deporte", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Deporte", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  { id: "romance", category: "Romance", image: "https://placehold.co/400x600/5A0000/FCA5A5?text=Romance", name: "Nombre Ganador", extra: "Detalles", color: "red" },
  // Añade el resto de géneros aquí...
];

// --- Componente WinnerCard ---
// Tarjeta reutilizable para mostrar un ganador
const WinnerCard = ({ winner }) => {
  // Mapeo de colores a clases de Tailwind para evitar concatenación insegura
  const colorClasses = {
    pink: {
      border: 'border-pink-500',
      hoverShadow: 'hover:shadow-pink-500/50',
      ring: 'hover:ring-pink-300/40',
      text: 'text-pink-400',
      bg: 'bg-pink-600',
      hoverBg: 'hover:bg-pink-700',
      buttonBg: 'bg-pink-600',
      buttonHoverBg: 'hover:bg-pink-700',
    },
    yellow: {
      border: 'border-yellow-500',
      hoverShadow: 'hover:shadow-yellow-500/50',
      ring: 'hover:ring-yellow-300/40',
      text: 'text-yellow-400',
      bg: 'bg-yellow-600',
      hoverBg: 'hover:bg-yellow-700',
      buttonBg: 'bg-yellow-600',
      buttonHoverBg: 'hover:bg-yellow-700',
    },
    indigo: {
      border: 'border-indigo-500',
      hoverShadow: 'hover:shadow-indigo-500/50',
      ring: 'hover:ring-indigo-300/40',
      text: 'text-indigo-400',
      bg: 'bg-indigo-600',
      hoverBg: 'hover:bg-indigo-700',
      buttonBg: 'bg-indigo-600',
      buttonHoverBg: 'hover:bg-indigo-700',
    },
    red: {
      border: 'border-red-500',
      hoverShadow: 'hover:shadow-red-500/50',
      ring: 'hover:ring-red-300/40',
      text: 'text-red-400',
      bg: 'bg-red-600',
      hoverBg: 'hover:bg-red-700',
      buttonBg: 'bg-red-600',
      buttonHoverBg: 'hover:bg-red-700',
    },
    blue: {
       border: 'border-blue-500',
       hoverShadow: 'hover:shadow-blue-500/50',
       ring: 'hover:ring-blue-300/40',
       text: 'text-blue-400',
       bg: 'bg-blue-600',
       hoverBg: 'hover:bg-blue-700',
       buttonBg: 'bg-blue-600',
       buttonHoverBg: 'hover:bg-blue-700',
    },
    orange: {
       border: 'border-orange-500',
       hoverShadow: 'hover:shadow-orange-500/50',
       ring: 'hover:ring-orange-300/40',
       text: 'text-orange-400',
       bg: 'bg-orange-600',
       hoverBg: 'hover:bg-orange-700',
       buttonBg: 'bg-orange-600',
       buttonHoverBg: 'hover:bg-orange-700',
    },
    // Añade más colores si es necesario
  };

  const styles = colorClasses[winner.color] || colorClasses.pink; // Default a pink si el color no existe

  const handleInfoClick = () => {
    // Acción al hacer clic en "Ver info" (ej. abrir modal, navegar, etc.)
    console.log(`Mostrar info de: ${winner.name}`);
    // Aquí podrías implementar la lógica para mostrar un modal
  };

  return (
    <motion.div
      className={`relative group bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-xl border ${styles.border} transition-all duration-300 text-center hover:ring-2 ${styles.ring} ${styles.hoverShadow} hover:-translate-y-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <h3 className={`text-xl font-bold mb-3 ${styles.text} drop-shadow-md`}>{winner.category}</h3>
      <img
        src={winner.image}
        alt={`Ganador: ${winner.name}`} // Alt text descriptivo
        className="w-full h-60 object-cover rounded-lg mb-3 border border-gray-700"
        onError={(e) => {
          // Fallback si la imagen no carga
          e.target.onerror = null; // Previene bucles infinitos
          e.target.src="https://placehold.co/400x600/7F1D1D/FECACA?text=Error+Imagen";
          e.target.alt = "Error al cargar la imagen";
        }}
      />
      <p className="text-lg font-semibold text-white tracking-wide">{winner.name}</p>
      {winner.extra && <p className="text-sm text-gray-400 mt-1 italic">{winner.extra}</p>}
      {/* Botón "Ver info" - aparece al hacer hover sobre la tarjeta */}
      <button
        onClick={handleInfoClick}
        className={`absolute top-3 right-3 ${styles.buttonBg} text-white text-xs px-3 py-1 rounded-full shadow ${styles.buttonHoverBg} transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${styles.ring}`}
        aria-label={`Ver más información sobre ${winner.name}`}
      >
        Ver info
      </button>
    </motion.div>
  );
};


// --- Componente Principal ---
export default function AnimeAwards2025() {
  const [showTopButton, setShowTopButton] = useState(false);

  // Efecto para el título y el botón de scroll
  useEffect(() => {
    document.title = "Shiro Awards 2025";
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    // Limpia el event listener al desmontar el componente
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Array vacío asegura que el efecto se ejecute solo una vez al montar

  // Función para hacer scroll suave hacia arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Estilos y Animaciones CSS (Integrados o con Tailwind) ---
  // Nota: Las animaciones 'shine', 'shimmer', 'marquee', 'float' necesitan ser definidas
  // ya sea en tu archivo CSS global o en un archivo CSS importado,
  // o si usas Tailwind JIT, en tu tailwind.config.js.
  // Aquí se usan clases de Tailwind donde es posible.

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    // Se añade 'scroll-smooth' para el comportamiento de los enlaces de ancla
    <main className="bg-gradient-to-b from-gray-950 to-gray-900 text-white font-sans scroll-smooth relative overflow-x-hidden">

      {/* Elementos decorativos de fondo (Blur gradients) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="w-80 h-80 bg-pink-500/10 blur-3xl rounded-full absolute -top-20 -left-20 animate-pulse" />
        <div className="w-96 h-96 bg-purple-500/10 blur-3xl rounded-full absolute -bottom-40 -right-20 animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      {/* Header */}
      <header className="relative py-16 px-6 overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 shadow-xl border-b border-pink-500/50">
        {/* Fondo de estrellas (requiere 'background-stars.svg' en public o un CDN) */}
        {/* <div className="absolute inset-0 bg-[url('/background-stars.svg')] bg-repeat opacity-5 animate-pulse"></div> */}
        {/* Alternativa simple sin imagen externa */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>


        {/* Luz diagonal animada */}
        <div className="absolute -top-1/2 left-0 w-full h-[200%] bg-gradient-to-r from-transparent via-pink-400/10 to-transparent animate-[shine_10s_linear_infinite] opacity-50" style={{ transform: 'rotate(15deg)' }}></div>

        {/* Contenido principal del Header */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <motion.span
              className="text-pink-300 text-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >⭐</motion.span>
            {/* Asegúrate de tener la fuente 'Zen Dots' cargada */}
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-300 via-white to-pink-400 text-transparent bg-clip-text tracking-tight font-['Zen_Dots',_sans-serif] drop-shadow-lg animate-text-shimmer">
              Shiro Awards 2025
            </h1>
             <motion.span
              className="text-pink-300 text-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            >🏆</motion.span>
          </div>
          <motion.p
             className="text-xl md:text-2xl text-pink-100 italic mt-3 max-w-2xl mx-auto font-light"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
           >
            Celebrando lo mejor del anime del año.
          </motion.p>
          {/* Línea decorativa */}
          <motion.div
            className="mt-8 w-32 h-1 bg-gradient-to-r from-pink-500 via-white to-pink-500 mx-auto rounded-full animate-pulse"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          ></motion.div>
        </motion.div>
      </header>

      {/* Navegación Sticky */}
      <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-lg py-3 shadow-lg border-b border-gray-700/50">
        <ul className="flex justify-center flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-pink-200 px-4">
          {/* Enlaces de ancla para navegación interna */}
          <li><a href="#temporadas" className="px-4 py-1.5 rounded-full hover:bg-pink-600 hover:text-white transition-colors duration-200">Temporadas</a></li>
          <li><a href="#aspect" className="px-4 py-1.5 rounded-full hover:bg-yellow-600 hover:text-white transition-colors duration-200">Aspectos Técnicos</a></li>
          <li><a href="#actores" className="px-4 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-200">Actores de Voz</a></li>
          <li><a href="#generos" className="px-4 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200">Géneros</a></li>
        </ul>
      </nav>

      {/* --- Secciones de Premios --- */}

      {/* Sección Ganadores por Temporada */}
      <motion.section
        id="temporadas"
        className="relative z-10 py-20 px-6 max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // La animación se dispara cuando el 20% es visible
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-pink-500 inline-block pb-2 px-4">
            Ganadores por Temporada
          </h2>
          <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
            Un repaso a lo mejor de cada estación del año.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {seasonWinnersData.map(winner => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>
      </motion.section>

      {/* Sección Aspect Awards */}
      <motion.section
        id="aspect"
        className="relative z-10 py-20 px-6 max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-yellow-400 inline-block pb-2 px-4">
            Premios Técnicos y Visuales
          </h2>
          <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
            Reconociendo la excelencia en la producción.
          </p>
        </div>
        {/* Ajustado a 4 columnas para esta sección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {aspectWinnersData.map(winner => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>
      </motion.section>

      {/* Sección Actores Awards */}
      <motion.section
        id="actores"
        className="relative z-10 py-20 px-6 max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-indigo-400 inline-block pb-2 px-4">
            Premios de Actuación de Voz
          </h2>
          <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
            Voces inolvidables que dieron vida a los personajes.
          </p>
        </div>
        {/* Ajustado a 2 columnas centradas */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {actorWinnersData.map(winner => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>
      </motion.section>

      {/* Sección Géneros del Año */}
      <motion.section
        id="generos"
        className="relative z-10 py-20 px-6 max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 font-['Zen_Dots',_sans-serif] border-b-4 border-red-400 inline-block pb-2 px-4">
            Ganadores por Género
          </h2>
          <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
            Lo más destacado en cada categoría narrativa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {genreWinnersData.map(winner => (
            <WinnerCard key={winner.id} winner={winner} />
          ))}
        </div>
      </motion.section>

      {/* Botón para Volver Arriba */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-300 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            aria-label="Volver arriba"
          >
            {/* Icono (ejemplo con SVG inline) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            {/* O si instalaste lucide-react: <ArrowUp size={24} /> */}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-700/50 mt-16 relative z-10">
        &copy; {new Date().getFullYear()} Shiro Awards by Jesús · Todos los derechos reservados
        <p className="mt-2 text-xs">Hecho con React, Tailwind CSS y Framer Motion</p>
      </footer>

      {/* Estilos para animaciones personalizadas (si no están en tailwind.config.js) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap');

        body {
          font-family: 'Inter', sans-serif; /* Fuente base */
        }

        /* Animación de brillo para el texto del título */
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* Animación de luz diagonal */
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(100%) rotate(15deg); }
        }

        /* Puedes añadir otras animaciones como 'float' aquí si es necesario */
        /* @keyframes float { ... } */

        /* Asegura que la fuente Zen Dots se aplique donde se usa la clase */
        .font-['Zen_Dots',_sans-serif] {
            font-family: 'Zen Dots', sans-serif;
        }
      `}</style>
    </main>
  );
}