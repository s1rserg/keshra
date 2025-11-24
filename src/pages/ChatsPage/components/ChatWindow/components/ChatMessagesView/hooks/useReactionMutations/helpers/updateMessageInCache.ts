import type { InfiniteData } from '@tanstack/react-query';
import type { MessageWithAuthorResponseDto } from 'api';

export const updateMessageInCache = (
  oldData: InfiniteData<MessageWithAuthorResponseDto[]> | undefined,
  messageId: number,
  updater: (msg: MessageWithAuthorResponseDto) => MessageWithAuthorResponseDto,
) => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) =>
      page.map((msg) => (msg.id === messageId ? updater(msg) : msg)),
    ),
  };
};
