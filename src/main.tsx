import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PremiosPage from './pages/PremiosPage'; // Keep import for potential future use
import VotacionesPage from './pages/VotacionesPage'; // Keep import
import TraduccionesPage from './pages/TraduccionesPage';
import SingleTranslationPage from './pages/SingleTranslationPage'; // Import new page
import ContactoPage from './pages/ContactoPage'; // Keep import
import LoginPage from './pages/LoginPage'; // Keep import
import AdminPage from './pages/AdminPage'; // Keep import
import NotFoundPage from './pages/NotFoundPage';

import './index.css'; // Global styles

// Create the router configuration
const router = createBrowserRouter([
  {
    // Root route using the MainLayout
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true, // HomePage at '/'
        element: <HomePage />,
      },
      // --- ONLY Traducciones routes are active ---
      {
        path: 'traducciones', // List page
        element: <TraduccionesPage />,
      },
      {
        path: 'traducciones/:slug', // Detail page with dynamic slug parameter
        element: <SingleTranslationPage />,
      },
      // --- Other routes commented out to restrict access ---
      // {
      //   path: 'premios',
      //   element: <PremiosPage />,
      // },
      // {
      //   path: 'votaciones',
      //   element: <VotacionesPage />,
      // },
      // {
      //   path: 'contacto',
      //   element: <ContactoPage />,
      // },
      // {
      //   path: 'login',
      //   element: <LoginPage />,
      // },
      // {
      //   path: 'admin',
      //   element: <AdminPage />, // Add loader/protection later
      // },
    ],
  },
  // Catch-all 404 route
   {
     path: '*',
     element: <NotFoundPage />, // Render custom 404 page
   }
]);

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Render the app using RouterProvider
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
