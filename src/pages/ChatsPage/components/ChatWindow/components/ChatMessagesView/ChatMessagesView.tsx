import { type FC, type RefObject, useCallback } from 'react';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';
import type { MessageWithAuthorResponseDto, User } from 'api';
import { MessageList } from './components';
import {
  useAddReactionMutation,
  useReactionSocketSubscription,
  useRemoveReactionMutation,
} from './hooks';
import type { Nullable } from 'types/utils';

interface Props {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
  chatId: number;
  isLoading: boolean;
  isDraft: boolean;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  bottomRef: RefObject<Nullable<HTMLDivElement>>;
  onFetchPreviousPage?: () => void;

  onSelectUser: (user: User) => void;
  onEditMessage: (msg: MessageWithAuthorResponseDto) => void;
  onDeleteMessage: (msgId: number) => void;
  onReplyMessage: (message: MessageWithAuthorResponseDto) => void;
}

export const ChatMessagesView: FC<Props> = ({
  messages,
  currentUserId,
  chatId,
  isLoading,
  isDraft,
  hasPreviousPage,
  isFetchingPreviousPage,
  onFetchPreviousPage,
  onSelectUser,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
  bottomRef,
}) => {
  const { t } = useTranslation('chatsPage');

  useReactionSocketSubscription(chatId);
  const addReaction = useAddReactionMutation(chatId);
  const removeReaction = useRemoveReactionMutation(chatId);

  const handleReactionSelect = useCallback(
    (messageId: number, emoji: string) => {
      const message = messages.find((m) => m.id === messageId);
      const myCurrentReaction = message?.reactions.find((r) => r.authorId === currentUserId);
      if (myCurrentReaction?.emoji === emoji) return;
      addReaction.mutate({ messageId, emoji });
    },
    [messages, currentUserId, addReaction],
  );

  const handleReactionClick = useCallback(
    (messageId: number, emoji: string, isMyReaction: boolean) => {
      if (isMyReaction) {
        removeReaction.mutate(messageId);
        return;
      }
      addReaction.mutate({ messageId, emoji });
    },
    [removeReaction, addReaction],
  );

  if (isLoading && !messages.length && !isDraft) return <Loader />;

  return (
    <div className="flex-1 h-full flex flex-col min-h-0 bg-background">
      {!isDraft && messages.length > 0 ? (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          hasPreviousPage={hasPreviousPage}
          isFetchingPreviousPage={isFetchingPreviousPage}
          onFetchPreviousPage={onFetchPreviousPage || (() => {})}
          onReactionSelect={handleReactionSelect}
          onReactionClick={handleReactionClick}
          onSelectUser={onSelectUser}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onReplyMessage={onReplyMessage}
          bottomRef={bottomRef}
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
          <p>{t('noMessages')}</p>
        </div>
      )}
    </div>
  );
};
