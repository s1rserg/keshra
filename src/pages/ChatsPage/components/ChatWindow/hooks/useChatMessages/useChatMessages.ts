import { useQueryClient } from '@tanstack/react-query';
import { useGetUser } from 'hooks';
import { useSocket } from 'socket';
import { useGetMessages } from '../useGetMessages';
import {
  useAutoScroll,
  useChatSocketSubscription,
  useInfiniteScrollTrigger,
  useLoadOlderMessages,
  useSortedMessages,
} from './hooks';

export const useChatMessages = (chatId: number) => {
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

  const { loadOlder } = useLoadOlderMessages(
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    scroll.scrollContainerRef,
  );

  const topTriggerRef = useInfiniteScrollTrigger({
    containerRef: scroll.scrollContainerRef,
    enabled: scroll.hasAutoScrolled && hasPreviousPage,
    onReach: loadOlder,
  });

  useChatSocketSubscription({
    socket,
    chatId,
    userId: user?.id,
    queryClient,
  });

  return {
    messages,
    isLoadingMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
    scrollContainerRef: scroll.scrollContainerRef,
    messagesEndRef: scroll.messagesEndRef,
    topTriggerRef,
  };
};
