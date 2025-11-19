import { useEffect } from 'react';
import { ServerToClientEvent, useSocket } from 'socket';
import { QueryKeys, type MessageWithAuthorResponseDto } from 'api';
import type { QueryClient, InfiniteData } from '@tanstack/react-query';
import type { Nullable } from 'types/utils';

export const useChatSocketSubscription = (
  socket: ReturnType<typeof useSocket>,
  chatId: Nullable<number>,
  userId: number | undefined,
  queryClient: QueryClient,
) => {
  useEffect(() => {
    if (!socket) return;

    const eventName = ServerToClientEvent.CHAT_MESSAGE_NEW;

    const handleNewMessage = (msg: MessageWithAuthorResponseDto) => {
      if (msg.chatId !== chatId || msg.authorId === userId) return;

      const key = [...QueryKeys.messages, chatId];

      queryClient.setQueryData(
        key,
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

    socket.on(eventName, handleNewMessage);
    return () => {
      socket.off(eventName, handleNewMessage);
    };
  }, [socket, chatId, userId, queryClient]);
};
