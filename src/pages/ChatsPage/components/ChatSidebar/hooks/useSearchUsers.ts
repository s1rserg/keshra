import { useQuery } from '@tanstack/react-query';
import { userApiService, httpClient, QueryKeys, type User } from 'api';
import { useGetUser } from 'hooks';

export const useSearchUsers = (query: string, isEnabled = true) => {
  const { data: currentUser } = useGetUser();

  return useQuery({
    queryKey: [...QueryKeys.users, query],
    queryFn: async () => {
      const res = await httpClient<User[]>(userApiService.fetchAll({ search: query }));
      return res.data;
    },
    enabled: isEnabled,
    select: (users) => {
      if (!currentUser) return users;
      return users.filter((user) => user.id !== currentUser.id);
    },
  });
};
