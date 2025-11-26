import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUser } from 'hooks';
import { useSocket } from 'socket';
import {
  useChatSocketSubscription,
  useMarkReadOnVisible,
  useSortedMessages,
  useGetMessages,
} from './hooks';
import type { Nullable } from 'types/utils';

export const useChatMessages = (chatId: Nullable<number>) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  const {
    data,
    isLoading: isLoadingMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetMessages(chatId);

  const messages = useSortedMessages(data);

  useChatSocketSubscription(socket, chatId, user?.id, queryClient);

  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages[messages.length - 1];
  const currentUserId = user?.id || null;

  useMarkReadOnVisible({
    targetRef: bottomRef,
    lastMessage,
    currentUserId,
  });

  return {
    messages,
    isLoadingMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
    fetchPreviousPage,
    bottomRef,
  };
};
