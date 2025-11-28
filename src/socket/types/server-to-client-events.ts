import type {
  ErrorResponse,
  MessageWithAuthorResponseDto,
  PrivateChatListResponse,
  Reaction,
} from 'api';
import type { ServerToClientEvent } from './events';

export interface ChatDeltaNewPayload {
  chatId: number;
  lastMessageAuthor: string;
  lastMessagePreview: string;
}
export interface ChatDeltaNewDto extends ChatDeltaNewPayload {}
export interface ChatDeltaUpdatePayload extends ChatDeltaNewPayload {}
export interface ChatDeltaUpdateDto extends ChatDeltaUpdatePayload {}

export interface MeJoinedChatPayload {
  chatId: number;
}

export interface ReactionDeletedPayload {
  authorId: number;
  messageId: number;
}

export interface MessageDeletedPayload {
  messageId: number;
  chatId: number;
}

export interface ServerToClientEvents {
  [ServerToClientEvent.APP_ERROR]: (error: ErrorResponse) => void;
  [ServerToClientEvent.CHAT_ERROR]: (error: ErrorResponse) => void;
  [ServerToClientEvent.CHAT_NEW]: (chat: PrivateChatListResponse) => void;
  [ServerToClientEvent.ME_JOINED_CHAT]: (payload: MeJoinedChatPayload) => void;
  [ServerToClientEvent.ME_LEFT_CHAT]: (chatId: number) => void;
  [ServerToClientEvent.CHAT_MESSAGE_NEW]: (message: MessageWithAuthorResponseDto) => void;
  [ServerToClientEvent.CHAT_MESSAGE_UPDATE]: (message: MessageWithAuthorResponseDto) => void;
  [ServerToClientEvent.CHAT_MESSAGE_DELETE]: (payload: MessageDeletedPayload) => void;
  [ServerToClientEvent.CHAT_REACTION_NEW]: (reaction: Reaction) => void;
  [ServerToClientEvent.CHAT_REACTION_DELETE]: (payload: ReactionDeletedPayload) => void;
  [ServerToClientEvent.CHAT_DELTA_NEW]: (payload: ChatDeltaNewPayload) => void;
  [ServerToClientEvent.CHAT_DELTA_UPDATE]: (payload: ChatDeltaUpdatePayload) => void;
  [ServerToClientEvent.CHAT_PRESENCE_USER_ONLINE]: (userId: number) => void;
  [ServerToClientEvent.CHAT_PRESENCE_USER_OFFLINE]: (userId: number) => void;
}
