import { useRef, useMemo, useLayoutEffect, useState, type UIEvent } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { MessageWithAuthorResponseDto } from 'api';
import type { VirtualItem } from '../types';
import type { Nullable } from 'types/utils';

interface UseScrollArgs {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  onFetchPreviousPage: () => void;
}

export const useScroll = ({
  messages,
  currentUserId,
  hasPreviousPage,
  isFetchingPreviousPage,
  onFetchPreviousPage,
}: UseScrollArgs) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const firstMsgIdRef = useRef<Nullable<number>>(null);

  const prevScrollHeightRef = useRef(0);
  const isPinnedToBottomRef = useRef(true);

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    messages.forEach((msg, index) => {
      const prevMsg = messages[index - 1];
      const showDate =
        !prevMsg ||
        new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

      if (showDate) {
        items.push({ type: 'date', id: `date-${msg.createdAt}`, date: msg.createdAt });
      }
      items.push({ type: 'message', id: msg.id, data: msg });
    });
    return items;
  }, [messages]);

  const rowVirtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
    measureElement: (element) => element?.getBoundingClientRect().height,
  });

  useLayoutEffect(() => {
    const container = parentRef.current;
    if (!container || virtualItems.length === 0) return;

    const currentScrollHeight = container.scrollHeight;
    const prevScrollHeight = prevScrollHeightRef.current;
    const isHeightChanged = currentScrollHeight !== prevScrollHeight;

    if (isHeightChanged) {
      const currentFirstMsgId = messages[0]?.id || null;
      const prevFirstMsgId = firstMsgIdRef.current;
      const isHistoryAdded = prevScrollHeight > 0 && currentFirstMsgId !== prevFirstMsgId;

      if (isHistoryAdded) {
        const delta = currentScrollHeight - prevScrollHeight;
        container.scrollTop += delta;
      } else {
        const lastMessage = messages[messages.length - 1];
        const isOwnMessage = lastMessage?.authorId === currentUserId;
        if (isPinnedToBottomRef.current || isOwnMessage || prevScrollHeight === 0) {
          rowVirtualizer.scrollToIndex(virtualItems.length - 1, { align: 'end' });
        }
      }
      firstMsgIdRef.current = currentFirstMsgId;
    }

    prevScrollHeightRef.current = currentScrollHeight;
  }, [virtualItems.length, messages, currentUserId, rowVirtualizer]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    isPinnedToBottomRef.current = distanceFromBottom < 100;

    setShowScrollButton(distanceFromBottom > 200);

    if (scrollTop < 50 && hasPreviousPage && !isFetchingPreviousPage) {
      onFetchPreviousPage();
    }
  };

  const scrollToBottom = () => {
    rowVirtualizer.scrollToIndex(virtualItems.length - 1, { align: 'end', behavior: 'smooth' });
  };

  return {
    parentRef,
    rowVirtualizer,
    virtualItems,
    handleScroll,
    scrollToBottom,
    showScrollButton,
  };
};
