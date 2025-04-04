import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import v7 components

// Import Layout and Page Components
import MainLayout from './layouts/MainLayout';
import PremiosPage from './pages/PremiosPage';
import VotacionesPage from './pages/VotacionesPage';
import TraduccionesPage from './pages/TraduccionesPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import './index.css'; // Global styles

// Create the router configuration using createBrowserRouter (object syntax)
const router = createBrowserRouter([
  {
    // Root route using the MainLayout
    path: '/',
    element: <MainLayout />,
    // Define child routes that will render inside MainLayout's <Outlet>
    children: [
      {
        index: true, // This makes PremiosPage the default for '/'
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
        // You might add a loader function here later for authentication check
        element: <AdminPage />,
      },
      // Add other child routes here
    ],
    // Optional: Add an error element for the layout route itself
    // errorElement: <RootBoundary />,
  },
  // You could define routes outside the MainLayout here if needed
  // {
  //   path: '/some-other-layout',
  //   element: <OtherLayout />,
  //   children: [...]
  // },

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
