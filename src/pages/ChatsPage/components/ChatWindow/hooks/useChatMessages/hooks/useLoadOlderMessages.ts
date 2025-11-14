import { useCallback, useState, type RefObject } from 'react';
import type { Nullable } from 'types/utils';

export const useLoadOlderMessages = (
  fetchPreviousPage: () => Promise<unknown>,
  hasPreviousPage: boolean,
  isFetchingPreviousPage: boolean,
  scrollContainerRef: RefObject<Nullable<HTMLDivElement>>,
) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadOlder = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || !hasPreviousPage || isFetchingPreviousPage || isLoadingMore) return;

    const prevHeight = container.scrollHeight;

    setIsLoadingMore(true);
    try {
      await fetchPreviousPage();
      const newHeight = container.scrollHeight;
      container.scrollTop = newHeight - prevHeight;
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoadingMore,
    scrollContainerRef,
  ]);

  return { loadOlder, isLoadingMore };
};
