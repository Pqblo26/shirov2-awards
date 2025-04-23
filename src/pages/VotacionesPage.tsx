import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import matter from 'gray-matter';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { CheckCircle, Circle, Award, Tv, MicVocal, Library, Users, Code, Wind, Database, Feather, Loader2, Lock } from 'lucide-react'; // Añadir Lock
// --- AÑADIDO: Importar hook del contexto ---
import { useLayoutContext } from '../layouts/MainLayout';
// --- FIN AÑADIDO ---


// --- Interfaces ---
interface NomineeData { /* ... */ }
interface VotingCategoryData { /* ... */ }
type VotesState = { [key: string]: string | null };

// --- Local Storage Key ---
const VOTES_STORAGE_KEY = 'shiroNexusUserVotes';

// --- Helper to get styles based on Award Type ---
const getGroupStyles = (awardType?: string) => { /* ... */ };


function VotacionesPage() {
    // --- AÑADIDO: Obtener ajustes del contexto ---
    const { siteSettings, isLoadingSettings: isLoadingLayoutSettings } = useLayoutContext();
    // --- FIN AÑADIDO ---

    // --- State (local) ---
    const [categories, setCategories] = useState<VotingCategoryData[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Renombrado
    const [errorCategories, setErrorCategories] = useState<string | null>(null); // Renombrado
    const [selectedVotes, setSelectedVotes] = useState<VotesState>({});
    const [userVotes, setUserVotes] = useState<VotesState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // --- Effects ---
    useEffect(() => { document.title = "Votaciones | Shiro Nexus"; }, []);
    useEffect(() => { /* Load votes from localStorage */ }, []);
    useEffect(() => { // Load voting data from CMS
        const loadVotingData = async () => {
             setIsLoadingCategories(true); setErrorCategories(null);
             try { /* ... lógica de carga ... */ }
             catch (err) { setErrorCategories("Error al cargar categorías."); }
             finally { setIsLoadingCategories(false); }
        };
        loadVotingData();
     }, []);
     useEffect(() => { /* Clear feedback message */ }, [feedbackMessage]);

    // --- Group Categories by Type ---
    const groupedCategories = useMemo(() => { /* ... */ }, [categories]);

    // --- Handle Selecting a Nominee ---
    const handleSelectNominee = (categorySlug: string, nomineeId: string) => { /* ... */ };

    // --- Handle Confirming All Selections ---
    const handleConfirmVotes = async () => { /* ... */ };

    // --- Animation Variants ---
    const containerVariants = { /* ... */ };
    const sectionVariants = { /* ... */ };
    const nomineeVariants = { /* ... */ };

    // --- Loading/Error Indicators ---
    const LoadingIndicator = () => <div className="text-center py-24 text-gray-400 text-lg">Cargando...</div>; // Mensaje genérico
    const ErrorIndicator = ({ message }: { message: string | null }) => <div className="text-center py-24 text-red-400 text-lg">{message || "Error al cargar."}</div>;

    // Check if there are any temporary selections made
    const hasPendingSelections = Object.values(selectedVotes).some(vote => vote !== null);

    // --- RENDERIZADO PRINCIPAL ---

    // 1. Mostrar carga si los ajustes del layout O las categorías están cargando
    if (isLoadingLayoutSettings || isLoadingCategories) {
         return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 size={48} className="animate-spin text-cyan-500" />
            </div>
        );
    }

    // --- AÑADIDO: Comprobar si las votaciones globales están desactivadas ---
    // Usamos '?? true' para activarlas por defecto si el ajuste no existe
    const areVotingGloballyActive = siteSettings?.votingActive ?? true;

    if (!areVotingGloballyActive) {
         return (
             <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-6">
                <Lock size={60} className="text-gray-500 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-300 mb-2">Votaciones Cerradas</h2>
                <p className="text-gray-400 max-w-md">Las votaciones para los Shiro Awards 2025 están cerradas actualmente. ¡Gracias por tu interés!</p>
            </div>
        );
    }
    // --- FIN AÑADIDO ---


    // 3. Mostrar error si falló la carga de categorías
    if (errorCategories) {
        return <ErrorIndicator message={errorCategories} />;
    }

    // 4. Mostrar contenido normal si todo está OK y las votaciones están activas
    return (
        <motion.div
            className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28 bg-gray-950"
            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <motion.h1 /* ... */ > Votaciones Shiro Awards </motion.h1>
                {/* Page Subtitle/Description */}
                <motion.p /* ... */ > ¡Tu voto cuenta! ... </motion.p>

                {/* Main Content */}
                {groupedCategories.length === 0 ? (
                    <p className="text-center text-gray-500 text-2xl py-16">No hay categorías de votación activas.</p> // Mensaje específico si no hay categorías activas
                ) : (
                    <div className="space-y-20 md:space-y-24">
                        {groupedCategories.map(([awardType, categoryList], groupIndex) => {
                            // ... (Renderizado de grupos y categorías SIN CAMBIOS) ...
                            return (
                                <motion.section key={awardType} variants={sectionVariants}>
                                    {/* ... Group Title ... */}
                                    <div className="space-y-16">
                                        {categoryList.map((category) => {
                                            // ... (Lógica de isCategoryConfirmed, etc. SIN CAMBIOS) ...
                                            return (
                                                <motion.div key={category.id} /* ... Category Container ... */ >
                                                    {/* ... Category Title & Desc ... */}
                                                    {/* Nominees Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mt-8">
                                                        {(category.nominees ?? []).map((nominee) => {
                                                            // ... (Renderizado de NomineeCard SIN CAMBIOS) ...
                                                            return ( <motion.div key={nominee.nominee_id} /* ... Nominee Card ... */ > {/* ... */} </motion.div> );
                                                        })}
                                                    </div>
                                                    {/* ... Confirmed Message ... */}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    {/* Divider */}
                                    {groupIndex < groupedCategories.length - 1 && ( <hr /* ... */ /> )}
                                </motion.section>
                            );
                        })}
                    </div>
                )}

                {/* Confirmation Button Area */}
                <div className="mt-24 text-center min-h-[6rem]">
                     {/* ... Lógica AnimatePresence para botón y feedback ... */}
                </div>

                <ScrollToTopButton />
            </div>
        </motion.div>
    );
}

export default VotacionesPage;
