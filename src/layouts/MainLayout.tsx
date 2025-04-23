import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Outlet, useOutletContext } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

// --- AÑADIDO: Interfaz para los ajustes del sitio ---
interface SiteSettings {
  showPremios?: boolean;
  // otros ajustes futuros...
}
// --- FIN AÑADIDO ---

// --- MODIFICADO: Tipo del contexto para incluir ajustes ---
interface OutletContextType {
  isAdminMode: boolean;
  siteSettings: SiteSettings | null; // Puede ser null mientras carga
  isLoadingSettings: boolean; // Para saber si los ajustes están listos
}
// --- FIN MODIFICACIÓN ---

// Hook para usar el contexto (actualizado)
export function useLayoutContext(): OutletContextType {
 const context = useOutletContext<OutletContextType>();
 if (context === undefined) {
   throw new Error("useLayoutContext must be used within a component rendered via MainLayout's Outlet");
 }
 return context;
}

function MainLayout() {
    // --- Admin Panel State and Logic (Konami - sin cambios) ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const adminCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const newSequence = [...keySequence, event.key]; const keysToKeep = adminCode.length + 2; const currentSequence = newSequence.slice(-keysToKeep); setKeySequence(currentSequence); if (currentSequence.length >= adminCode.length) { const lastKeys = currentSequence.slice(-adminCode.length); if (lastKeys.every((key, index) => key === adminCode[index])) { console.log("Admin Mode Activated!"); setIsAdminMode(true); setKeySequence([]); } }
           };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keySequence]);
    // --- End Admin Panel Logic ---

    // --- AÑADIDO: Estado y lógica para cargar ajustes del sitio ---
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [settingsError, setSettingsError] = useState<string | null>(null);

    const fetchSiteSettings = useCallback(async () => {
        console.log("MainLayout: Fetching site settings...");
        setIsLoadingSettings(true);
        setSettingsError(null);
        try {
            // Llamamos a la API GET que creamos (no necesita token para leer)
            const response = await fetch('/api/admin/settings');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                console.log("MainLayout: Settings loaded:", data.settings);
                setSiteSettings(data.settings || {}); // Guardar ajustes o {} si no hay nada
            } else {
                throw new Error(data.message || 'Error al cargar ajustes del sitio');
            }
        } catch (err: any) {
            console.error("MainLayout: Error fetching site settings:", err);
            setSettingsError(err.message || 'No se pudieron cargar los ajustes del sitio.');
            setSiteSettings({}); // Poner objeto vacío en caso de error para evitar null
        } finally {
            setIsLoadingSettings(false);
        }
    }, []);

    useEffect(() => {
        fetchSiteSettings();
    }, [fetchSiteSettings]);
    // --- FIN AÑADIDO ---


    return (
        <div className="flex flex-col min-h-screen">
            {/* --- MODIFICADO: Pasar showPremios a TopNavBar --- */}
            <TopNavBar
                isAdminMode={isAdminMode}
                // Pasamos el valor de showPremios. Si aún no se han cargado (null),
                // o si hubo error ({}), por defecto mostramos la sección (true).
                // Puedes cambiar `?? true` a `?? false` si prefieres ocultarla por defecto.
                showPremios={siteSettings?.showPremios ?? true}
            />
            {/* --- FIN MODIFICACIÓN --- */}
            <main className="flex-grow">
                {/* --- MODIFICADO: Pasar siteSettings e isLoadingSettings por contexto --- */}
                <Outlet context={{ isAdminMode, siteSettings, isLoadingSettings } satisfies OutletContextType} />
                {/* --- FIN MODIFICACIÓN --- */}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;