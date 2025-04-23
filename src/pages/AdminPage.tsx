import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, BarChart } from 'lucide-react'; // Importar iconos

// Interfaz para los ajustes del sitio
interface SiteSettings {
  showPremios?: boolean;
}

// --- AÑADIDO: Interfaz para resultados de votos ---
interface VoteResult {
    categorySlug: string;
    nomineeId: string;
    count: number;
}
// --- FIN AÑADIDO ---

function AdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- AÑADIDO: Estado para votos ---
    const [voteResults, setVoteResults] = useState<VoteResult[] | null>(null);
    const [isLoadingVotes, setIsLoadingVotes] = useState(false);
    const [errorVotes, setErrorVotes] = useState<string | null>(null);
    // --- FIN AÑADIDO ---


    // Función para obtener los ajustes actuales
    const fetchSettings = useCallback(async () => { /* ... sin cambios ... */ }, []);

    // Cargar ajustes al montar el componente
    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
        fetchSettings();
    }, [fetchSettings]);

    // Función para actualizar un ajuste específico
    const updateSetting = async (key: keyof SiteSettings, value: any) => { /* ... sin cambios ... */ };

    // Handler para el interruptor de Premios
    const handleTogglePremios = () => { /* ... sin cambios ... */ };

    // --- AÑADIDO: Función para obtener resultados de votos ---
    const fetchVoteResults = async () => {
        console.log("Fetching vote results...");
        setIsLoadingVotes(true);
        setErrorVotes(null);
        setVoteResults(null); // Limpiar resultados previos
        const token = localStorage.getItem('admin_token');

        if (!token) {
            setErrorVotes("No autenticado para ver resultados.");
            setIsLoadingVotes(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/get-votes', { // Llama a la nueva API
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                console.log("Vote results loaded:", data.votes);
                // Ordenar resultados (opcional, ej: por categoría, luego por votos desc)
                const sortedVotes = (data.votes as VoteResult[]).sort((a, b) => {
                    if (a.categorySlug < b.categorySlug) return -1;
                    if (a.categorySlug > b.categorySlug) return 1;
                    return b.count - a.count; // Mayor contador primero dentro de la categoría
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
    // --- FIN AÑADIDO ---


    // Renderizado
    if (isLoadingSettings) { // Mostrar carga inicial de ajustes
        return ( /* ... Indicador de carga ... */ );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1 /* ... Panel Title ... */ > Panel de Administración </motion.h1>

            {/* Mostrar error general si existe */}
            {error && !isLoadingSettings && !isSaving && (
                <div className="mb-6 flex items-center justify-center gap-2 text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700/50">
                     <AlertCircle size={16} />
                     <span>Error: {error}</span>
                </div>
             )}

            {/* Sección de Ajustes Generales */}
            <motion.div /* ... Ajustes Container ... */ >
                <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2">Ajustes del Sitio</h2>
                {/* Control Visibilidad Premios */}
                <div className="flex items-center justify-between gap-4">
                   {/* ... Interruptor showPremios ... */}
                </div>
                {/* Indicador de guardado */}
                {isSaving && ( /* ... */ )}
            </motion.div>

            {/* --- AÑADIDO: Sección Resultados Votaciones --- */}
            <motion.div
                className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
                 <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-600 pb-2 mb-4">Resultados Votaciones</h2>

                 {/* Botón para cargar/actualizar resultados */}
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
                    <div className="mt-4 max-h-96 overflow-y-auto pr-2"> {/* Scroll si hay muchos resultados */}
                        {voteResults.length === 0 ? (
                            <p className="text-center text-gray-500 italic">Aún no hay votos registrados.</p>
                        ) : (
                            <ul className="space-y-2">
                                {voteResults.map((vote) => (
                                    <li key={`${vote.categorySlug}-${vote.nomineeId}`} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-1.5 rounded">
                                        <span className="text-gray-300">
                                            <span className="font-medium text-gray-100">{vote.categorySlug}</span> : {vote.nomineeId}
                                        </span>
                                        <span className="font-bold text-cyan-300 text-base">{vote.count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                 )}
            </motion.div>
            {/* --- FIN AÑADIDO --- */}

        </div> // Closing inner centering container
    );
}

export default AdminPage;
