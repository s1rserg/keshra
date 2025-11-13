import type { MessageWithAuthorResponseDto } from 'api';

export const encodeCursor = (message: MessageWithAuthorResponseDto): string => {
  const cursorData = {
    createdAt: message.createdAt,
    id: message.id,
  };
  try {
    return btoa(JSON.stringify(cursorData));
  } catch (_error) {
    return '';
  }
};
