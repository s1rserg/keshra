import { useEffect, useRef, useState, useCallback } from 'react';
import type { Nullable } from 'types/utils';

export const useAutoScroll = (isLoadingInitial: boolean) => {
  const scrollContainerRef = useRef<Nullable<HTMLDivElement>>(null);
  const messagesEndRef = useRef<Nullable<HTMLDivElement>>(null);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollDownButton(distanceFromBottom > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
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
    showScrollDownButton,
  };
};
