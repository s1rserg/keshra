import { type FC } from 'react';
import { ChatType, type ChatDetailsResponse } from 'api';
import { InfoIcon, MessageSquareIcon } from 'lucide-react';
import { ChatAvatar } from './components';
import type { Nullable, ValueOf } from 'types/utils';
import { IconButton } from 'components/IconButton';
import { ViewMode } from '../../types';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  avatar: Nullable<ChatDetailsResponse['avatar']>;
  isDraft: boolean;
  chatType?: ChatType;
  currentView: ValueOf<typeof ViewMode>;
  onToggleView: () => void;
  onAvatarClick: () => void;
}

export const ChatHeader: FC<Props> = ({
  title,
  avatar,
  isDraft,
  chatType,
  currentView,
  onToggleView,
  onAvatarClick,
}) => {
  const { t } = useTranslation('chatsPage');

  const isDirectMessage = chatType === ChatType.DIRECT_MESSAGES;

  return (
    <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 overflow-hidden">
        <ChatAvatar
          onClick={onAvatarClick}
          disabled={isDraft || isDirectMessage}
          avatar={avatar}
          placeholder={title}
        />
        <span className="font-bold truncate">{title}</span>
      </div>

      {!isDraft && !isDirectMessage && (
        <IconButton
          onClick={onToggleView}
          label={
            currentView === ViewMode.MESSAGES
              ? t('buttons.showParticipants')
              : t('buttons.showMessages')
          }
          icon={
            currentView === ViewMode.MESSAGES ? (
              <InfoIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <MessageSquareIcon className="w-5 h-5 text-gray-600" />
            )
          }
        />
      )}
    </div>
  );
};
