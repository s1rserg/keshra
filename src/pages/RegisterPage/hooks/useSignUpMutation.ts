import { useMutation } from '@tanstack/react-query';
import { httpClient, authApiService, type AuthResponse, type SignUpLocalDto } from 'api';

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpLocalDto) => {
      const requestConfig = authApiService.signUp(data);
      return await httpClient<AuthResponse>(requestConfig);
    },
  });
};
