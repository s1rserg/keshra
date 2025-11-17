import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient, QueryKeys, userApiService, type UpdateUserDto, type User } from 'api';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const response = await httpClient<User>(userApiService.updateProfile(data));
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User>(QueryKeys.user, (oldUser) =>
        oldUser ? { ...oldUser, ...updatedUser } : updatedUser,
      );
    },
  });
};
