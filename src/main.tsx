import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration
} from 'react-router-dom';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PremiosPage from './pages/PremiosPage';
import VotacionesPage from './pages/VotacionesPage';
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
import AboutMePage from './pages/AboutMePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AdminAuthGuard from './components/AdminAuthGuard';
// --- AÑADIDO: Importar RankingSemanalPage ---
import RankingSemanalPage from './pages/RankingSemanalPage';
// --- FIN AÑADIDO ---


// Importa helpers
import ScrollToTop from './components/ScrollToTop';

import './index.css'; // Global styles

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // MainLayout envuelve las rutas hijas
    children: [
      { index: true, element: <HomePage /> },
      { path: 'premios', element: <PremiosPage /> },
      { path: 'traducciones', element: <TraduccionesPage /> },
      { path: 'traducciones/:filename', element: <SingleTranslationPage /> },
      { path: 'sobre-mi', element: <AboutMePage /> },
      { path: 'votaciones', element: <VotacionesPage /> },
      // --- AÑADIDO: Ruta para Ranking Semanal ---
      { path: 'ranking-semanal', element: <RankingSemanalPage /> },
      // --- FIN AÑADIDO ---
      {
        path: 'panel-admin', // Ruta para tu panel
        element: <AdminAuthGuard />,
        children: [
          { index: true, element: <AdminPage /> },
          // Otras sub-rutas del panel irían aquí
        ]
      },
    ],
  },
  // Ruta Login Admin (fuera de MainLayout)
  {
    path: '/admin-login',
    element: <AdminLoginPage />,
  },
  // Catch-all 404 route (Debe ir al final)
   { path: '*', element: <NotFoundPage /> }
]);

// Rendering logic...
const rootElement = document.getElementById('root');
if (!rootElement) { throw new Error("Failed to find the root element"); }

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router}>
       <ScrollToTop />
       <ScrollRestoration getKey={(location) => location.pathname} />
    </RouterProvider>
  </React.StrictMode>,
);
