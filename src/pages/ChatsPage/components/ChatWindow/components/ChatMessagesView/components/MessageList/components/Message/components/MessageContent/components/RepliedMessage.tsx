import { type FC } from 'react';
import { type MessageWithAuthorResponseDto } from 'api';
import { cn } from 'lib/utils';
import type { Nullable } from 'types/utils';

interface Props {
  replyToMessage: Nullable<MessageWithAuthorResponseDto>;
  isOwnMessage: boolean;
  onClick?: () => void;
}

export const RepliedMessage: FC<Props> = ({ replyToMessage, isOwnMessage, onClick }) => {
  if (!replyToMessage) return null;

  return (
    <div
      onClick={onClick}
      className={cn(
        'mb-2 p-1 pl-2 border-l-[3px] rounded-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm overflow-hidden',
        isOwnMessage
          ? 'border-white/60 bg-black/5 dark:bg-black/10'
          : 'border-blue-500 bg-gray-50 dark:bg-gray-800',
      )}
    >
      <div
        className={cn('font-semibold text-xs', isOwnMessage ? 'text-white/90' : 'text-blue-500')}
      >
        {replyToMessage.author.username}
      </div>
      <div
        className={cn(
          'truncate text-xs opacity-90',
          isOwnMessage ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400',
        )}
      >
        {replyToMessage.content}
      </div>
    </div>
  );
};
