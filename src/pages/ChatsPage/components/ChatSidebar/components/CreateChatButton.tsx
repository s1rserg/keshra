import type { FC } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'components/IconButton';

interface Props {
  onClick: () => void;
}

export const CreateChatButton: FC<Props> = ({ onClick }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <IconButton
      onClick={onClick}
      icon={<Plus className="w-5 h-5" />}
      label={t('buttons.newChat')}
    />
  );
};
