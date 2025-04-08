import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

interface OutletContextType {
  isAdminMode: boolean;
}

export function useAdminMode(): OutletContextType {
 const context = useOutletContext<OutletContextType>();
 if (context === undefined) {
   throw new Error("useAdminMode must be used within a component rendered via MainLayout's Outlet");
 }
 return context;
}

function MainLayout() {
    // --- Admin Panel State and Logic ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const adminCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { /* ... admin mode key logic ... */
            const newSequence = [...keySequence, event.key]; const keysToKeep = adminCode.length + 2; const currentSequence = newSequence.slice(-keysToKeep); setKeySequence(currentSequence); if (currentSequence.length >= adminCode.length) { const lastKeys = currentSequence.slice(-adminCode.length); if (lastKeys.every((key, index) => key === adminCode[index])) { console.log("Admin Mode Activated!"); setIsAdminMode(true); setKeySequence([]); } }
         };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keySequence]);
    // --- End Admin Panel Logic ---

    // --- Ko-fi useEffect REMOVED ---

    return (
        <div className="flex flex-col min-h-screen">
            <TopNavBar isAdminMode={isAdminMode} />
            <main className="flex-grow">
                <Outlet context={{ isAdminMode } satisfies OutletContextType} />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
