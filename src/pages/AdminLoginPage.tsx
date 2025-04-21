import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin Login | Shiro Nexus";
        localStorage.removeItem('admin_token'); // Limpiar token al cargar login
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok && data.success && data.token) {
                localStorage.setItem('admin_token', data.token);
                console.log("Token guardado en localStorage.");
                // --- MODIFICADO: Redirigir a la nueva ruta ---
                navigate('/panel-admin', { replace: true });
                // --- FIN MODIFICACIÓN ---
            } else {
                setError(data.message || 'Contraseña incorrecta o error del servidor.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Error de red al intentar iniciar sesión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // JSX del formulario (sin cambios)
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
            <motion.div
                className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center text-white">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password" name="password" type="password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white disabled:opacity-50"
                            placeholder="********" disabled={isLoading}
                        />
                    </div>
                    {error && ( <p className="text-sm text-red-400 text-center">{error}</p> )}
                    <div>
                        <button type="submit" disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default AdminLoginPage;
