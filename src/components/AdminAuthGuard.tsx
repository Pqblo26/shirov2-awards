import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // Outlet para renderizar rutas anidadas
import { Loader2 } from 'lucide-react'; // Icono de carga

function AdminAuthGuard() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Empezar cargando
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            setIsLoading(true); // Asegurar estado de carga
            const token = localStorage.getItem('admin_token');

            if (!token) {
                console.log("AdminAuthGuard: No token found, redirecting to login.");
                setIsAuthorized(false);
                setIsLoading(false);
                navigate('/admin-login', { replace: true }); // Redirigir a login
                return;
            }

            try {
                console.log("AdminAuthGuard: Verifying token...");
                const response = await fetch('/api/verify-admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Enviar token en header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user?.isAdmin) {
                        console.log("AdminAuthGuard: Verification successful.");
                        setIsAuthorized(true); // Autorizado
                    } else {
                        // Token válido pero no autorizado o respuesta inesperada
                        console.log("AdminAuthGuard: Verification failed (API response not OK or not admin).", data);
                        setIsAuthorized(false);
                        localStorage.removeItem('admin_token'); // Limpiar token inválido
                        navigate('/admin-login', { replace: true });
                    }
                } else {
                    // La API devolvió error (401 Unauthorized, 500 Server Error, etc.)
                    console.log(`AdminAuthGuard: Verification failed (HTTP ${response.status}).`);
                    setIsAuthorized(false);
                    localStorage.removeItem('admin_token'); // Limpiar token inválido
                    navigate('/admin-login', { replace: true });
                }
            } catch (error) {
                console.error("AdminAuthGuard: Error calling verification API:", error);
                setIsAuthorized(false);
                localStorage.removeItem('admin_token'); // Limpiar token en caso de error
                navigate('/admin-login', { replace: true });
            } finally {
                setIsLoading(false); // Terminar carga
            }
        };

        verifyAdmin();
    }, [navigate]); // Incluir navigate en dependencias

    // Mostrar indicador de carga mientras se verifica
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Ajustar altura si es necesario */}
                <Loader2 size={48} className="animate-spin text-blue-500" />
            </div>
        );
    }

    // Si está autorizado, renderizar el contenido protegido (la página AdminPage)
    // Usamos <Outlet /> porque este componente actuará como layout para la ruta protegida
    if (isAuthorized) {
        return <Outlet />;
    }

    // Si no está autorizado (y no está cargando), no renderizar nada aquí
    // porque la redirección ya se habrá iniciado en el useEffect.
    // Renderizar null evita un parpadeo antes de redirigir.
    return null;
}

export default AdminAuthGuard;
