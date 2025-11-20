import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ClientToServerEvent, useSocket, type MarkChatReadDto } from 'socket';
import { QueryKeys, type ChatListType } from 'api';

export const useMarkChatAsRead = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const markAsRead = useCallback(
    (payload: MarkChatReadDto) => {
      if (!socket) return;

      const { chatId } = payload;

      if (timers.current[chatId]) {
        clearTimeout(timers.current[chatId]);
      }

      timers.current[chatId] = setTimeout(() => {
        socket.emit(ClientToServerEvent.CHAT_MARK_READ, payload);

        queryClient.setQueryData<ChatListType[]>(QueryKeys.chats, (oldChats) => {
          if (!oldChats) return oldChats;

          return oldChats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat));
        });
      }, 250);
    },
    [socket, queryClient],
  );

  return { markAsRead };
};
