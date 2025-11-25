import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient, chatApiService, QueryKeys, type ChatDetailsResponse } from 'api';

export const useJoinChat = () => {
  const queryClient = useQueryClient();

  const getDetailsQueryKey = (chatId: number) => [...QueryKeys.chat, chatId];
  const getMyChatsQueryKey = () => QueryKeys.chats;

  return useMutation({
    mutationFn: async (chatId: number) => {
      const res = await httpClient<ChatDetailsResponse>(chatApiService.joinPublic(chatId));
      return res.data;
    },

    onSuccess: (realChatDetails, chatId) => {
      queryClient.setQueryData(getDetailsQueryKey(chatId), realChatDetails);
      void queryClient.invalidateQueries({
        queryKey: getMyChatsQueryKey(),
      });
    },
  });
};
