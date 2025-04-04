import React, { useEffect } from 'react';
// Import the hook created in MainLayout to access the context
import { useAdminMode } from '../layouts/MainLayout';

function AdminPage() {
    // Access the isAdminMode state passed down from the layout via context
    const { isAdminMode } = useAdminMode();

    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
    }, []);

    // Basic check - Real security should be handled server-side and/or in routing loaders
    if (!isAdminMode) {
        return (
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-center text-red-500 mb-8">Acceso Denegado</h1>
                <p className="text-center text-gray-400">
                    No tienes permiso para acceder a esta página.
                </p>
            </div>
        )
    }

    // Render admin content if admin mode is active
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>
            <p className="text-center text-gray-400">
                Contenido del panel de administración irá aquí...
            </p>
            {/* Add admin tools/components later */}
        </div>
    );
}

export default AdminPage; // Default export
