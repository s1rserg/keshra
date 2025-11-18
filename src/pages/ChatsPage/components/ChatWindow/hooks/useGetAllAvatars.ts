import { useQuery } from '@tanstack/react-query';
import { chatApiService, httpClient, QueryKeys, type ChatAvatarMedia } from 'api';

export const useGetAllAvatars = (id: number) => {
  return useQuery({
    queryKey: [QueryKeys.chatAvatars, id],
    queryFn: async ({ signal }) => {
      const response = await httpClient<ChatAvatarMedia[]>(
        chatApiService.getAllAvatars(id, signal),
      );
      return response.data;
    },
  });
};
