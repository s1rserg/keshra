import { useEffect } from 'react';
import { ServerToClientEvent, useSocket, type MessageDeletedPayload } from 'socket';
import { QueryKeys, type MessageWithAuthorResponseDto } from 'api';
import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import type { Nullable } from 'types/utils';
import { removeMessageFromCache, updateMessageInCache } from '../../../helpers';

export const useChatSocketSubscription = (
  socket: ReturnType<typeof useSocket>,
  chatId: Nullable<number>,
  userId: number | undefined,
  queryClient: QueryClient,
) => {
  useEffect(() => {
    if (!socket || !chatId) return;

    const queryKey = [...QueryKeys.messages, chatId];

    const handleNewMessage = (msg: MessageWithAuthorResponseDto) => {
      if (msg.chatId !== chatId || msg.authorId === userId) return;

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<MessageWithAuthorResponseDto[]> | undefined) => {
          if (!old) {
            return {
              pages: [[msg]],
              pageParams: [null],
            };
          }
          const newPages = [...old.pages];
          const [first = [], ...rest] = newPages;
          return {
            ...old,
            pages: [[...first, msg], ...rest],
          };
        },
      );
    };

    const handleMessageUpdate = (updatedMsg: MessageWithAuthorResponseDto) => {
      if (updatedMsg.chatId !== chatId || updatedMsg.authorId === userId) return;

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<MessageWithAuthorResponseDto[]> | undefined) =>
          updateMessageInCache(old, updatedMsg.id, (msg) => ({
            ...msg,
            content: updatedMsg.content,
            updatedAt: updatedMsg.updatedAt,
          })),
      );
    };

    const handleMessageDelete = (payload: MessageDeletedPayload) => {
      if (payload.chatId !== chatId) return;

      queryClient.setQueryData(
        queryKey,
        (old: InfiniteData<MessageWithAuthorResponseDto[]> | undefined) =>
          removeMessageFromCache(old, payload.messageId),
      );
    };

    socket.on(ServerToClientEvent.CHAT_MESSAGE_NEW, handleNewMessage);
    socket.on(ServerToClientEvent.CHAT_MESSAGE_UPDATE, handleMessageUpdate);
    socket.on(ServerToClientEvent.CHAT_MESSAGE_DELETE, handleMessageDelete);

    return () => {
      socket.off(ServerToClientEvent.CHAT_MESSAGE_NEW, handleNewMessage);
      socket.off(ServerToClientEvent.CHAT_MESSAGE_UPDATE, handleMessageUpdate);
      socket.off(ServerToClientEvent.CHAT_MESSAGE_DELETE, handleMessageDelete);
    };
  }, [socket, chatId, userId, queryClient]);
};
