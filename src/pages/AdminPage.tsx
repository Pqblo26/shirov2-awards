import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, BarChart, Vote, ToggleLeft, ToggleRight } from 'lucide-react'; // Importar más iconos

// --- MODIFICADO: Interfaz para los ajustes del sitio ---
interface SiteSettings {
  showPremios?: boolean;
  votingActive?: boolean; // Nuevo ajuste para votaciones globales
  // otros ajustes futuros...
}
// --- FIN MODIFICACIÓN ---

// Interfaz para resultados de votos
interface VoteResult {
    categorySlug: string;
    nomineeId: string;
    count: number;
}

function AdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [voteResults, setVoteResults] = useState<VoteResult[] | null>(null);
    const [isLoadingVotes, setIsLoadingVotes] = useState(false);
    const [errorVotes, setErrorVotes] = useState<string | null>(null);

    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Función para obtener los ajustes actuales (sin cambios)
    const fetchSettings = useCallback(async () => {
        console.log("Fetching settings...");
        setIsLoadingSettings(true);
        setError(null);
        const token = localStorage.getItem('admin_token');

        if (!token) {
            console.error("No admin token found for fetching settings.");
            setError("No autenticado para cargar ajustes.");
            setIsLoadingSettings(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/settings', {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                console.log("Settings loaded:", data.settings);
                setSettings(data.settings || {});
            } else {
                throw new Error(data.message || 'Error al cargar ajustes del sitio');
            }
        } catch (err: any) {
            console.error("Error fetching settings:", err);
            setError(err.message || 'No se pudieron cargar los ajustes.');
            setSettings({});
        } finally {
            setIsLoadingSettings(false);
        }
    }, []);

    // Cargar ajustes al montar el componente (sin cambios)
    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
        fetchSettings();
    }, [fetchSettings]);

     // Effect to clear feedback message (sin cambios)
     useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => { setFeedbackMessage(null); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    // Función para actualizar un ajuste específico (sin cambios)
    const updateSetting = async (key: keyof SiteSettings, value: any) => {
        console.log(`Updating setting: ${key} to ${value}`);
        setIsSaving(true);
        setError(null);
        setFeedbackMessage(null);
        const token = localStorage.getItem('admin_token');

        if (!token) { setError("No autenticado para guardar."); setIsSaving(false); return; }

        const updatedSettings = { ...(settings || {}), [key]: value };

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedSettings),
            });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || `HTTP error! status: ${response.status}`); }
            const data = await response.json();
            if (data.success) {
                console.log("Settings saved:", data.settings);
                setSettings(data.settings);
                setFeedbackMessage({ type: 'success', message: 'Ajuste guardado con éxito.' });
            } else { throw new Error(data.message || 'Error al guardar ajustes'); }
        } catch (err: any) {
            console.error("Error saving settings:", err);
            setFeedbackMessage({ type: 'error', message: err.message || 'No se pudieron guardar los ajustes.' });
        } finally { setIsSaving(false); }
    };

    // Handler para el interruptor de Premios (sin cambios)
    const handleTogglePremios = () => {
        if (!isSaving) { updateSetting('showPremios', !settings?.showPremios); }
    };

    // --- AÑADIDO: Handler para el interruptor de Votaciones ---
    const handleToggleVoting = () => {
        if (!isSaving) {
            updateSetting('votingActive', !settings?.votingActive);
        }
    };
    // --- FIN AÑADIDO ---

    // Función para obtener resultados de votos (sin cambios)
    const fetchVoteResults = async () => { /* ... */ };


    // Renderizado
    if (isLoadingSettings) { return ( /* ... Indicador de carga ... */ ); }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1 /* ... Panel Title ... */ > Panel de Administración </motion.h1>

            {/* Mostrar error general */}
            {error && !isLoadingSettings && !isSaving && ( /* ... Error display ... */ )}

            {/* Sección de Ajustes Generales */}
            <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            >
                <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2">Ajustes del Sitio</h2>

                {/* Control Visibilidad Premios */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {settings?.showPremios ? <Eye size={20} className="text-green-400"/> : <EyeOff size={20} className="text-red-400"/>}
                        <span className="text-gray-200">Mostrar Sección Premios</span>
                    </div>
                    <button onClick={handleTogglePremios} disabled={isSaving} className={`relative inline-flex items-center h-6 rounded-full w-11 ... ${ settings?.showPremios ? 'bg-green-600' : 'bg-gray-600' }`}>
                        {/* ... span interno del interruptor ... */}
                    </button>
                </div>

                {/* --- AÑADIDO: Control Votaciones Globales --- */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                        {settings?.votingActive ? <Vote size={20} className="text-green-400"/> : <Vote size={20} className="text-red-400"/>}
                        <span className="text-gray-200">Activar Votaciones Globales</span>
                    </div>
                    <button
                        onClick={handleToggleVoting}
                        disabled={isSaving}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 ${
                            settings?.votingActive ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                    >
                        <span className="sr-only">Activar/Desactivar Votaciones</span>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                            settings?.votingActive ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>
                {/* --- FIN AÑADIDO --- */}


                {/* Indicador de guardado */}
                {isSaving && ( /* ... */ )}

                {/* Feedback de guardado */}
                 <AnimatePresence> {feedbackMessage && ( /* ... */ )} </AnimatePresence>

            </motion.div>

             {/* Sección Resultados Votaciones */}
             <motion.div /* ... Contenedor resultados ... */ >
                 <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">Resultados Votaciones</h2>
                 <div className="text-center">
                     <button onClick={fetchVoteResults} disabled={isLoadingVotes} className="...">
                         {/* ... Botón Ver Resultados ... */}
                     </button>
                 </div>
                 {/* Mostrar error de carga de votos */}
                 {errorVotes && ( /* ... */ )}
                 {/* Mostrar resultados si se han cargado */}
                 {voteResults && !isLoadingVotes && ( /* ... Lista de resultados ... */ )}
            </motion.div>

        </div> // Closing inner centering container
    );
}

export default AdminPage;
