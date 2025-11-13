import { useEffect, useRef, useCallback, useState, type FC } from 'react';
import { type ChatDetailsResponse } from 'api';
import { Loader } from 'components/Loader';
import { useGetMessages, useCreateMessage } from './hooks';
import { ChatInput } from './components';
import type { Nullable } from 'types/utils';

interface Props {
  chatDetails: ChatDetailsResponse;
  isLoading: boolean;
}

export const ChatWindow: FC<Props> = ({ chatDetails, isLoading: isLoadingDetails }) => {
  const chatId = chatDetails.id;

  const {
    data,
    isLoading: isLoadingMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetMessages(chatId);

  const { mutate: createMessage } = useCreateMessage();

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

  const handleSendMessage = (content: string) => {
    createMessage({ chatId, content });
    setTimeout(() => scrollToBottom('auto'), 0);
  };

  useEffect(() => {
    if (!isLoadingMessages && messages.length && !hasAutoScrolled) {
      scrollToBottom('auto');
      setHasAutoScrolled(true);
    }
  }, [isLoadingMessages, messages.length, hasAutoScrolled]);

  if (isLoadingDetails) return <Loader />;

  return (
    <div className="flex flex-col h-full">
      <span className="px-4 py-3.5 border-b border-gray-200 font-bold">{chatDetails.title}</span>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ scrollBehavior: 'auto' }}
      >
        {hasPreviousPage && (
          <div ref={topTriggerRef} className="flex justify-center py-2">
            {(isFetchingPreviousPage || isLoadingMore) && <Loader />}
          </div>
        )}

        {isLoadingMessages && !messages.length ? (
          <Loader />
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-bold">{msg.author?.username ?? 'User'}: </span>
              <span>{msg.content}</span>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSubmit={handleSendMessage} />
    </div>
  );
};
