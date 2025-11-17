import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient, QueryKeys, userApiService, type User, type UserAvatarMedia } from 'api';

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await httpClient<UserAvatarMedia>(userApiService.uploadAvatar(file));
      return response.data;
    },
    onSuccess: (newAvatar) => {
      queryClient.setQueryData<User>(QueryKeys.user, (oldUser) =>
        oldUser ? { ...oldUser, avatar: newAvatar } : undefined,
      );
      void queryClient.invalidateQueries({ queryKey: QueryKeys.avatars });
    },
  });
};

export const useSetMainAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: UserAvatarMedia['id']) => {
      const response = await httpClient<UserAvatarMedia>(userApiService.setMainAvatar(mediaId));
      return response.data;
    },
    onSuccess: (newMainAvatar) => {
      queryClient.setQueryData<User>(QueryKeys.user, (oldUser) =>
        oldUser ? { ...oldUser, avatar: newMainAvatar } : undefined,
      );
    },
  });
};

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: UserAvatarMedia['id']) => {
      await httpClient(userApiService.deleteAvatar(mediaId));
      return mediaId;
    },
    onSuccess: (mediaId) => {
      queryClient.setQueryData<UserAvatarMedia[]>(QueryKeys.avatars, (oldAvatars) =>
        oldAvatars ? oldAvatars.filter((avatar) => avatar.id !== mediaId) : [],
      );
      void queryClient.invalidateQueries({ queryKey: QueryKeys.user });
    },
  });
};
