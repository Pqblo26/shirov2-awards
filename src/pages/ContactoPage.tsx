import React, { useEffect } from 'react';

function ContactoPage() { // Define the function component
    useEffect(() => {
        document.title = "Contacto | Shiro Nexus";
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Página de Contacto</h1>
            <p className="text-center text-gray-400">
                Formulario de contacto o información irá aquí...
            </p>
        </div>
    );
}

export default ContactoPage;
