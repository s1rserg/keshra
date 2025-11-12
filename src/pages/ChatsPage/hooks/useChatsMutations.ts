import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  chatApiService,
  httpClient,
  QueryKeys,
  type CreatePrivateChatDto,
  type CreatePublicChatDto,
  type PrivateChatListResponse,
  type PublicChatListResponse,
} from 'api';

export const useCreatePrivateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePrivateChatDto) =>
      httpClient<PrivateChatListResponse>(chatApiService.createPrivate(data)),
    onSuccess: (response) => {
      queryClient.setQueryData<PrivateChatListResponse[] | undefined>(
        QueryKeys.chats,
        (old = []) => [...old, response.data],
      );
    },
  });
};

export const useCreatePublicChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePublicChatDto) =>
      httpClient<PublicChatListResponse>(chatApiService.createPublic(data)),
    onSuccess: (response) => {
      queryClient.setQueryData<PublicChatListResponse[] | undefined>(
        QueryKeys.chats,
        (old = []) => [...old, response.data],
      );
    },
  });
};
