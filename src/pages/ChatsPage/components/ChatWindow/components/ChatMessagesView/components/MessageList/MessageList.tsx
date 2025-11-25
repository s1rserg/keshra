import { type FC } from 'react';
import { type MessageWithAuthorResponseDto, type User } from 'api';
import { Message, DateSeparator } from './components';

interface Props {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
  onReactionSelect: (messageId: number, emoji: string) => void;
  onReactionClick: (messageId: number, emoji: string, isMyReaction: boolean) => void;
  onSelectUser: (user: User) => void;
  onEditMessage: (msg: MessageWithAuthorResponseDto) => void;
  onDeleteMessage: (msgId: number) => void;
  onReplyMessage: (message: MessageWithAuthorResponseDto) => void;
}

export const MessageList: FC<Props> = ({
  messages,
  currentUserId,
  onReactionClick,
  onReactionSelect,
  onSelectUser,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
}) => {
  return (
    <div className="flex-1 p-4 space-y-2">
      {messages.map((msg, idx) => {
        const prevMsg = messages[idx - 1];
        const showDateSeparator =
          !prevMsg ||
          new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

        return (
          <div key={msg.id}>
            {showDateSeparator && <DateSeparator date={msg.createdAt} />}
            <Message
              message={msg}
              isOwnMessage={msg.authorId === currentUserId}
              currentUserId={currentUserId}
              onReactionClick={onReactionClick}
              onReactionSelect={onReactionSelect}
              onSelectUser={onSelectUser}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
              onReply={onReplyMessage}
            />
          </div>
        );
      })}
    </div>
  );
};
