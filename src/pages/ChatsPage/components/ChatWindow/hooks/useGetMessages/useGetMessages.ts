import { useInfiniteQuery } from '@tanstack/react-query';
import {
  httpClient,
  QueryKeys,
  messageApiService,
  type MessageWithAuthorResponseDto,
  CursorDirection,
} from 'api';
import type { Nullable } from 'types/utils';
import { MESSAGES_LIMIT } from './config';
import { encodeCursor } from './helpers';

export const useGetMessages = (chatId: Nullable<number>) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.messages, chatId, CursorDirection.NEWER],

    queryFn: async ({ pageParam }) => {
      if (!chatId) return [];

      const direction = pageParam ? CursorDirection.OLDER : CursorDirection.NEWER;

      const res = await httpClient<MessageWithAuthorResponseDto[]>(
        messageApiService.findAllByChatId({
          chatId,
          direction: direction,
          limit: MESSAGES_LIMIT,
          cursor: pageParam,
        }),
      );
      return res.data || [];
    },

    getNextPageParam: () => undefined,

    getPreviousPageParam: (firstPage) => {
      if (!firstPage || firstPage.length < MESSAGES_LIMIT) {
        return undefined;
      }

      const oldestMessage = firstPage[0];
      if (!oldestMessage) {
        return undefined;
      }
      return encodeCursor(oldestMessage);
    },

    initialPageParam: undefined,
    enabled: !!chatId,
  });
};
