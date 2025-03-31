import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimeAwards2025() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    document.title = "Shiro Awards 2025";
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const WinnerCard = ({ category, image, name, extra, color }) => (
    <div
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-2xl border border-${color}-500 hover:scale-105 hover:shadow-${color}-500/50 transition-all duration-300 text-center hover:ring-2 hover:ring-${color}-300/40`}
    >
      <h3 className={`text-xl font-bold mb-3 text-${color}-400 drop-shadow`}>{category}</h3>
      <img src={image} alt={name} className="w-full h-60 object-cover rounded-lg mb-3 border border-gray-700" />
      <p className="text-lg font-semibold text-white tracking-wide">{name}</p>
      {extra && <p className="text-sm text-gray-400 mt-1 italic">{extra}</p>}
      <button className="absolute top-2 right-2 bg-${color}-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-${color}-700 transition-opacity opacity-0 group-hover:opacity-100">
        Ver info
      </button>
    </div>
  );

  return (
    <main className="bg-gradient-to-b from-gray-950 to-gray-900 text-white font-sans scroll-smooth relative">
      

      

      <header className="relative py-14 px-6 overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 shadow-xl border-b border-pink-500">
  {/* Fondo de estrellas animado */}
  <div className="absolute inset-0 bg-[url('/background-stars.svg')] bg-cover opacity-10 animate-pulse"></div>

  {/* Luz diagonal */}
  <div className="absolute -top-1/2 left-0 w-full h-full bg-gradient-to-r from-transparent via-pink-400/10 to-transparent rotate-12 animate-[shine_12s_linear_infinite]"></div>

  {/* Contenido principal */}
  <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
    {/* Iconos decorativos */}
    <div className="flex justify-center items-center gap-4 mb-4">
      <span className="text-pink-300 text-2xl animate-bounce">⭐</span>
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-white to-pink-400 text-transparent bg-clip-text tracking-wide font-[ZenDots] drop-shadow-md animate-text-shimmer">
        Shiro Awards 2025
      </h1>
      <span className="text-pink-300 text-2xl animate-bounce">🏆</span>
    </div>
    <p className="text-xl md:text-2xl text-pink-100 italic mt-2 max-w-2xl mx-auto font-light animate-fade-in-up">
      Lo mejor del anime, reunido en una gala inolvidable.
    </p>
    {/* Línea decorativa */}
    <div className="mt-6 w-28 h-1 bg-gradient-to-r from-pink-500 via-white to-pink-500 mx-auto rounded-full animate-pulse"></div>
  </div>
</header>

<style jsx>{`
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-text-shimmer {
  background-size: 200% auto;
  animation: shimmer 4s linear infinite;
}

.animate-fade-in {
  animation: fade-in 1.5s ease-out both;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out both;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-float-delay {
  animation: float 12s ease-in-out infinite;
}
`}</style>

<nav className="bg-gray-950/90 backdrop-blur-md py-4 shadow-lg border-t border-pink-500 animate-fade-in-up">
  <ul className="flex justify-center flex-wrap gap-4 text-sm font-semibold text-pink-300">
    <li><a href="#premios" className="px-4 py-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition">Premios</a></li>
    <li><a href="#temporadas" className="px-4 py-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition">Temporadas</a></li>
    <li><a href="#aspect" className="px-4 py-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition">Aspect</a></li>
    <li><a href="#actores" className="px-4 py-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition">Actores</a></li>
    <li><a href="#generos" className="px-4 py-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition">Géneros</a></li>
  </ul>
</nav>

      

      <section id="temporadas" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
  <div className="text-center mb-14">
    <h2 className="text-5xl font-extrabold text-white tracking-wide mb-6 font-[ZenDots] border-b-4 border-pink-500 inline-block pb-2">
      Ganadores por Temporada
    </h2>
    <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
      Un repaso a lo mejor de cada estación del año.
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Winter", "Spring", "Summer", "Fall"].map(season => (
            <WinnerCard
              key={season}
              category={season}
              image="/placeholder.jpg"
              name="Ganador de la temporada"
              extra="Estudio o info extra"
              color="pink"
            />
          ))}
        </div>
      </section>

      <section id="aspect" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
  <div className="text-center mb-14">
    <h2 className="text-5xl font-extrabold text-white tracking-wide mb-6 font-[ZenDots] border-b-4 border-yellow-400 inline-block pb-2">
      Aspect Awards
    </h2>
    <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
      Reconociendo la excelencia técnica y visual de las mejores producciones.
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 group">
          {["Mejor Adaptación", "Mejor Animación", "Banda Sonora", "Mejor Estudio"].map(aspect => (
            <WinnerCard
              key={aspect}
              category={aspect}
              image="/placeholder.jpg"
              name="Nombre del ganador"
              extra="Detalles adicionales"
              color="yellow"
            />
          ))}
        </div>
      </section>

      <section id="actores" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
  <div className="text-center mb-14">
    <h2 className="text-5xl font-extrabold text-white tracking-wide mb-6 font-[ZenDots] border-b-4 border-indigo-400 inline-block pb-2">
      Actores Awards
    </h2>
    <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
      Voces inolvidables que dieron vida a los personajes del año.
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["Mejor Actor de Voz", "Mejor Actriz de Voz"].map(role => (
            <WinnerCard
              key={role}
              category={role}
              image="/placeholder.jpg"
              name="Nombre del ganador"
              extra="Detalles adicionales"
              color="indigo"
            />
          ))}
        </div>
      </section>

      <section id="generos" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
  <div className="text-center mb-14">
    <h2 className="text-5xl font-extrabold text-white tracking-wide mb-6 font-[ZenDots] border-b-4 border-red-400 inline-block pb-2">
      Géneros del Año
    </h2>
    <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
      Categorías que definieron las emociones, aventuras y risas del año.
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Acción", "Aventura", "Comedia", "Drama", "Deporte", "Romance", "Sci-Fi / Mecha", "Slice of Life", "Supernatural", "Ecchi"].map(genre => (
            <WinnerCard
              key={genre}
              category={genre}
              image="/placeholder.jpg"
              name="Nombre del ganador"
              extra="Detalles adicionales"
              color="red"
            />
          ))}
        </div>
      </section>

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-700 transition-all z-50"
        >
          ↑ Subir arriba
        </button>
      )}

      <footer className="p-6 text-center text-sm text-gray-500 border-t border-gray-700 mt-10">
        &copy; 2025 Shiro Awards by Jesús · Todos los derechos reservados
      </footer>
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
  <div className="w-80 h-80 bg-pink-500 opacity-10 blur-3xl rounded-full absolute -top-20 -left-20 animate-float" />
  <div className="w-96 h-96 bg-purple-500 opacity-10 blur-3xl rounded-full absolute -bottom-40 -right-20 animate-float-delay" />
</div>


</main>
  );
}