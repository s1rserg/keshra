import type { ChatAvatarMedia, UserAvatarMedia } from 'api';
import { Avatar, AvatarFallback, AvatarImage, Button } from 'components/ui';
import type { FC } from 'react';
import type { Nullable } from 'types/utils';

interface Props {
  onClick: () => void;
  disabled: boolean;
  avatar: Nullable<UserAvatarMedia | ChatAvatarMedia>;
  placeholder: string;
}

export const ChatAvatar: FC<Props> = ({ onClick, disabled, avatar, placeholder }) => {
  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick} disabled={disabled}>
      <Avatar className="h-8 w-8">
        {avatar ? (
          <AvatarImage src={avatar.secureUrl} />
        ) : (
          <AvatarFallback>{placeholder[0]?.toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
    </Button>
  );
};
