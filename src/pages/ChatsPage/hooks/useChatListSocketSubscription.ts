import { useEffect, useMemo, useRef } from 'react';
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
import type { Nullable } from 'types/utils';
import { notificationService } from 'utils/NotificationService';
import { audioService } from 'utils/AudioService';
import { useTranslation } from 'react-i18next';

export const useChatListSocketSubscription = (
  chats: ChatListType[] | undefined,
  selectedChatId: Nullable<number>,
) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();
  const { t } = useTranslation();

  const selectedChatIdRef = useRef(selectedChatId);
  const chatsRef = useRef(chats);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const stableChatIds = useMemo(() => {
    return chats
      ?.map((c) => c.id)
      .sort()
      .join(',');
  }, [chats]);

  useEffect(() => {
    if (!socket || !chats || chats.length === 0) return;

    const chatIds = chats.map((c) => c.id);
    socket.emit(ClientToServerEvent.CHAT_DELTA_JOIN, chatIds);

    return () => {
      socket.emit(ClientToServerEvent.CHAT_DELTA_LEAVE, chatIds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, stableChatIds]);

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
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        });
        return updatedChats;
      });
    };

    const onNewMessage = (payload: ChatDeltaNewPayload) => {
      handleChatListUpdate(payload, true);

      const isMyMessage = payload.lastMessageAuthor === user?.username;

      const isChatOpen = selectedChatIdRef.current === payload.chatId;
      const isWindowFocused = document.hasFocus();

      if (!isMyMessage && (!isChatOpen || !isWindowFocused)) {
        const chatTitle =
          chatsRef.current?.find((c) => c.id === payload.chatId)?.title ||
          payload.lastMessageAuthor;

        notificationService.sendNotification(
          `${t('newMessageNotification')} ${chatTitle}`,
          `${payload.lastMessageAuthor}: ${payload.lastMessagePreview}`,
          '/icons/handshake.png',
        );
        audioService.play('message');
      }
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
  }, [socket, queryClient, user?.username, t]);
};
