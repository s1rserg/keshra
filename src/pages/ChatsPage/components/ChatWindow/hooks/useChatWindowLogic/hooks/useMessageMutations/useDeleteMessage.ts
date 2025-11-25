import { useQueryClient, useMutation, type InfiniteData } from '@tanstack/react-query';
import { messageApiService, httpClient, QueryKeys, type MessageWithAuthorResponseDto } from 'api';
import { removeMessageFromCache } from '../../../../helpers';

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number; chatId: number }) => {
      const config = messageApiService.delete(id);
      await httpClient(config);
      return id;
    },
    onMutate: async ({ id, chatId }) => {
      const queryKey = [...QueryKeys.messages, chatId];
      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey);

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey, (old) =>
        removeMessageFromCache(old, id),
      );

      return { previousMessages };
    },
    onError: (_, { chatId }, context) => {
      const queryKey = [...QueryKeys.messages, chatId];
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },
  });
};
