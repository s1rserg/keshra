import { useQuery } from '@tanstack/react-query';
import { httpClient, QueryKeys, userApiService, type UserAvatarMedia } from 'api';

export const useGetAllAvatars = () => {
  return useQuery({
    queryKey: QueryKeys.avatars,
    queryFn: async ({ signal }) => {
      const response = await httpClient<UserAvatarMedia[]>(userApiService.getAllAvatars(signal));
      return response.data;
    },
  });
};
