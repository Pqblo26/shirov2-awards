import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders the matched child route component
import TopNavBar from '../components/TopNavBar'; // Import shared components
import Footer from '../components/Footer';

// Main layout structure for most pages
function MainLayout() {
    // --- Admin Panel State and Logic (moved here from App.tsx) ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]); // Explicitly type state
    const adminCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { // Type the event
            const newSequence = [...keySequence, event.key];
            // Only keep the last N keys to match the code length + buffer
            const keysToKeep = adminCode.length + 2;
            const currentSequence = newSequence.slice(-keysToKeep);
            setKeySequence(currentSequence);

            // Check if the end of the sequence matches the admin code
            if (currentSequence.length >= adminCode.length) {
                const lastKeys = currentSequence.slice(-adminCode.length);
                if (lastKeys.every((key, index) => key === adminCode[index])) {
                    console.log("Admin Mode Activated!");
                    setIsAdminMode(true);
                    setKeySequence([]); // Reset sequence after activation
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keySequence]); // Rerun effect when keySequence changes (adminCode is stable)
    // --- End Admin Panel Logic ---


    return (
        <div className="flex flex-col min-h-screen"> {/* Ensure footer stays at bottom */}
            {/* Pass isAdminMode to TopNavBar */}
            <TopNavBar isAdminMode={isAdminMode} />

            {/* Outlet renders the specific page component based on the route */}
            <main className="flex-grow"> {/* Allow main content to grow */}
                 {/* Render the matched route's component */}
                 {/* We pass isAdminMode here too in case pages need it, alternatively use Context */}
                <Outlet context={{ isAdminMode }} />
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;