import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage'; // Import the new HomePage
import PremiosPage from './pages/PremiosPage';
import VotacionesPage from './pages/VotacionesPage';
import TraduccionesPage from './pages/TraduccionesPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import './index.css'; // Global styles

// Create the router configuration using createBrowserRouter
const router = createBrowserRouter([
  {
    // Root route using the MainLayout
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true, // index: true now renders HomePage at '/'
        element: <HomePage />,
      },
      {
        path: 'premios', // New specific path for the awards page
        element: <PremiosPage />,
      },
      {
        path: 'votaciones',
        element: <VotacionesPage />,
      },
      {
        path: 'traducciones',
        element: <TraduccionesPage />,
      },
      {
        path: 'contacto',
        element: <ContactoPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      // Add other child routes here
    ],
    // Optional: Add an error element for the layout route itself
    // errorElement: <RootBoundary />,
  },
  // You could define routes outside the MainLayout here if needed

  // Catch-all 404 route - Placed outside the main layout routes
   {
     path: '*',
     element: <NotFoundPage />,
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
