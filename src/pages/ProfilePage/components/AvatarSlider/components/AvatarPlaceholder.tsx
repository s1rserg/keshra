import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePlus } from 'lucide-react';
import { IconButton } from 'components/IconButton';

interface Props {
  isLoading: boolean;
  onUpload: () => void;
}

export const AvatarPlaceholder: FC<Props> = ({ onUpload, isLoading }) => {
  const { t } = useTranslation('profilePage');
  return (
    <IconButton
      onClick={onUpload}
      disabled={isLoading}
      label={t('slider.add')}
      icon={<ImagePlus className="h-5 w-5" />}
    />
  );
};
