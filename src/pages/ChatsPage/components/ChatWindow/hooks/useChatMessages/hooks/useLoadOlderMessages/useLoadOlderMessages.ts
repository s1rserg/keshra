import { useCallback, useLayoutEffect, useRef } from 'react';
import type { useLoadOlderMessagesArgs } from './types';

export const useLoadOlderMessages = ({
  fetchPreviousPage,
  hasPreviousPage,
  isFetchingPreviousPage,
  scrollContainerRef,
  messagesCount,
}: useLoadOlderMessagesArgs) => {
  const prevScrollHeightRef = useRef<number>(0);
  const shouldAdjustScrollRef = useRef(false);

  const loadOlder = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || !hasPreviousPage || isFetchingPreviousPage) return;

    prevScrollHeightRef.current = container.scrollHeight;
    shouldAdjustScrollRef.current = true;

    await fetchPreviousPage();
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !shouldAdjustScrollRef.current) return;

    const newScrollHeight = container.scrollHeight;
    const diff = newScrollHeight - prevScrollHeightRef.current;

    if (diff > 0) {
      container.scrollTop = diff;
    }
    shouldAdjustScrollRef.current = false;
  }, [messagesCount, scrollContainerRef]);

  return { loadOlder };
};
