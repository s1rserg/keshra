import { type FC } from 'react';
import type { User } from 'api';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui';
import { cn } from 'lib/utils';

interface Props {
  user: User;
  isSelected?: boolean;
  isMe?: boolean;
  onClick?: () => void;
  className?: string;
}

export const UserListItem: FC<Props> = ({ user, isSelected, isMe = false, onClick, className }) => {
  const displayName = user.name ? `${user.name} ${user.surname || ''}`.trim() : user.username;

  return (
    <div
      className={cn(
        'flex items-center px-4 py-3 rounded-lg transition-colors gap-3',
        !isMe && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-200 dark:bg-gray-700',
        isMe && 'opacity-60 cursor-default',
        className,
      )}
      onClick={!isMe ? onClick : undefined}
    >
      <Avatar className="h-10 w-10">
        {user.avatar ? (
          <AvatarImage src={user.avatar.secureUrl} />
        ) : (
          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
        )}
      </Avatar>

      <div className="flex flex-col min-w-0 overflow-hidden">
        <div className="font-medium truncate text-gray-900 dark:text-gray-100">{displayName}</div>

        {user.username && <div className="text-xs text-gray-500 truncate">@{user.username}</div>}
      </div>
    </div>
  );
};
