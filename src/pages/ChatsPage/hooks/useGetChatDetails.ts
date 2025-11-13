import { useQuery } from '@tanstack/react-query';
import { httpClient, chatApiService, type ChatDetailsResponse, QueryKeys } from 'api';
import type { Nullable } from 'types/utils';

export const useGetChatDetails = (chatId: Nullable<number>) =>
  useQuery({
    queryKey: [...QueryKeys.chat, chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const res = await httpClient<ChatDetailsResponse>(chatApiService.getById(chatId));
      return res.data;
    },
  });
