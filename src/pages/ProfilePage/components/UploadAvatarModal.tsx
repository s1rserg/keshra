import { CommonModal } from 'components/CommonModal';
import { ImageCropper } from 'components/ImageCropper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export const UploadAvatarModal: FC<Props> = ({ isOpen, onClose, onUpload }) => {
  const { t } = useTranslation('profilePage');

  return (
    <CommonModal isOpen={isOpen} onOpenChange={onClose} title={t('modal.title')} size="lg">
      <ImageCropper uploadImage={onUpload} />
    </CommonModal>
  );
};
