import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  // Importa ScrollRestoration
  ScrollRestoration
} from 'react-router-dom';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PremiosPage from './pages/PremiosPage'; // Import ya presente
// import VotacionesPage from './pages/VotacionesPage'; // Sigue comentado
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
// import ContactoPage from './pages/ContactoPage'; // Sigue comentado
// import LoginPage from './pages/LoginPage'; // Sigue comentado
// import AdminPage from './pages/AdminPage'; // Sigue comentado
import NotFoundPage from './pages/NotFoundPage';

// Importa nuestro componente manual
import ScrollToTop from './components/ScrollToTop'; // Asume que está en src/components/

import './index.css'; // Global styles

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // --- RUTA HABILITADA ---
      { path: 'premios', element: <PremiosPage /> },
      // --- FIN RUTA HABILITADA ---
      { path: 'traducciones', element: <TraduccionesPage /> },
      { path: 'traducciones/:filename', element: <SingleTranslationPage /> },
      // --- Otras rutas siguen comentadas ---
      // { path: 'votaciones', element: <VotacionesPage /> },
      // { path: 'contacto', element: <ContactoPage /> },
      // { path: 'login', element: <LoginPage /> },
      // { path: 'admin', element: <AdminPage /> },
    ],
  },
  // Catch-all 404 route
   { path: '*', element: <NotFoundPage /> }
]);

// Rendering logic...
const rootElement = document.getElementById('root');
if (!rootElement) { throw new Error("Failed to find the root element"); }

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* RouterProvider envuelve la aplicación */}
    <RouterProvider router={router}>
       {/* Componente para el scroll manual al cambiar de ruta */}
       <ScrollToTop />
       {/* Componente de React Router para gestionar la restauración del scroll */}
       <ScrollRestoration getKey={(location) => location.pathname} />
    </RouterProvider>
  </React.StrictMode>,
);