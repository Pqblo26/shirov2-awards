import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'; // Importar iconos

// Interfaz para los ajustes del sitio
interface SiteSettings {
  showPremios?: boolean;
  // otros ajustes futuros...
}

function AdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Estado para guardar cambios
    const [error, setError] = useState<string | null>(null);

    // Función para obtener los ajustes actuales
    const fetchSettings = useCallback(async () => {
        console.log("Fetching settings...");
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('admin_token'); // Necesitamos el token para la API

        // Aunque la API GET no requiere token, es buena práctica enviarlo
        // por si en el futuro sí lo requiere o para otras llamadas
        if (!token) {
            console.error("No admin token found for fetching settings.");
            setError("No autenticado."); // O redirigir a login
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/settings', {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                console.log("Settings loaded:", data.settings);
                setSettings(data.settings || {}); // Usar objeto vacío si no hay ajustes previos
            } else {
                throw new Error(data.message || 'Error al cargar ajustes');
            }
        } catch (err: any) {
            console.error("Error fetching settings:", err);
            setError(err.message || 'No se pudieron cargar los ajustes.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar ajustes al montar el componente
    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
        fetchSettings();
    }, [fetchSettings]);

    // Función para actualizar un ajuste específico
    const updateSetting = async (key: keyof SiteSettings, value: any) => {
        console.log(`Updating setting: ${key} to ${value}`);
        setIsSaving(true);
        setError(null);
        const token = localStorage.getItem('admin_token');

        if (!token) {
            setError("No autenticado para guardar.");
            setIsSaving(false);
            return;
        }

        // Crear el objeto de ajustes actualizado
        // Importante: Enviamos el objeto COMPLETO de ajustes a la API
        // porque kv.set sobrescribe toda la clave.
        const updatedSettings = {
            ...(settings || {}), // Tomar los ajustes actuales (o un objeto vacío)
            [key]: value      // Actualizar la clave específica
        };


        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedSettings), // Enviar el objeto completo
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log("Settings saved:", data.settings);
                setSettings(data.settings); // Actualizar estado local con la respuesta
                // Mostrar feedback de éxito (opcional)
            } else {
                throw new Error(data.message || 'Error al guardar ajustes');
            }
        } catch (err: any) {
            console.error("Error saving settings:", err);
            setError(err.message || 'No se pudieron guardar los ajustes.');
            // Opcional: Revertir el estado local si falla el guardado
            // fetchSettings(); // Volver a cargar los ajustes desde el servidor
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

    // Renderizado
    if (isLoading) {
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
                        Guardando...
                    </div>
                )}

                 {/* Mostrar error si existe */}
                 {error && !isLoading && !isSaving && (
                    <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-md border border-red-700/50">
                         <AlertCircle size={16} />
                         <span>Error: {error}</span>
                    </div>
                 )}

                {/* Aquí irían otros ajustes */}
                {/* <p className="text-gray-500 text-sm italic">Más ajustes próximamente...</p> */}

            </motion.div>

             {/* Aquí podríamos añadir la sección para ver resultados de votaciones */}
             {/* <motion.div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"> ... </motion.div> */}

        </div>
    );
}

export default AdminPage;
