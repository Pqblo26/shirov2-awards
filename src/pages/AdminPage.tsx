import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import { Eye, EyeOff, Loader2, AlertCircle, BarChart } from 'lucide-react'; // Importar iconos (incluido Loader2)

// Interfaz para los ajustes del sitio
interface SiteSettings {
  showPremios?: boolean;
  // otros ajustes futuros...
}

// Interfaz para resultados de votos
interface VoteResult {
    categorySlug: string;
    nomineeId: string;
    count: number;
}

function AdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Estado para guardar cambios de ajustes
    const [error, setError] = useState<string | null>(null); // Error general o de ajustes

    // Estado para votos
    const [voteResults, setVoteResults] = useState<VoteResult[] | null>(null);
    const [isLoadingVotes, setIsLoadingVotes] = useState(false); // Carga de votos
    const [errorVotes, setErrorVotes] = useState<string | null>(null); // Error específico de votos

    // --- AÑADIDO: Estado para mensajes de feedback ---
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Función para obtener los ajustes actuales
    const fetchSettings = useCallback(async () => {
        console.log("Fetching settings...");
        setIsLoadingSettings(true);
        setError(null); // Limpiar error general al cargar ajustes
        const token = localStorage.getItem('admin_token');

        if (!token) {
            console.error("No admin token found for fetching settings.");
            setError("No autenticado para cargar ajustes."); // Usar error general
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
            setSettings({}); // Poner objeto vacío en caso de error
        } finally {
            setIsLoadingSettings(false);
        }
    }, []);

    // Cargar ajustes al montar el componente
    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
        fetchSettings();
    }, [fetchSettings]);

     // --- Effect to clear feedback message after a delay ---
     useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage(null);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    // Función para actualizar un ajuste específico
    const updateSetting = async (key: keyof SiteSettings, value: any) => {
        console.log(`Updating setting: ${key} to ${value}`);
        setIsSaving(true);
        setError(null); // Limpiar error general al guardar
        setFeedbackMessage(null); // Limpiar feedback previo
        const token = localStorage.getItem('admin_token');

        if (!token) {
            setError("No autenticado para guardar.");
            setIsSaving(false);
            return;
        }

        const updatedSettings = { ...(settings || {}), [key]: value };

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedSettings),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log("Settings saved:", data.settings);
                setSettings(data.settings);
                // --- USAR setFeedbackMessage ---
                setFeedbackMessage({ type: 'success', message: 'Ajuste guardado con éxito.' });
            } else {
                throw new Error(data.message || 'Error al guardar ajustes');
            }
        } catch (err: any) {
            console.error("Error saving settings:", err);
            // --- USAR setFeedbackMessage ---
            setFeedbackMessage({ type: 'error', message: err.message || 'No se pudieron guardar los ajustes.' });
            // Revertir el estado visual si falla (opcional, podría ser confuso)
            // setSettings(prev => ({...prev, [key]: !value }));
        } finally {
            setIsSaving(false);
        }
    };

    // Handler para el interruptor de Premios
    const handleTogglePremios = () => {
        if (!isSaving) {
            updateSetting('showPremios', !settings?.showPremios);
        }
    };

    // Función para obtener resultados de votos
    const fetchVoteResults = async () => {
        console.log("Fetching vote results...");
        setIsLoadingVotes(true);
        setErrorVotes(null); // Limpiar error específico de votos
        setFeedbackMessage(null); // Limpiar feedback general
        setVoteResults(null);
        const token = localStorage.getItem('admin_token');

        if (!token) {
            setErrorVotes("No autenticado para ver resultados.");
            setIsLoadingVotes(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/get-votes', {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                console.log("Vote results loaded:", data.votes);
                const sortedVotes = (data.votes as VoteResult[]).sort((a, b) => {
                    if (a.categorySlug < b.categorySlug) return -1;
                    if (a.categorySlug > b.categorySlug) return 1;
                    return b.count - a.count;
                });
                setVoteResults(sortedVotes);
            } else {
                throw new Error(data.message || 'Error al cargar resultados de votos');
            }
        } catch (err: any) {
            console.error("Error fetching vote results:", err);
            setErrorVotes(err.message || 'No se pudieron cargar los resultados.');
        } finally {
            setIsLoadingVotes(false);
        }
    };


    // Renderizado
    if (isLoadingSettings) { // Mostrar carga inicial de ajustes
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 size={48} className="animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1
                className="text-3xl font-bold text-white mb-8"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            >
                Panel de Administración
            </motion.h1>

            {/* Mostrar error general si existe */}
            {error && !isLoadingSettings && !isSaving && (
                <div className="mb-6 flex items-center justify-center gap-2 text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700/50">
                     <AlertCircle size={16} />
                     <span>Error al cargar/guardar ajustes: {error}</span>
                </div>
             )}

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
                    <button
                        onClick={handleTogglePremios}
                        disabled={isSaving}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 ${
                            settings?.showPremios ? 'bg-green-600' : 'bg-gray-600'
                        }`}
                    >
                        <span className="sr-only">Activar/Desactivar Premios</span>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                            settings?.showPremios ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>

                {/* Indicador de guardado */}
                {isSaving && (
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
                        <Loader2 size={16} className="animate-spin" />
                        Guardando ajuste...
                    </div>
                )}

                {/* --- AÑADIDO: Feedback de guardado --- */}
                 <AnimatePresence>
                   {feedbackMessage && feedbackMessage.type === 'success' && !isSaving && (
                        <motion.div
                            key="settings-success"
                            className={`mt-4 px-4 py-2 rounded-md text-sm font-medium inline-block bg-green-600/80 text-white`}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        >
                            {feedbackMessage.message}
                        </motion.div>
                   )}
                   {feedbackMessage && feedbackMessage.type === 'error' && !isSaving && (
                        <motion.div
                            key="settings-error"
                            className={`mt-4 px-4 py-2 rounded-md text-sm font-medium inline-block bg-red-600/80 text-white`}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        >
                            {feedbackMessage.message}
                        </motion.div>
                   )}
                </AnimatePresence>
                 {/* --- FIN AÑADIDO --- */}

            </motion.div>

             {/* Sección Resultados Votaciones */}
             <motion.div
                className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
                 <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">Resultados Votaciones</h2>

                 <div className="text-center">
                     <button
                        onClick={fetchVoteResults}
                        disabled={isLoadingVotes}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50"
                    >
                        {isLoadingVotes ? <Loader2 size={16} className="animate-spin"/> : <BarChart size={16} />}
                        {isLoadingVotes ? 'Cargando...' : 'Ver/Actualizar Resultados'}
                    </button>
                 </div>

                 {/* Mostrar error de carga de votos */}
                 {errorVotes && (
                    <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-md border border-red-700/50">
                         <AlertCircle size={16} />
                         <span>Error al cargar votos: {errorVotes}</span>
                    </div>
                 )}

                 {/* Mostrar resultados si se han cargado */}
                 {voteResults && !isLoadingVotes && (
                    <div className="mt-4 max-h-96 overflow-y-auto pr-2">
                        {voteResults.length === 0 ? (
                            <p className="text-center text-gray-500 italic">Aún no hay votos registrados.</p>
                        ) : (
                            <ul className="space-y-2">
                                {voteResults.map((vote) => (
                                    <li key={`${vote.categorySlug}-${vote.nomineeId}`} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-1.5 rounded">
                                        <span className="text-gray-300 break-all"> {/* Added break-all for long names */}
                                            <span className="font-medium text-gray-100">{vote.categorySlug}</span> : {vote.nomineeId}
                                        </span>
                                        <span className="font-bold text-cyan-300 text-base ml-2 flex-shrink-0">{vote.count}</span> {/* Added margin and shrink */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                 )}
            </motion.div>

        </div> // Closing inner centering container
    );
}

export default AdminPage;
