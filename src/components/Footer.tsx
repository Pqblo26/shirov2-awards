import React from 'react';
// Import specific icons from react-icons library (Simple Icons set)
import { SiDiscord, SiTiktok, SiGithub, SiX } from 'react-icons/si'; // Using Si set

function Footer() {
    // Define social links using imported icons from Simple Icons set
    const socialLinks = [
        {
            name: 'Twitter/X',
            href: 'https://x.com/shirooo26',
            icon: <SiX /> // Simple Icons X logo
        },
        {
            name: 'Discord',
            href: 'https://discord.gg/vR57X7vtSd',
            icon: <SiDiscord /> // Simple Icons Discord logo
        },
        {
            name: 'TikTok',
            href: 'https://www.tiktok.com/@shirooo260',
            icon: <SiTiktok /> // Simple Icons TikTok logo
        },
        {
            name: 'GitHub',
            href: 'https://github.com/Pqblo26',
            icon: <SiGithub /> // Simple Icons GitHub logo
        },
    ];

    return (
        <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-700/50 mt-16 relative z-10">
            {/* Social Links Section */}
            <div className="flex justify-center items-center space-x-6 mb-4"> {/* Increased spacing slightly */}
                {socialLinks.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 transition-colors duration-200 hover:text-white" // Default hover, can add brand colors
                        aria-label={item.name}
                    >
                        {/* Render the icon component and apply size with Tailwind */}
                        <span className="text-xl"> {/* Control size using text size class */}
                           {item.icon}
                        </span>
                    </a>
                ))}
            </div>

            {/* Copyright Section */}
            <div>
                &copy; {new Date().getFullYear()} Shiro Nexus by Pablo · Todos los derechos reservados
                <p className="mt-2 text-xs">Shiro Nexus: Plataforma de anime, premios, votaciones, traducciones y más.</p>
            </div>
        </footer>
    );
}

export default Footer;
