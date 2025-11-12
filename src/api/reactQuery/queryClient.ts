import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { handleApiError } from '../errorHandler';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => handleApiError(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      handleApiError(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});
