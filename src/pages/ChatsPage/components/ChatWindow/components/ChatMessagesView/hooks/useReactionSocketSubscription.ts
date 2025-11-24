import { useEffect } from 'react';
import { ServerToClientEvent, useSocket, type ReactionDeletedPayload } from 'socket';
import { QueryKeys, type MessageWithAuthorResponseDto, type Reaction } from 'api';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import type { Nullable } from 'types/utils';

export const useReactionSocketSubscription = (chatId: Nullable<number>) => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !chatId) return;

    const newReactionEvent = ServerToClientEvent.CHAT_REACTION_NEW;
    const deleteReactionEvent = ServerToClientEvent.CHAT_REACTION_DELETE;

    const handleNewReaction = (reaction: Reaction) => {
      const key = [...QueryKeys.messages, chatId];

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(key, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((msg) => {
              if (msg.id === reaction.messageId) {
                const otherReactions = msg.reactions.filter(
                  (r) => r.authorId !== reaction.authorId,
                );
                return {
                  ...msg,
                  reactions: [...otherReactions, reaction],
                };
              }
              return msg;
            }),
          ),
        };
      });
    };

    const handleDeleteReaction = ({ authorId, messageId }: ReactionDeletedPayload) => {
      const key = [...QueryKeys.messages, chatId];

      queryClient.setQueryData<InfiniteData<MessageWithAuthorResponseDto[]>>(key, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  reactions: msg.reactions.filter((r) => r.authorId !== authorId),
                };
              }
              return msg;
            }),
          ),
        };
      });
    };

    socket.on(newReactionEvent, handleNewReaction);
    socket.on(deleteReactionEvent, handleDeleteReaction);

    return () => {
      socket.off(newReactionEvent, handleNewReaction);
      socket.off(deleteReactionEvent, handleDeleteReaction);
    };
  }, [socket, chatId, queryClient]);
};
