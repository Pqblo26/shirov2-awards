import React from 'react';

function Footer() {
    // Define social links with corrected SVGs and user's URLs
    const socialLinks = [
        {
            name: 'Twitter/X',
            href: 'https://x.com/shirooo26',
            // Corrected SVG for X logo
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                   </svg>
        },
        {
            name: 'Discord',
            href: 'https://discord.gg/vR57X7vtSd',
             // Corrected/Verified SVG for Discord logo
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09a.09.09 0 0 0-.07-.03c-1.5.26-2.93.71-4.27 1.33a.07.07 0 0 0-.05.06c-.14.65-.27 1.33-.38 2.02a.08.08 0 0 0 .04.09c1.42.8 2.81 1.48 4.16 2.04a.09.09 0 0 0 .09-.01c.4-.3.78-.63 1.13-.97a.08.08 0 0 1 .1-.01c.48.32 1 .58 1.5.81a.09.09 0 0 1 .09.01c.35.34.73.67 1.13.97a.08.08 0 0 1 .1.01c1.35-.56 2.74-1.24 4.16-2.04a.09.09 0 0 0 .09.01c.11-.69.24-1.37.38-2.02a.07.07 0 0 0-.05-.06zm-6.27 10.39c-.94 0-1.7-.77-1.7-1.72s.76-1.72 1.7-1.72c.95 0 1.7.77 1.7 1.72s-.75 1.72-1.7 1.72zm4 0c-.94 0-1.7-.77-1.7-1.72s.76-1.72 1.7-1.72c.95 0 1.7.77 1.7 1.72s-.75 1.72-1.7 1.72z"/>
                   </svg>
        },
        {
            name: 'TikTok',
            href: 'https://www.tiktok.com/@shirooo260',
            // Corrected/Verified SVG for TikTok logo
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.6-2.9-1.61-1.77-2.36-4.07-2.37-6.25-.02-2.5.66-4.99 2.16-6.98 1.66-2.2 4.04-3.41 6.52-3.51v4.6c-1.09.12-2.18.44-3.17.94-.27.13-.53.29-.79.46-.21.13-.42.28-.62.44-.46.35-.87.77-1.22 1.23-.28.36-.53.75-.74 1.16-.19.38-.33.79-.44 1.21-.15.54-.22 1.1-.22 1.66 0 1.03.17 2.05.51 3.02.43 1.23 1.14 2.35 2.08 3.26.94.91 2.1 1.57 3.35 1.89.77.2 1.56.26 2.35.26.87 0 1.73-.09 2.57-.29 1.46-.35 2.8-.99 3.94-1.86.9-.68 1.62-1.55 2.14-2.55.3-.58.52-1.2.66-1.83.13-.58.19-1.17.19-1.77v-5.4c-.01-.02-.01-.04 0-.06l-.01-.02v-.01h-.01c-1.1.21-2.2.15-3.29-.19-1.2-.38-2.29-.97-3.21-1.75-.52-.43-1-1-1.38-1.63-.05-.08-.1-.16-.15-.23-.03-.05-.06-.1-.08-.16-.02-.05-.04-.1-.06-.14-.05-.13-.1-.26-.15-.39-.07-.2-.13-.4-.19-.6v-.01c-.02-.05-.03-.1-.05-.15-.01-.02-.02-.04-.03-.07-.01-.02-.02-.04-.03-.06l-.02-.06-.01-.04-.01-.04V.02z"/>
                   </svg>
        },
        {
            name: 'GitHub',
            href: 'https://github.com/Pqblo26',
            // GitHub SVG was correct, keeping it
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        },
    ];

    return (
        <footer className="p-8 text-center text-sm text-gray-500 border-t border-gray-700/50 mt-16 relative z-10">
            {/* Social Links Section */}
            <div className="flex justify-center items-center space-x-5 mb-4">
                {socialLinks.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security measure for target="_blank"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label={item.name} // Accessibility
                    >
                        {/* Apply size directly to SVG or use a wrapper div */}
                        <span className="[&>svg]:h-5 [&>svg]:w-5"> {/* Control size via parent */}
                           {item.icon}
                        </span>
                    </a>
                ))}
            </div>

            {/* Copyright Section */}
            <div> {/* Added div for better structure if needed */}
                &copy; {new Date().getFullYear()} Shiro Nexus by Pablo · Todos los derechos reservados
                <p className="mt-2 text-xs">Shiro Nexus: Plataforma de anime, premios, votaciones, traducciones y más.</p>
            </div>
        </footer>
    );
}

export default Footer;
