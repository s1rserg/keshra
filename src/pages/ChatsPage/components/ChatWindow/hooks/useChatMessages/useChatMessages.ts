import { useQueryClient } from '@tanstack/react-query';
import { useGetUser } from 'hooks';
import { useSocket } from 'socket';
import {
  useAutoScroll,
  useChatSocketSubscription,
  useInfiniteScrollTrigger,
  useLoadOlderMessages,
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

  const scroll = useAutoScroll(isLoadingMessages);

  const { loadOlder } = useLoadOlderMessages({
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    scrollContainerRef: scroll.scrollContainerRef,
    messagesCount: messages.length,
  });

  const topTriggerRef = useInfiniteScrollTrigger({
    containerRef: scroll.scrollContainerRef,
    enabled: scroll.hasAutoScrolled && hasPreviousPage,
    onReach: loadOlder,
  });

  useChatSocketSubscription(socket, chatId, user?.id, queryClient);

  const lastMessage = messages[messages.length - 1];
  const currentUserId = user?.id || null;

  useMarkReadOnVisible({
    targetRef: scroll.messagesEndRef,
    lastMessage,
    currentUserId,
  });

  return {
    messages,
    isLoadingMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
    scrollContainerRef: scroll.scrollContainerRef,
    messagesEndRef: scroll.messagesEndRef,
    topTriggerRef,
    scrollToBottom: scroll.scrollToBottom,
    showScrollDownButton: scroll.showScrollDownButton,
  };
};
