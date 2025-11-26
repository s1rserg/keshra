import type { MessageWithAuthorResponseDto, User } from 'api';
import { cn } from 'lib/utils';
import type { FC } from 'react';
import { RepliedMessage } from './components';

interface Props {
  message: MessageWithAuthorResponseDto;
  isOwnMessage: boolean;
  onSelectUser: (user: User) => void;
}

export const MessageContent: FC<Props> = ({ message, isOwnMessage, onSelectUser }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div
      className={cn(
        'relative px-3 py-1.5 rounded-2xl shadow-sm min-w-[120px] text-left break-words',
        isOwnMessage
          ? 'bg-blue-500 text-white dark:bg-blue-600 rounded-br-sm'
          : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700/50',
      )}
    >
      {message.replyToId && (
        <RepliedMessage
          replyToMessage={message.replyToMessage}
          isOwnMessage={isOwnMessage}
          onClick={() => {}}
        />
      )}
      {!isOwnMessage && (
        <div
          className={cn('text-xs font-semibold mb-1 cursor-pointer hover:underline')}
          onClick={() => onSelectUser(message.author)}
        >
          {message.author.username}
        </div>
      )}
      <div className="text-[15px] leading-snug">
        <span className="whitespace-pre-wrap">{message.content}</span>
        <span
          className={cn(
            'float-right ml-3 mt-1.5 select-none text-[11px] flex items-center gap-1',
            isOwnMessage ? 'text-blue-100/90' : 'text-gray-400',
          )}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
