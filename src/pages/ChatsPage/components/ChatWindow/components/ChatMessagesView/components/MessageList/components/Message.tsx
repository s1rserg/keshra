import { type FC } from 'react';
import { type MessageWithAuthorResponseDto } from 'api';
import { cn } from 'lib/utils';

interface Props {
  message: MessageWithAuthorResponseDto;
  isOwnMessage: boolean;
}

export const Message: FC<Props> = ({ message, isOwnMessage }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className={cn('flex mb-2 items-end', isOwnMessage ? 'justify-end' : 'justify-start')}>
      {!isOwnMessage && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-blue-400 dark:bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
            {message.author.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>
      )}

      <div
        className={cn(
          'min-w-[140px] max-w-[70%] px-4 py-2 rounded-2xl break-words shadow-sm',
          isOwnMessage
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 rounded-br-none'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none',
        )}
      >
        <div className="text-sm">{message.content}</div>
        <div
          className={cn(
            'text-xs mt-1 text-right',
            isOwnMessage ? 'text-white/80 dark:text-white/70' : 'text-gray-500 dark:text-gray-400',
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
