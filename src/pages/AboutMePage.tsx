import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Import Feather icon from lucide-react
import { Twitter, Mail, Github, Code, Wind, Database, Feather, Users, ArrowDownCircle } from 'lucide-react'; // Added Users & ArrowDownCircle icons
import ScrollToTopButton from '../components/ScrollToTopButton';

// --- Iconos SVG Mejorados ---

// Icono Discord (SVG Alternativo - Correcto)
const DiscordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1 .015.019.05.05 0 0 1-.02.066 8.875 8.875 0 0 1-1.248.595.05.05 0 0 0-.01.059.051.051 0 0 0-.018.011c.236.466.51.899.818 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
    </svg>
);

// Placeholder Icon for React & Vite (Using Code icon as generic)
const ReactIcon = Code;
const ViteIcon = Wind; // Using Wind as a metaphor for speed
const DecapIcon = Database; // Using Database as a metaphor for CMS


function AboutMePage() {
    useEffect(() => {
        document.title = "Sobre Mí | Shiro Nexus";
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };
    const iconVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } }
    };


    return (
        <motion.div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-gray-200"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            {/* Page Title */}
            <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                variants={itemVariants}
            >
                Sobre el Proyecto
            </motion.h1>

            {/* Introduction Section */}
            <motion.section className="mb-16 md:mb-20" variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-purple-300">Motivación</h2>
                <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                    Shiro Nexus es un proyecto personal nacido de la pasión por el anime y el manga, y el deseo de compartir traducciones y contenido de calidad con la comunidad hispanohablante. Buscamos ofrecer un espacio cuidado y accesible para disfrutar de este hobby.
                </p>
            </motion.section>

            {/* Team Section */}
            <motion.section className="mb-16 md:mb-20" variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-pink-300">El Equipo</h2>
                <div className="flex justify-center">
                    <motion.div
                        className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center shadow-lg max-w-sm"
                        variants={itemVariants}
                    >
                        <img
                            src="https://placehold.co/150x150/374151/E5E7EB?text=P"
                            alt="Avatar de Pablo"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-pink-400"
                        />
                        <h3 className="text-xl font-semibold text-white mb-1">Pablo (Shiro)</h3>
                        <p className="text-pink-400 text-sm font-medium mb-3">Fundador / Webmaster / Traductor</p>
                        <p className="text-gray-400 text-sm">
                            Principal desarrollador y encargado de mantener Shiro Nexus funcionando. Siempre aprendiendo y buscando mejorar el sitio.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* --- Únete al Equipo Section --- */}
            <motion.section className="mb-16 md:mb-20" variants={itemVariants}>
                 <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-lime-300">Únete al Equipo</h2>
                 <div className="bg-gray-800/50 p-6 md:p-8 rounded-lg border border-gray-700 shadow-lg text-center">
                    <Users size={40} className="mx-auto mb-4 text-lime-400"/>
                    <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
                         ¿Te apasiona la traducción, edición, corrección o el typesetting? ¡Siempre estamos buscando gente con ganas de colaborar y aportar su granito de arena al proyecto!
                    </p>
                    <p className="text-md text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8"> {/* Added margin bottom */}
                         Si estás interesado/a, no dudes en ponerte en contacto a través de los métodos indicados más abajo. ¡Te esperamos!
                    </p>
                    {/* --- ENLACE AÑADIDO --- */}
                    <motion.a
                        href="#contacto" // Enlace interno a la sección de contacto
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-lg shadow transition-colors text-sm"
                        variants={itemVariants} // Puedes usar itemVariants o crear uno específico
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowDownCircle size={18} /> {/* Icono para indicar scroll/ir a */}
                        Ver Métodos de Contacto
                    </motion.a>
                     {/* --- FIN ENLACE AÑADIDO --- */}
                 </div>
            </motion.section>
            {/* --- FIN NUEVA SECCIÓN --- */}


            {/* About the Website Section */}
            <motion.section className="mb-16 md:mb-20" variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-cyan-300">Sobre la Web</h2>
                <div className="bg-gray-800/50 p-6 md:p-8 rounded-lg border border-gray-700 shadow-lg">
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Esta web ha sido desarrollada con el objetivo de ser una plataforma moderna, rápida y fácil de usar, además de servir como un escaparate del proyecto y de las tecnologías aprendidas durante su creación. Las tecnologías principales utilizadas son:
                    </p>
                    {/* Technology Icons */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
                        <motion.div variants={iconVariants} className="flex flex-col items-center text-center w-20">
                            <ReactIcon size={36} className="mb-1 text-cyan-400"/>
                            <span className="text-xs text-gray-400">React</span>
                        </motion.div>
                        <motion.div variants={iconVariants} className="flex flex-col items-center text-center w-20">
                            <ViteIcon size={36} className="mb-1 text-purple-400"/>
                            <span className="text-xs text-gray-400">Vite</span>
                        </motion.div>
                        <motion.div variants={iconVariants} className="flex flex-col items-center text-center w-20">
                            <Feather size={36} className="mb-1 text-teal-400"/> {/* Usando Feather */}
                            <span className="text-xs text-gray-400 mt-1">Tailwind</span>
                        </motion.div>
                         <motion.div variants={iconVariants} className="flex flex-col items-center text-center w-20">
                            <DecapIcon size={36} className="mb-1 text-green-400"/>
                            <span className="text-xs text-gray-400">Decap CMS</span>
                        </motion.div>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-6 text-center">
                        El contenido se gestiona a través de Decap CMS con un backend de GitHub, permitiendo una fácil actualización de traducciones, premios y otros elementos.
                    </p>
                    {/* GitHub Link */}
                    <div className="text-center">
                        <motion.a
                            href="https://github.com/Pqblo26/shirov2-awards" // Enlace a tu repo
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-md transition-colors border border-gray-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Github size={18} />
                            Ver Repositorio en GitHub
                        </motion.a>
                    </div>
                </div>
            </motion.section>

             {/* Contact Section --- ID AÑADIDO --- */}
             <motion.section id="contacto" variants={itemVariants}>
             {/* --- FIN ID AÑADIDO --- */}
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-green-300">Contacto</h2>
                <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-8">
                    Si quieres contactar, reportar algún problema, unirte al equipo o simplemente charlar, puedes encontrarme en:
                </p>
                <motion.div
                    className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
                    variants={containerVariants} // Stagger children links
                >
                    {/* Discord */}
                    <motion.a
                        href="https://discord.gg/vR57X7vtSd" // Reemplaza con tu enlace de Discord
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors text-sm"
                        variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        <DiscordIcon />
                        Discord
                    </motion.a>
                    {/* Twitter */}
                    <motion.a
                        href="https://x.com/shirooo26" // Reemplaza con tu enlace de Twitter
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow transition-colors text-sm"
                        variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        <Twitter size={18} />
                        Twitter
                    </motion.a>
                    {/* Email */}
                    <motion.a
                        href="mailto:marreromedinapablo@gmail.com" // Reemplaza con tu email
                        className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow transition-colors text-sm"
                        variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        <Mail size={18} />
                        Email
                    </motion.a>
                </motion.div>
            </motion.section>

            <ScrollToTopButton />

        </motion.div>
    );
}

export default AboutMePage;
