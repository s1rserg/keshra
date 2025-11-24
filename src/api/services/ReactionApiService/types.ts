import type { User } from '../UserApiService';

export interface CreateReactionDto {
  emoji: string;
  messageId: number;
  chatId: number;
}

export interface Reaction {
  id: number;
  emoji: string;
  authorId: number;
  messageId: number;
  author: User;
}
