import { type FC } from 'react';
import type { User } from 'api';
import { Avatar, AvatarFallback, AvatarImage, Badge } from 'components/ui';
import { cn } from 'lib/utils';
import { useIsUserOnline } from '../hooks';

interface Props {
  user: User;
  isSelected?: boolean;
  isMe?: boolean;
  onClick?: () => void;
  className?: string;
}

export const UserListItem: FC<Props> = ({ user, isSelected, isMe = false, onClick, className }) => {
  const isOnline = useIsUserOnline(user.id);

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
      <div className="relative flex shrink-0 items-start">
        <Avatar className="h-10 w-10">
          {user.avatar ? (
            <AvatarImage src={user.avatar.secureUrl} />
          ) : (
            <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
          )}
        </Avatar>

        {isOnline && (
          <Badge
            variant="default"
            className="absolute bottom-0 right-0 h-3 w-3 p-0 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
          />
        )}
      </div>

      <div className="flex flex-col min-w-0 overflow-hidden">
        <div className="font-medium truncate text-gray-900 dark:text-gray-100">{displayName}</div>

        {user.username && <div className="text-xs text-gray-500 truncate">@{user.username}</div>}
      </div>
    </div>
  );
};
