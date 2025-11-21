import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'api';
import type { Nullable } from 'types/utils';

export const useIsUserOnline = (userId: Nullable<number>) => {
  const { data: onlineUsers } = useQuery<number[]>({
    queryKey: QueryKeys.onlineUsers,
    queryFn: async () => Promise.resolve([]),
    enabled: false,
  });
  if (userId === null) return false;

  return onlineUsers?.includes(userId) ?? false;
};
