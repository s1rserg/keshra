import { type FC, type RefObject } from 'react';
import { MessageList, ScrollDownButton } from './components';
import { Loader2 } from 'lucide-react';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';
import type { MessageWithAuthorResponseDto, User } from 'api';
import type { Nullable } from 'types/utils';
import {
  useAddReactionMutation,
  useReactionSocketSubscription,
  useRemoveReactionMutation,
} from './hooks';

interface Props {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
  chatId: number;
  isLoading: boolean;
  isDraft: boolean;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  showScrollDownButton: boolean;
  onScrollToBottom: () => void;
  scrollRef: RefObject<Nullable<HTMLDivElement>>;
  topTriggerRef: (node: Nullable<HTMLDivElement>) => (() => void | undefined) | undefined;
  bottomRef: RefObject<Nullable<HTMLDivElement>>;
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
  showScrollDownButton,
  onScrollToBottom,
  scrollRef,
  topTriggerRef,
  bottomRef,
  onSelectUser,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
}) => {
  const { t } = useTranslation('chatsPage');

  useReactionSocketSubscription(chatId);
  const addReaction = useAddReactionMutation(chatId);
  const removeReaction = useRemoveReactionMutation(chatId);

  const handleReactionSelect = (messageId: number, emoji: string) => {
    const message = messages.find((m) => m.id === messageId);
    const myCurrentReaction = message?.reactions.find((r) => r.authorId === currentUserId);

    if (myCurrentReaction?.emoji === emoji) return;

    addReaction.mutate({ messageId, emoji });
  };

  const handleReactionClick = (messageId: number, emoji: string, isMyReaction: boolean) => {
    if (isMyReaction) {
      removeReaction.mutate(messageId);
      return;
    }
    addReaction.mutate({ messageId, emoji });
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'auto' }}>
        {hasPreviousPage && !isDraft && (
          <div ref={topTriggerRef} className="flex justify-center py-2 shrink-0 h-8 w-full">
            {isFetchingPreviousPage && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        )}

        {isLoading && !messages.length && !isDraft ? (
          <Loader />
        ) : (
          <MessageList
            messages={isDraft ? [] : messages}
            currentUserId={currentUserId}
            onReactionSelect={handleReactionSelect}
            onReactionClick={handleReactionClick}
            onSelectUser={onSelectUser}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onReplyMessage={onReplyMessage}
          />
        )}

        {isDraft && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
            <p>{t('noMessages')}</p>
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      <ScrollDownButton show={showScrollDownButton} onClick={onScrollToBottom} />
    </>
  );
};
