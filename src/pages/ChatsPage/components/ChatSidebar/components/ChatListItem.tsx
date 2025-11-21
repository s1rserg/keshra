import { type FC } from 'react';
import { ChatType, type PrivateChatListResponse, type PublicChatListResponse } from 'api';
import { Avatar, AvatarFallback, AvatarImage, Badge } from 'components/ui';
import { cn } from 'lib/utils';
import { useIsUserOnline } from '../../../hooks';

interface Props {
  chat: PrivateChatListResponse | PublicChatListResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem: FC<Props> = ({ chat, isSelected, onClick }) => {
  const partnerId =
    chat.type === ChatType.DIRECT_MESSAGES ? (chat as PrivateChatListResponse).partnerUserId : null;
  const isOnline = useIsUserOnline(partnerId);

  return (
    <div
      className={cn(
        'flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-200 dark:bg-gray-700',
      )}
      onClick={onClick}
    >
      <div className="relative flex shrink-0 items-start">
        <Avatar className="h-10 w-10">
          {chat.avatar ? (
            <AvatarImage src={chat.avatar.secureUrl} />
          ) : (
            <AvatarFallback>{chat.title?.[0]}</AvatarFallback>
          )}
        </Avatar>

        {isOnline && (
          <Badge
            variant="default"
            className="absolute left-7 bottom-0 h-3 w-3 p-0 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
          />
        )}
      </div>

      <div className="flex flex-col justify-center ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <div className="font-medium truncate pr-2">{chat.title}</div>
        </div>

        {chat.lastMessagePreview && (
          <div className="text-sm text-gray-500 truncate dark:text-gray-400">
            {chat.lastMessagePreview}
          </div>
        )}
      </div>

      {chat.unreadCount && chat.unreadCount > 0 ? (
        <div className="ml-2 shrink-0">
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-neutral-500 px-1 text-[11px] font-bold text-white shadow-sm">
            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
          </span>
        </div>
      ) : null}
    </div>
  );
};
