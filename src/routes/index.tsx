import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { FireGlobePage } from '@/pages/FireGlobePage';

/**
 * Application Routes
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/fire-globe',
    element: <FireGlobePage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
