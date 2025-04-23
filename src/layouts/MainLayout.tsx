import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

// Interfaz para los ajustes del sitio (actualizada)
interface SiteSettings {
  showPremios?: boolean;
  votingActive?: boolean; // Añadido
}

// Tipo del contexto (actualizado)
interface OutletContextType {
  isAdminMode: boolean; // Del código Konami
  siteSettings: SiteSettings | null;
  isLoadingSettings: boolean;
}

// Hook para usar el contexto (sin cambios)
export function useLayoutContext(): OutletContextType {
 const context = useOutletContext<OutletContextType>();
 if (context === undefined) { throw new Error("useLayoutContext must be used within MainLayout"); }
 return context;
}

function MainLayout() {
    // --- Admin Panel State and Logic (Konami - sin cambios) ---
    const [isAdminMode, setIsAdminMode] = useState(false);
    // ... resto de lógica Konami ...

    // --- Estado y lógica para cargar ajustes del sitio (sin cambios) ---
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [settingsError, setSettingsError] = useState<string | null>(null);

    const fetchSiteSettings = useCallback(async () => {
        console.log("MainLayout: Fetching site settings...");
        setIsLoadingSettings(true);
        setSettingsError(null);
        try {
            const response = await fetch('/api/admin/settings'); // GET no requiere token
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const data = await response.json();
            if (data.success) {
                console.log("MainLayout: Settings loaded:", data.settings);
                setSiteSettings(data.settings || {});
            } else { throw new Error(data.message || 'Error al cargar ajustes'); }
        } catch (err: any) {
            console.error("MainLayout: Error fetching site settings:", err);
            setSettingsError(err.message || 'No se pudieron cargar ajustes.');
            setSiteSettings({});
        } finally { setIsLoadingSettings(false); }
    }, []);

    useEffect(() => { fetchSiteSettings(); }, [fetchSiteSettings]);
    // --- Fin Carga Ajustes ---


    return (
        <div className="flex flex-col min-h-screen">
            {/* Pasar showPremios y votingActive a TopNavBar */}
            <TopNavBar
                isAdminMode={isAdminMode}
                // Usar '?? true' como valor por defecto si los ajustes aún no cargan o fallan
                showPremios={siteSettings?.showPremios ?? true}
                votingActive={siteSettings?.votingActive ?? true} // Pasar nuevo ajuste
            />
            <main className="flex-grow">
                {/* Pasar siteSettings e isLoadingSettings por contexto */}
                <Outlet context={{ isAdminMode, siteSettings, isLoadingSettings } satisfies OutletContextType} />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
