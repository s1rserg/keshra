import { type RefObject } from 'react';
import { type MessageWithAuthorResponseDto, type User } from 'api';
import { MessageRow, ScrollDownButton } from './components';
import { Loader2 } from 'lucide-react';
import type { Nullable } from 'types/utils';
import { useScroll } from './hooks';

interface Props {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
  onFetchPreviousPage: () => void;
  bottomRef: RefObject<Nullable<HTMLDivElement>>;

  onReactionSelect: (messageId: number, emoji: string) => void;
  onReactionClick: (messageId: number, emoji: string, isMyReaction: boolean) => void;
  onSelectUser: (user: User) => void;
  onEditMessage: (msg: MessageWithAuthorResponseDto) => void;
  onDeleteMessage: (msgId: number) => void;
  onReplyMessage: (message: MessageWithAuthorResponseDto) => void;
}

export const MessageList = ({
  messages,
  currentUserId,
  hasPreviousPage,
  isFetchingPreviousPage,
  onFetchPreviousPage,
  bottomRef,
  ...actions
}: Props) => {
  const {
    parentRef,
    rowVirtualizer,
    virtualItems,
    handleScroll,
    scrollToBottom,
    showScrollButton,
  } = useScroll({
    messages,
    currentUserId,
    hasPreviousPage,
    isFetchingPreviousPage,
    onFetchPreviousPage,
  });

  return (
    <>
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto w-full h-full relative px-4"
        style={{ contain: 'strict' }}
        onScroll={handleScroll}
      >
        {isFetchingPreviousPage && (
          <div className="absolute top-2 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground bg-background rounded-full p-1 shadow-sm" />
          </div>
        )}

        <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = virtualItems[virtualRow.index];
            if (!item) return null;
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <MessageRow item={item} currentUserId={currentUserId} {...actions} />
              </div>
            );
          })}
        </div>

        <div
          ref={bottomRef}
          className="absolute left-0 w-full h-px pointer-events-none"
          style={{ top: `${rowVirtualizer.getTotalSize() - 1}px` }}
        />
      </div>

      <ScrollDownButton show={showScrollButton} onClick={scrollToBottom} />
    </>
  );
};
