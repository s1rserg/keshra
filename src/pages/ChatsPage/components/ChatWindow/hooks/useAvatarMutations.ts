import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  httpClient,
  QueryKeys,
  chatApiService,
  type PublicChatListResponse,
  type ChatAvatarMedia,
} from 'api';

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const response = await httpClient<ChatAvatarMedia>(chatApiService.uploadAvatar(id, file));
      return response.data;
    },
    onSuccess: (newAvatar, variables) => {
      queryClient.setQueryData<PublicChatListResponse>(
        [...QueryKeys.chat, variables.id],
        (oldChat) => (oldChat ? { ...oldChat, avatar: newAvatar } : undefined),
      );

      queryClient.setQueryData<PublicChatListResponse[]>(QueryKeys.chats, (oldChats) =>
        oldChats
          ? oldChats.map((chat) =>
              chat.id === variables.id ? { ...chat, avatar: newAvatar } : chat,
            )
          : [],
      );

      queryClient.setQueryData<ChatAvatarMedia[]>(
        [QueryKeys.chatAvatars, variables.id],
        (oldAvatars) => (oldAvatars ? [...oldAvatars, newAvatar] : [newAvatar]),
      );
    },
  });
};

export const useSetMainAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mediaId }: { id: number; mediaId: ChatAvatarMedia['id'] }) => {
      const response = await httpClient<ChatAvatarMedia>(chatApiService.setMainAvatar(id, mediaId));
      return response.data;
    },
    onSuccess: (newMainAvatar, variables) => {
      queryClient.setQueryData<PublicChatListResponse>(
        [...QueryKeys.chat, variables.id],
        (oldChat) => (oldChat ? { ...oldChat, avatar: newMainAvatar } : undefined),
      );

      queryClient.setQueryData<PublicChatListResponse[]>(QueryKeys.chats, (oldChats) =>
        oldChats
          ? oldChats.map((chat) =>
              chat.id === variables.id ? { ...chat, avatar: newMainAvatar } : chat,
            )
          : [],
      );
    },
  });
};

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mediaId }: { id: number; mediaId: ChatAvatarMedia['id'] }) => {
      await httpClient(chatApiService.deleteAvatar(id, mediaId));
      return mediaId;
    },
    onSuccess: (deletedMediaId, variables) => {
      queryClient.setQueryData<ChatAvatarMedia[]>(
        [QueryKeys.chatAvatars, variables.id],
        (oldAvatars) =>
          oldAvatars ? oldAvatars.filter((avatar) => avatar.id !== deletedMediaId) : [],
      );
      void queryClient.invalidateQueries({ queryKey: QueryKeys.chat });
      void queryClient.invalidateQueries({ queryKey: QueryKeys.chats });
    },
  });
};
