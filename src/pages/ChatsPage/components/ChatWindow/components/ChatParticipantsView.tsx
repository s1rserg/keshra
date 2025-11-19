import { type FC } from 'react';
import type { ChatParticipantWithUser, User } from 'api';
import { useTranslation } from 'react-i18next';
import { UserListItem } from '../../UserListItem';

interface Props {
  participants: ChatParticipantWithUser[];
  currentUserId: number;
  onSelectUser: (user: User) => void;
}

export const ChatParticipantsView: FC<Props> = ({ participants, currentUserId, onSelectUser }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {t('participants.count', { count: participants.length })}
      </h3>

      <div className="space-y-1">
        {participants.map(({ user }) => (
          <UserListItem
            key={user.id}
            user={user}
            isMe={user.id === currentUserId}
            onClick={() => onSelectUser(user)}
          />
        ))}
      </div>
    </div>
  );
};
