import { useCallback, useRef, type RefObject } from 'react';
import type { Nullable } from 'types/utils';

interface Options {
  containerRef: RefObject<Nullable<HTMLDivElement>>;
  enabled: boolean;
  onReach: () => Promise<void>;
}

export const useInfiniteScrollTrigger = ({ containerRef, enabled, onReach }: Options) => {
  const observerRef = useRef<Nullable<IntersectionObserver>>(null);

  const topTriggerRef = useCallback(
    (node: Nullable<HTMLDivElement>) => {
      if (!node || !enabled) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            void onReach();
          }
        },
        {
          root: containerRef.current ?? null,
          threshold: 0.1,
        },
      );

      observerRef.current.observe(node);

      return () => observerRef.current?.disconnect();
    },
    [enabled, onReach, containerRef],
  );

  return topTriggerRef;
};
