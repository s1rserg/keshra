import { useRef, useCallback, useState, useEffect } from 'react';
import { useGetMessages } from './useGetMessages';
import type { Nullable } from 'types/utils';

export const useChatMessages = (chatId: number) => {
  const {
    data,
    isLoading: isLoadingMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetMessages(chatId);

  const scrollContainerRef = useRef<Nullable<HTMLDivElement>>(null);
  const messagesEndRef = useRef<Nullable<HTMLDivElement>>(null);
  const observerRef = useRef<Nullable<IntersectionObserver>>(null);

  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messages = (data?.pages.flat() || []).slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const loadOlder = useCallback(async () => {
    if (!scrollContainerRef.current || !hasPreviousPage || isFetchingPreviousPage || isLoadingMore)
      return;
    const container = scrollContainerRef.current;
    const prevScrollHeight = container.scrollHeight;
    setIsLoadingMore(true);
    try {
      await fetchPreviousPage();
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoadingMore]);

  const topTriggerRef = useCallback(
    (node: Nullable<HTMLDivElement>) => {
      if (!node || !hasAutoScrolled || !hasPreviousPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            void loadOlder();
          }
        },
        { root: scrollContainerRef.current ?? null, threshold: 0.1 },
      );

      observerRef.current.observe(node);

      return () => observerRef.current?.disconnect();
    },
    [hasAutoScrolled, hasPreviousPage, loadOlder],
  );

  useEffect(() => {
    if (!isLoadingMessages && messages.length && !hasAutoScrolled) {
      scrollToBottom('auto');
      setHasAutoScrolled(true);
    }
  }, [isLoadingMessages, messages.length, hasAutoScrolled]);

  useEffect(() => {
    if (hasAutoScrolled) {
      scrollToBottom('auto');
    }
  }, [messages.length, hasAutoScrolled]);

  return {
    messages,
    isLoadingMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
    scrollContainerRef,
    messagesEndRef,
    topTriggerRef,
  };
};
