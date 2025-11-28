import { useQuery } from '@tanstack/react-query';
import { chatApiService, httpClient, QueryKeys, type PublicChatListResponse } from 'api';

export const useSearchPublicChats = (query: string, isEnabled = true) => {
  return useQuery({
    queryKey: [...QueryKeys.chatsSearch, query],
    queryFn: async () => {
      const res = await httpClient<PublicChatListResponse[]>(
        chatApiService.findPublic({ search: query }),
      );

      return res.data;
    },
    enabled: isEnabled && (query.trim().length === 0 || query.trim().length > 2),
  });
};
