import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  httpClient,
  messageApiService,
  type CreateMessageDto,
  type MessageWithAuthorResponseDto,
  QueryKeys,
  type MessageBaseResponseDto,
  CursorDirection,
} from 'api';
import { useGetUser } from 'hooks';

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  const getQueryKey = (chatId: number) => [QueryKeys.messages, chatId, CursorDirection.NEWER];

  return useMutation({
    mutationFn: async (data: CreateMessageDto) => {
      const res = await httpClient<MessageBaseResponseDto>(messageApiService.create(data));
      return res.data;
    },

    onMutate: async (newMessage: CreateMessageDto) => {
      if (!user) return;
      const { chatId, content } = newMessage;
      const queryKey = getQueryKey(chatId);

      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(queryKey);

      const optimisticMessage: MessageWithAuthorResponseDto = {
        id: Math.random(),
        content: content,
        chatId: chatId,
        createdAt: new Date().toISOString(),
        author: user,
        authorId: user.id,
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(
        queryKey,
        (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [[optimisticMessage]],
              pageParams: [undefined],
            };
          }

          const newPages = [...oldData.pages];
          const lastPageIndex = newPages.length - 1;

          const lastPage = newPages[lastPageIndex] ?? [];
          newPages[lastPageIndex] = [...lastPage, optimisticMessage];

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );

      return { previousMessages, optimisticMessage };
    },

    onError: (_, newMessage, context) => {
      const queryKey = getQueryKey(newMessage.chatId);
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },

    onSuccess: (realMessage, variables, context) => {
      if (!context?.optimisticMessage || !user) return;

      const { chatId } = variables;
      const queryKey = getQueryKey(chatId);
      const tempId = context.optimisticMessage.id;

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(
        queryKey,
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((message) =>
                message.id === tempId ? { ...realMessage, author: user } : message,
              ),
            ),
          };
        },
      );
    },
  });
};
