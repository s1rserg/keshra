import { useQuery } from '@tanstack/react-query';
import {
  chatApiService,
  httpClient,
  QueryKeys,
  type PrivateChatListResponse,
  type PublicChatListResponse,
} from 'api';

export const useGetChats = () =>
  useQuery({
    queryKey: QueryKeys.chats,
    queryFn: async () => {
      const res = await httpClient<(PrivateChatListResponse | PublicChatListResponse)[]>(
        chatApiService.findMy(),
      );
      return res.data;
    },
  });
