import { useQuery } from '@tanstack/react-query';
import { httpClient, userApiService, QueryKeys, type User } from 'api';
import { localStorageService } from 'utils/LocalStorageService';

export const useGetUser = () => {
  return useQuery({
    queryKey: QueryKeys.user,
    queryFn: async () => {
      const response = await httpClient<User>(userApiService.fetchUser());
      return response.data;
    },

    enabled: !!localStorageService.getAccessToken(),
  });
};
