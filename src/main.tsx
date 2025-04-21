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
import PremiosPage from './pages/PremiosPage';
import VotacionesPage from './pages/VotacionesPage';
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
import AboutMePage from './pages/AboutMePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
// --- AÑADIDO: Import del Guardián ---
import AdminAuthGuard from './components/AdminAuthGuard';
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
      // --- MODIFICADO: Ruta Admin ahora usa el Guardián ---
      {
        path: 'admin', // Ruta padre para el área de admin protegida
        element: <AdminAuthGuard />, // El guardián verifica y renderiza <Outlet /> si OK
        children: [
          // La página real del panel se renderiza como hija del guardián
          { index: true, element: <AdminPage /> },
          // Aquí podrías añadir más sub-rutas protegidas dentro de /admin/* si las necesitas
          // { path: 'users', element: <AdminUsersPage /> },
        ]
      },
      // --- FIN MODIFICACIÓN ---
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
    {/* RouterProvider envuelve la aplicación */}
    <RouterProvider router={router}>
       {/* Componente para el scroll manual al cambiar de ruta */}
       <ScrollToTop />
       {/* Componente de React Router para gestionar la restauración del scroll */}
       <ScrollRestoration getKey={(location) => location.pathname} />
    </RouterProvider>
  </React.StrictMode>,
);
