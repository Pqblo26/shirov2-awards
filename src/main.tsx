import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PremiosPage from './pages/PremiosPage';
import VotacionesPage from './pages/VotacionesPage';
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import './index.css'; // Global styles

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'traducciones', element: <TraduccionesPage /> },
      // Changed route parameter from :slug to :filename
      { path: 'traducciones/:filename', element: <SingleTranslationPage /> },
      // --- Other routes remain commented out ---
      // { path: 'premios', element: <PremiosPage /> },
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
