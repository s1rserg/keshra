import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { MessageWithAuthorResponseDto } from 'api';
import type { Nullable } from 'types/utils';
import { useMarkChatAsRead } from './hooks';

interface UseMarkReadOnVisibleArgs {
  targetRef: RefObject<Nullable<HTMLDivElement>>;
  lastMessage: MessageWithAuthorResponseDto | undefined;
  currentUserId: Nullable<number>;
}

export const useMarkReadOnVisible = ({
  targetRef,
  lastMessage,
  currentUserId,
}: UseMarkReadOnVisibleArgs) => {
  const { markAsRead } = useMarkChatAsRead();

  const processedMessageId = useRef<Nullable<number>>(null);
  const observer = useRef<Nullable<IntersectionObserver>>(null);

  const tryMarkAsRead = useCallback(() => {
    if (!lastMessage) return;
    if (processedMessageId.current === lastMessage.id) return;

    markAsRead({ chatId: lastMessage.chatId, segNumber: lastMessage.segNumber });

    processedMessageId.current = lastMessage.id;
    observer.current?.disconnect();
  }, [lastMessage, markAsRead]);

  useEffect(() => {
    const element = targetRef.current;

    if (
      !currentUserId ||
      !element ||
      !lastMessage ||
      lastMessage.authorId === currentUserId ||
      processedMessageId.current === lastMessage.id
    ) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        if (document.hasFocus()) {
          tryMarkAsRead();
        }
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, { root: null, threshold: 0.5 });
    observer.current.observe(element);

    const handleFocus = () => {
      const el = targetRef.current;
      if (!el) return;
      if (processedMessageId.current === lastMessage?.id) return;

      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && rect.height > 0;

      if (isVisible) {
        tryMarkAsRead();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      observer.current?.disconnect();
      window.removeEventListener('focus', handleFocus);
    };
  }, [targetRef, lastMessage, currentUserId, markAsRead, tryMarkAsRead]);
};
