import type { RefObject } from 'react';
import type { Nullable } from 'types/utils';

export interface useLoadOlderMessagesArgs {
  fetchPreviousPage: () => Promise<unknown>;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  scrollContainerRef: RefObject<Nullable<HTMLDivElement>>;
  messagesCount: number;
}
