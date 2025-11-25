import type { ValueOf } from 'types/utils';
import type { User } from '../UserApiService';
import type { Reaction } from '../ReactionApiService';

export interface CreateMessageDto {
  content: string;
  chatId: number;
}

export interface UpdateMessageDto {
  content: string;
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
  segNumber: number;
  reactions: Reaction[];
  authorId: number;
  chatId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageWithAuthorResponseDto extends MessageBaseResponseDto {
  author: User;
}
