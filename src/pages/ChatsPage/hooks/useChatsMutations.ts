import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  chatApiService,
  httpClient,
  QueryKeys,
  type CreatePrivateChatDto,
  type CreatePublicChatDto,
  type PrivateChatListResponse,
  type PublicChatListResponse,
  type User,
} from 'api';

export const useCreatePrivateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePrivateChatDto) =>
      httpClient<PrivateChatListResponse>(chatApiService.createPrivate(data)),

    onSuccess: (response, variables) => {
      const newChat = response.data;

      const cachedReceiver = queryClient
        .getQueriesData<User[]>({ queryKey: QueryKeys.users })
        .flatMap(([_, users]) => users ?? [])
        .find((user) => user.id === variables.receiverId);

      if (cachedReceiver?.avatar) {
        newChat.avatar = cachedReceiver.avatar;
      }

      queryClient.setQueryData<PrivateChatListResponse[] | undefined>(
        QueryKeys.chats,
        (old = []) => [...old, newChat],
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
