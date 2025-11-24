import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  httpClient,
  QueryKeys,
  reactionApiService,
  type MessageWithAuthorResponseDto,
  type Reaction,
  type CreateReactionDto,
} from 'api';
import { updateMessageInCache } from './helpers';
import { useGetUser } from 'hooks';

export const useAddReactionMutation = (chatId: number) => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation({
    mutationFn: async (data: Omit<CreateReactionDto, 'chatId'>) => {
      const response = await httpClient<Reaction>(reactionApiService.create({ ...data, chatId }));
      return response.data;
    },
    onSuccess: (newReaction, variables) => {
      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(
        [...QueryKeys.messages, chatId],
        (oldData) =>
          updateMessageInCache(oldData, variables.messageId, (msg) => {
            if (!user) return msg;

            const reaction = {
              ...newReaction,
              author: user,
            };
            const otherReactions = msg.reactions.filter((r) => r.authorId !== user?.id);
            return {
              ...msg,
              reactions: [...otherReactions, reaction],
            };
          }),
      );
    },
  });
};

export const useRemoveReactionMutation = (chatId: number) => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation({
    mutationFn: async (messageId: number) => {
      await httpClient(reactionApiService.delete(messageId));
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(
        [...QueryKeys.messages, chatId],
        (oldData) =>
          updateMessageInCache(oldData, messageId, (msg) => ({
            ...msg,
            reactions: msg.reactions.filter((r) => r.authorId !== user?.id),
          })),
      );
    },
  });
};
