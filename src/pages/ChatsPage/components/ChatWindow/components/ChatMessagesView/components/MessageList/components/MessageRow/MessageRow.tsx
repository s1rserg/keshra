import { memo } from 'react';
import { type MessageWithAuthorResponseDto, type User } from 'api';
import { DateSeparator, Message } from './components';
import type { VirtualItem } from '../../types';

interface Props {
  item: VirtualItem;
  currentUserId: number;

  onReactionSelect: (id: number, emoji: string) => void;
  onReactionClick: (id: number, emoji: string, isMy: boolean) => void;
  onSelectUser: (user: User) => void;
  onEditMessage: (msg: MessageWithAuthorResponseDto) => void;
  onDeleteMessage: (id: number) => void;
  onReplyMessage: (msg: MessageWithAuthorResponseDto) => void;
}

export const MessageRow = memo(
  ({
    item,
    currentUserId,
    onReactionSelect,
    onReactionClick,
    onSelectUser,
    onEditMessage,
    onDeleteMessage,
    onReplyMessage,
  }: Props) => {
    if (item.type === 'date') {
      return <DateSeparator date={item.date} />;
    }

    const msg = item.data;
    const isOwn = msg.authorId === currentUserId;

    return (
      <div className="mb-2">
        <Message
          message={msg}
          isOwnMessage={isOwn}
          currentUserId={currentUserId}
          onReactionSelect={onReactionSelect}
          onReactionClick={onReactionClick}
          onSelectUser={onSelectUser}
          onEdit={onEditMessage}
          onDelete={onDeleteMessage}
          onReply={onReplyMessage}
        />
      </div>
    );
  },
  (prev, next) => {
    if (prev.item.type !== next.item.type) return false;
    if (prev.item.type === 'message' && next.item.type === 'message') {
      return prev.item.data === next.item.data;
    }
    return true;
  },
);
