import type { ErrorResponse, MessageWithAuthorResponseDto } from 'api';
import type { ServerToClientEvent } from './events';

export interface ChatDeltaNewPayload {
  chatId: number;
  lastMessageAuthor: string;
  lastMessagePreview: string;
}
export interface ChatDeltaNewDto extends ChatDeltaNewPayload {}

export interface MeJoinedChatPayload {
  chatId: number;
}

export interface ServerToClientEvents {
  [ServerToClientEvent.APP_ERROR]: (error: ErrorResponse) => void;
  [ServerToClientEvent.CHAT_ERROR]: (error: ErrorResponse) => void;
  [ServerToClientEvent.ME_JOINED_CHAT]: (payload: MeJoinedChatPayload) => void;
  [ServerToClientEvent.ME_LEFT_CHAT]: (chatId: number) => void;
  [ServerToClientEvent.CHAT_MESSAGE_NEW]: (message: MessageWithAuthorResponseDto) => void;
  [ServerToClientEvent.CHAT_DELTA_NEW]: (payload: ChatDeltaNewPayload) => void;
  [ServerToClientEvent.CHAT_PRESENCE_USER_ONLINE]: (userId: number) => void;
  [ServerToClientEvent.CHAT_PRESENCE_USER_OFFLINE]: (userId: number) => void;
}
