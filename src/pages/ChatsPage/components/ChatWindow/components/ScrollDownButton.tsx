import { type FC } from 'react';
import { ArrowDown } from 'lucide-react';
import { IconButton } from 'components/IconButton';
import { useTranslation } from 'react-i18next';

interface Props {
  show: boolean;
  onClick: () => void;
}

export const ScrollDownButton: FC<Props> = ({ show, onClick }) => {
  const { t } = useTranslation('chatsPage');

  if (!show) return null;

  return (
    <div className="absolute bottom-20 right-6 z-20 animate-in fade-in zoom-in duration-200">
      <IconButton
        onClick={onClick}
        label={t('buttons.scrollDown')}
        icon={<ArrowDown className="h-5 w-5" />}
        variant="secondary"
        size="icon"
      />
    </div>
  );
};
