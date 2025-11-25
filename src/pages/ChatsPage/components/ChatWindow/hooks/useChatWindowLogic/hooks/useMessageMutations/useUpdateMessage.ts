import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  httpClient,
  messageApiService,
  QueryKeys,
  type UpdateMessageDto,
  type MessageWithAuthorResponseDto,
} from 'api';
import { updateMessageInCache } from '../../../../helpers';

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; chatId: number; data: UpdateMessageDto }) => {
      const config = messageApiService.update(id, data);
      const res = await httpClient<MessageWithAuthorResponseDto>(config);
      return res.data;
    },
    onMutate: async ({ id, chatId, data }) => {
      const queryKey = [...QueryKeys.messages, chatId];
      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey);

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey, (old) =>
        updateMessageInCache(old, id, (msg) => ({ ...msg, content: data.content, isEdited: true })),
      );

      return { previousMessages };
    },
    onError: (_, { chatId }, context) => {
      const queryKey = [...QueryKeys.messages, chatId];
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },
    onSuccess: (updatedMessage, { chatId }) => {
      const queryKey = [...QueryKeys.messages, chatId];
      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey, (old) =>
        updateMessageInCache(old, updatedMessage.id, () => updatedMessage),
      );
    },
  });
};
