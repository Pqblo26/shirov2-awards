import React, { useEffect } from 'react';

function AdminPage() {

    useEffect(() => {
        document.title = "Panel Admin | Shiro Nexus";
        // Aquí iría la lógica para verificar la sesión antes de mostrar contenido,
        // o se haría en un componente guardián.
    }, []);

    // TODO: Añadir protección de ruta y contenido real del panel

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow">
                <p className="text-gray-300">Bienvenido al panel. Próximamente aquí podrás gestionar ajustes del sitio.</p>
                {/* Añadir aquí botones/interruptores para ajustes */}
                 {/* Por ejemplo: <button>Ocultar Premios</button> */}
                 {/* O: <button>Ver Resultados Votaciones</button> */}
            </div>
        </div>
    );
}

export default AdminPage;
