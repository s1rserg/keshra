import { useEffect } from 'react';
import { ServerToClientEvent, useSocket } from 'socket';
import { QueryKeys, type MessageWithAuthorResponseDto } from 'api';
import type { QueryClient, InfiniteData } from '@tanstack/react-query';

interface Options {
  socket: ReturnType<typeof useSocket>;
  chatId: number;
  userId: number | undefined;
  queryClient: QueryClient;
}

export const useChatSocketSubscription = ({ socket, chatId, userId, queryClient }: Options) => {
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
