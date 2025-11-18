import { type FC } from 'react';
import type { PrivateChatListResponse, PublicChatListResponse } from 'api';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui';
import { cn } from 'lib/utils';

interface Props {
  chat: PrivateChatListResponse | PublicChatListResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem: FC<Props> = ({ chat, isSelected, onClick }) => {
  return (
    <div
      className={cn(
        'flex px-4 py-3 cursor-pointer rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-200 dark:bg-gray-700',
      )}
      onClick={onClick}
    >
      <div className="flex items-start">
        <Avatar className="h-full w-10">
          {chat.avatar ? (
            <AvatarImage src={chat.avatar.secureUrl} />
          ) : (
            <AvatarFallback>{chat.title[0]}</AvatarFallback>
          )}
        </Avatar>
      </div>

      <div className="flex flex-col justify-center ml-3 w-full min-w-0">
        <div className="font-medium truncate">{chat.title}</div>

        {chat.lastMessagePreview && (
          <div className="text-sm text-gray-500 truncate">{chat.lastMessagePreview}</div>
        )}
      </div>
    </div>
  );
};
