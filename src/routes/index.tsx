import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { FireGlobePage } from '@/pages/FireGlobePage';
import { FloodGlobePage } from '@/pages/FloodGlobePage';
import { InteractiveGlobePage } from '@/pages/InteractiveGlobePage';
import { CreditsPage } from '@/pages/CreditsPage';

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
  {
    path: '/flood-globe',
    element: <FloodGlobePage />,
  },
  {
    path: '/interactive-globe',
    element: <InteractiveGlobePage />,
  },
  {
    path: '/credits',
    element: <CreditsPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
