import { appRouter } from 'routes';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/index.css';
import './config/i18n';
import { Suspense } from 'react';
import { Loader } from 'components/Loader';
import { TooltipProvider } from 'components/ui';

createRoot(document.getElementById('root')!).render(
  <TooltipProvider delayDuration={100}>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={appRouter} />
    </Suspense>
  </TooltipProvider>,
);
