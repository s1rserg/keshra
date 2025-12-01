import { type FC } from 'react';
import { ChatType, type ChatDetailsResponse } from 'api';
import { InfoIcon, MessageSquareIcon, Video } from 'lucide-react';
import { ChatAvatar } from './components';
import type { Nullable, ValueOf } from 'types/utils';
import { IconButton } from 'components/IconButton';
import { ViewMode } from '../../types';
import { useTranslation } from 'react-i18next';
import { useIsUserOnline } from '../../../../hooks';
import { Badge } from 'components/ui';

interface Props {
  title: string;
  avatar: Nullable<ChatDetailsResponse['avatar']>;
  isDraft: boolean;
  chatType?: ChatType;
  partnerUserId: Nullable<number>;
  currentView: ValueOf<typeof ViewMode>;
  onToggleView: () => void;
  onAvatarClick: () => void;
  onVideoCallStart: () => void;
  isCallActive: boolean;
}

export const ChatHeader: FC<Props> = ({
  title,
  avatar,
  isDraft,
  chatType,
  partnerUserId,
  currentView,
  onToggleView,
  onAvatarClick,
  onVideoCallStart,
  isCallActive,
}) => {
  const { t } = useTranslation('chatsPage');

  const isDirectMessage = chatType === ChatType.DIRECT_MESSAGES;
  const isOnline = useIsUserOnline(partnerUserId);

  return (
    <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 overflow-hidden relative">
        <ChatAvatar
          onClick={onAvatarClick}
          disabled={isDraft || isDirectMessage}
          avatar={avatar}
          placeholder={title}
        />

        {isOnline && (
          <Badge
            variant="default"
            className="absolute left-6 bottom-0 h-3 w-3 p-0 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
          />
        )}

        <span className="font-bold truncate">{title}</span>
      </div>

      {isDirectMessage && (
        <IconButton
          size="icon"
          onClick={onVideoCallStart}
          disabled={isCallActive}
          icon={<Video className="w-5 h-5 text-gray-600" />}
          label={t('buttons.startVideoCall')}
        />
      )}

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
