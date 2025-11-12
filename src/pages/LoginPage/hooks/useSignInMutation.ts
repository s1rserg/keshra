import { useMutation } from '@tanstack/react-query';
import { httpClient, authApiService, type AuthResponse, type SignInLocalDto } from 'api';

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: SignInLocalDto) => {
      const requestConfig = authApiService.signIn(data);
      return await httpClient<AuthResponse>(requestConfig);
    },
  });
};
