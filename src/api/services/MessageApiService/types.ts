import type { ValueOf } from 'types/utils';
import type { User } from '../UserApiService';

export interface CreateMessageDto {
  content: string;
  chatId: number;
}

export const CursorDirection = {
  OLDER: 'older',
  NEWER: 'newer',
} as const;

type CursorQueryDto = {
  cursor?: string;
  limit?: number;
  direction: ValueOf<typeof CursorDirection>;
};

export interface GetMessagesQueryDto extends CursorQueryDto {
  chatId: number;
}

export interface MessageBaseResponseDto {
  id: number;
  content: string;
  authorId: number;
  chatId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageWithAuthorResponseDto extends MessageBaseResponseDto {
  author: User;
}
