import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
}

export const CreateChatButton: FC<Props> = ({ onClick }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{t('buttons.newChat')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
