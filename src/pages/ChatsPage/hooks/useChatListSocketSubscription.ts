import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ClientToServerEvent,
  ServerToClientEvent,
  useSocket,
  type ChatDeltaNewPayload,
} from 'socket';
import { QueryKeys, type ChatListType } from 'api';
import { useGetUser } from 'hooks';

export const useChatListSocketSubscription = (chats: ChatListType[] | undefined) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  useEffect(() => {
    if (!socket || !chats || chats.length === 0) return;

    const chatIds = chats.map((c) => c.id);
    socket.emit(ClientToServerEvent.CHAT_DELTA_JOIN, chatIds);

    return () => {
      socket.emit(ClientToServerEvent.CHAT_DELTA_LEAVE, chatIds);
    };
  }, [socket, chats]);

  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = (payload: ChatDeltaNewPayload) => {
      queryClient.setQueryData(QueryKeys.chats, (oldChats: ChatListType[] | undefined) => {
        if (!oldChats) return oldChats;

        const updatedChats = oldChats.map((chat) => {
          if (chat.id === payload.chatId) {
            let unreadCount = chat.unreadCount;
            if (payload.lastMessageAuthor !== user?.username) {
              unreadCount++;
            }
            return {
              ...chat,
              lastMessagePreview: payload.lastMessagePreview,
              unreadCount: unreadCount,
            };
          }
          return chat;
        });
        return updatedChats;
      });
    };

    socket.on(ServerToClientEvent.CHAT_DELTA_NEW, handleUnreadUpdate);

    return () => {
      socket.off(ServerToClientEvent.CHAT_DELTA_NEW, handleUnreadUpdate);
    };
  }, [socket, queryClient, user?.username]);
};
