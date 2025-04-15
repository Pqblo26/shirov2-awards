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
import VotacionesPage from './pages/VotacionesPage'; // Asegúrate que esta ruta está descomentada si la necesitas activa
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
import AboutMePage from './pages/AboutMePage';
import NotFoundPage from './pages/NotFoundPage';
// --- AÑADIDO: Imports para Admin ---
import AdminLoginPage from './pages/AdminLoginPage'; // Nueva página de login admin
import AdminPage from './pages/AdminPage'; // Nueva página de panel admin
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
      { path: 'votaciones', element: <VotacionesPage /> }, // Ruta de votaciones (descomentada)
      // --- AÑADIDO: Ruta Panel Admin (dentro del Layout principal por ahora) ---
      // Más adelante añadiremos un guardián para protegerla
      { path: 'admin', element: <AdminPage /> },
      // --- FIN AÑADIDO ---
      // --- Otras rutas comentadas ---
      // { path: 'contacto', element: <ContactoPage /> }, // Reemplazada por sobre-mi
      // { path: 'login', element: <LoginPage /> }, // Login de usuario normal (omitido por ahora)
    ],
  },
  // --- AÑADIDO: Ruta Login Admin (fuera de MainLayout) ---
  {
    path: '/admin-login',
    element: <AdminLoginPage />,
  },
  // --- FIN AÑADIDO ---

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
