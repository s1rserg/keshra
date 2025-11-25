import type { InfiniteData } from '@tanstack/react-query';
import type { MessageWithAuthorResponseDto } from 'api';

export const removeMessageFromCache = (
  oldData: InfiniteData<MessageWithAuthorResponseDto[]> | undefined,
  messageId: number,
) => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) => page.filter((msg) => msg.id !== messageId)),
  };
};
