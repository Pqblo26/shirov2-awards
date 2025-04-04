import React, { useState, useEffect } from 'react';
// Import useOutletContext for the hook helper
import { Outlet, useOutletContext } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar'; // Import shared components
import Footer from '../components/Footer';

// Define the type for the context passed down via Outlet
// Make sure this type definition is present
interface OutletContextType {
  isAdminMode: boolean;
}


// Main layout structure for most pages
function MainLayout() {
    // --- Admin Panel State and Logic ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const adminCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const newSequence = [...keySequence, event.key];
            const keysToKeep = adminCode.length + 2;
            const currentSequence = newSequence.slice(-keysToKeep);
            setKeySequence(currentSequence);

            if (currentSequence.length >= adminCode.length) {
                const lastKeys = currentSequence.slice(-adminCode.length);
                if (lastKeys.every((key, index) => key === adminCode[index])) {
                    console.log("Admin Mode Activated!");
                    setIsAdminMode(true);
                    setKeySequence([]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keySequence]);
    // --- End Admin Panel Logic ---


    return (
        <div className="flex flex-col min-h-screen"> {/* Ensure footer stays at bottom */}
            {/* Pass isAdminMode to TopNavBar */}
            <TopNavBar isAdminMode={isAdminMode} />

            {/* Outlet renders the specific page component based on the route */}
            {/* Pass isAdminMode down to child routes via context prop */}
            <main className="flex-grow">
                 {/* Ensure the context type is correctly passed using 'satisfies' or assertion */}
                <Outlet context={{ isAdminMode } satisfies OutletContextType} />
            </main>

            <Footer />
        </div>
    );
}

// Hook helper for child pages to easily access the context
// Make sure the 'export' keyword is present here!
export function useAdminMode(): OutletContextType {
  // Ensure the type parameter matches OutletContextType
  const context = useOutletContext<OutletContextType>();
  // Optional: Add a check if the context is undefined, though in this structure it should always be provided
  if (context === undefined) {
      // This error is helpful during development if the hook is used incorrectly
      throw new Error("useAdminMode must be used within a component rendered via MainLayout's Outlet");
  }
  return context;
}


export default MainLayout; // Export the main layout component
