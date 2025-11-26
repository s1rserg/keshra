import type { MessageWithAuthorResponseDto } from 'api';

export type VirtualItem =
  | { type: 'date'; id: string; date: string }
  | { type: 'message'; id: number; data: MessageWithAuthorResponseDto };
