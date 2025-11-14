import { useMemo } from 'react';
import type { InfiniteData } from '@tanstack/react-query';
import type { MessageWithAuthorResponseDto } from 'api';

export const useSortedMessages = (
  data: InfiniteData<MessageWithAuthorResponseDto[]> | undefined,
) => {
  return useMemo(() => {
    const flat = data?.pages.flat() ?? [];
    return flat.slice().sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [data]);
};
