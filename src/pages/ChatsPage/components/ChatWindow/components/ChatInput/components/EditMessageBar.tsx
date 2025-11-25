import { type FC } from 'react';
import { X, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'components/IconButton';

interface Props {
  isEditing: boolean;
  onCancel: () => void;
  originalContent?: string;
}

export const EditMessageBar: FC<Props> = ({ isEditing, onCancel, originalContent }) => {
  const { t } = useTranslation('chatsPage');

  if (!isEditing) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-l border-r border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-t-lg ml-4 mr-15 backdrop-blur-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <Pencil className="w-5 h-5 text-blue-500" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-blue-500">{t('editMessage.title')}</span>
          <span className="text-xs text-gray-500 truncate dark:text-gray-400">
            {originalContent}
          </span>
        </div>
      </div>
      <IconButton
        onClick={onCancel}
        label={t('editMessage.buttons.cancel')}
        icon={<X className="w-5 h-5 text-gray-500" />}
        variant="ghost"
        size="icon"
      />
    </div>
  );
};
