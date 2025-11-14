import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApiService, httpClient } from 'api';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from 'routes';
import { localStorageService } from 'utils/LocalStorageService';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => httpClient(authApiService.signOut()),
    onSettled: () => {
      localStorageService.deleteAccessToken();
      void navigate(AppRoutes.LOGIN, { replace: true });
      queryClient.clear();
    },
  });

  return { logout, isLoggingOut };
};
