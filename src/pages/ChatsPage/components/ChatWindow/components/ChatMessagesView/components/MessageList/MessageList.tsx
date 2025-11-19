import { type FC } from 'react';
import { type MessageWithAuthorResponseDto } from 'api';
import { Message, DateSeparator } from './components';

interface Props {
  messages: MessageWithAuthorResponseDto[];
  currentUserId: number;
}

export const MessageList: FC<Props> = ({ messages, currentUserId }) => {
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
            <Message message={msg} isOwnMessage={msg.authorId === currentUserId} />
          </div>
        );
      })}
    </div>
  );
};
