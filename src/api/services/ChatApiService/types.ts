import type { infer as ZodInfer } from 'zod';
import type { CreatePrivateChatSchema, CreatePublicChatSchema } from './schemas';
import type { Nullable, ValueOf } from 'types/utils';
import type { User } from '../UserApiService';

export type CreatePrivateChatDto = ZodInfer<typeof CreatePrivateChatSchema>;
export type CreatePublicChatDto = ZodInfer<typeof CreatePublicChatSchema>;

export interface ChatParticipantWithUser {
  id: number;
  joinedAt: Date;
  user: User;
}

export const ChatType = {
  PUBLIC: 'public',
  DIRECT_MESSAGES: 'dm',
} as const;

export type ChatType = ValueOf<typeof ChatType>;

export interface ChatDetailsResponse {
  id: number;
  title: string;
  type: ChatType;
  participants: ChatParticipantWithUser[];
  avatar: Nullable<ChatAvatarMedia>;
  updatedAt: string;
  createdAt: string;
}

export interface PrivateChatListResponse {
  id: number;
  title: string;
  type: ChatType;
  unreadCount: number;
  avatar: Nullable<ChatAvatarMedia>;
  createdAt: string;
  updatedAt: string;
  lastMessageAuthor?: Nullable<string>;
  lastMessagePreview?: Nullable<string>;
}

export interface PrivateChatResponse {
  id: number;
  title: string;
  type: typeof ChatType.DIRECT_MESSAGES;
  createdAt: string;
  updatedAt: string;
}

export interface PublicChatListResponse {
  id: number;
  title: string;
  type: ChatType;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  avatar: Nullable<ChatAvatarMedia>;
  lastMessageAuthor?: Nullable<string>;
  lastMessagePreview?: Nullable<string>;
}

export interface PublicChatResponse {
  id: number;
  title: string;
  type: typeof ChatType.PUBLIC;
  createdAt: string;
  updatedAt: string;
}

export interface GetPublicChatsQueryDto {
  search?: string;
}

export interface ChatAvatarMedia {
  id: number;
  createdAt: string;
  width: number;
  height: number;
  secureUrl: string;
}

export type ChatListType = PrivateChatListResponse | PublicChatListResponse;
