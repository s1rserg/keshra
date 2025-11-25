import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ClientToServerEvent,
  ServerToClientEvent,
  useSocket,
  type ChatDeltaNewPayload,
  type ChatDeltaUpdatePayload,
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

    const handleChatListUpdate = (payload: ChatDeltaNewPayload, isNewMessage: boolean) => {
      queryClient.setQueryData(QueryKeys.chats, (oldChats: ChatListType[] | undefined) => {
        if (!oldChats) return oldChats;

        const updatedChats = oldChats.map((chat) => {
          if (chat.id === payload.chatId) {
            let unreadCount = chat.unreadCount;
            if (isNewMessage && payload.lastMessageAuthor !== user?.username) {
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

    const onNewMessage = (payload: ChatDeltaNewPayload) => {
      handleChatListUpdate(payload, true);
    };

    const onUpdateMessage = (payload: ChatDeltaUpdatePayload) => {
      handleChatListUpdate(payload, false);
    };

    socket.on(ServerToClientEvent.CHAT_DELTA_NEW, onNewMessage);
    socket.on(ServerToClientEvent.CHAT_DELTA_UPDATE, onUpdateMessage);

    return () => {
      socket.off(ServerToClientEvent.CHAT_DELTA_NEW, onNewMessage);
      socket.off(ServerToClientEvent.CHAT_DELTA_UPDATE, onUpdateMessage);
    };
  }, [socket, queryClient, user?.username]);
};
