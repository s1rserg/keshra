import { type FC } from 'react';
import { X, Reply } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'components/IconButton';
import { type MessageWithAuthorResponseDto } from 'api';
import type { Nullable } from 'types/utils';

interface Props {
  replyingTo: Nullable<MessageWithAuthorResponseDto>;
  onCancel: () => void;
}

export const ReplyMessageBar: FC<Props> = ({ replyingTo, onCancel }) => {
  const { t } = useTranslation('chatsPage');

  if (!replyingTo) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-l border-r border-blue-500/30 bg-gray-50/80 dark:bg-gray-800/80 rounded-t-lg ml-4 mr-15 backdrop-blur-sm relative top-1">
      <div className="flex items-center gap-3 overflow-hidden">
        <Reply className="w-5 h-5 text-blue-500" />
        <div className="flex flex-col min-w-0 border-l-2 border-blue-500 pl-2">
          <span className="text-sm font-bold text-blue-500 truncate">
            {replyingTo.author.username}
          </span>
          <span className="text-xs text-gray-500 truncate dark:text-gray-400">
            {replyingTo.content}
          </span>
        </div>
      </div>
      <IconButton
        onClick={onCancel}
        label={t('replyMessage.buttons.cancel')}
        icon={<X className="w-5 h-5 text-gray-500" />}
        variant="ghost"
        size="icon"
      />
    </div>
  );
};
