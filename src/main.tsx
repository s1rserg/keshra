import { appRouter } from 'routes';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemedToastContainer } from 'components/ThemedToastContainer';
import './styles/index.css';
import './config/i18n';
import { Suspense } from 'react';
import { Loader } from 'components/Loader';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TooltipProvider } from 'components/ui';

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={100}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={appRouter} />
      </Suspense>
      <ThemedToastContainer />
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  </QueryClientProvider>,
);
