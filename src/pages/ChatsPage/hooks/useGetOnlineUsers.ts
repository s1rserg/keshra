import { useQuery } from '@tanstack/react-query';
import { userApiService, httpClient, QueryKeys } from 'api';

export const useGetOnlineUsers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QueryKeys.onlineUsers,
    queryFn: async () => {
      const res = await httpClient<number[]>(userApiService.fetchOnline());
      return res.data;
    },
    staleTime: Infinity,
    initialData: [],
    enabled: options?.enabled,
  });
};
