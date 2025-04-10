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
// import PremiosPage from './pages/PremiosPage'; // Comentado en el original
// import VotacionesPage from './pages/VotacionesPage'; // Comentado en el original
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
// import ContactoPage from './pages/ContactoPage'; // Comentado en el original
// import LoginPage from './pages/LoginPage'; // Comentado en el original
// import AdminPage from './pages/AdminPage'; // Comentado en el original
import NotFoundPage from './pages/NotFoundPage';

// Importa nuestro componente manual
import ScrollToTop from './components/ScrollToTop'; // Asume que está en src/components/

import './index.css'; // Global styles

// Create the router configuration (sin cambios aquí)
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'traducciones', element: <TraduccionesPage /> },
      { path: 'traducciones/:filename', element: <SingleTranslationPage /> },
      // ... otras rutas comentadas ...
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
       {/* Usar una key basada en pathname fuerza a tratar cada página como nueva */}
       {/* en términos de posición de scroll, similar a scrollTo(0,0) */}
       <ScrollRestoration getKey={(location) => location.pathname} />
    </RouterProvider>
  </React.StrictMode>,
);
