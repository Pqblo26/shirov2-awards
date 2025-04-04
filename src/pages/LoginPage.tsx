import React, { useEffect } from 'react';

function LoginPage() {
    useEffect(() => {
        document.title = "Login | Shiro Nexus";
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Página de Login</h1>
            <p className="text-center text-gray-400">
                Formulario de inicio de sesión irá aquí...
            </p>
            {/* Add login form elements later */}
        </div>
    );
}

export default LoginPage; // Default export
