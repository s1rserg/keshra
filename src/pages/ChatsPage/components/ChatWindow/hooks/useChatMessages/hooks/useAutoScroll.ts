import { useEffect, useRef, useState, useCallback } from 'react';
import type { Nullable } from 'types/utils';

export const useAutoScroll = (isLoadingInitial: boolean) => {
  const scrollContainerRef = useRef<Nullable<HTMLDivElement>>(null);
  const messagesEndRef = useRef<Nullable<HTMLDivElement>>(null);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!isLoadingInitial && !hasAutoScrolled) {
      scrollToBottom('auto');
      setHasAutoScrolled(true);
    }
  }, [isLoadingInitial, hasAutoScrolled, scrollToBottom]);

  return {
    scrollContainerRef,
    messagesEndRef,
    hasAutoScrolled,
    scrollToBottom,
  };
};
