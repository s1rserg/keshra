import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonModal } from 'components/CommonModal';
import { ImageCropper } from 'components/ImageCropper';
import { AvatarSlider } from 'components/AvatarSlider';
import {
  useGetAllAvatars,
  useUploadAvatarMutation,
  useSetMainAvatarMutation,
  useDeleteAvatarMutation,
} from '../../hooks';
import type { Nullable, ValueOf } from 'types/utils';
import { ModalView } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
  currentMainAvatarId: Nullable<number>;
  isMember: boolean;
}

export const ChatAvatarModal: FC<Props> = ({
  isOpen,
  onClose,
  chatId,
  currentMainAvatarId,
  isMember,
}) => {
  const { t } = useTranslation('chatsPage');

  const { data: avatars = [], isLoading: isLoadingAvatars } = useGetAllAvatars(chatId);
  const { mutateAsync: uploadAvatar } = useUploadAvatarMutation();
  const { mutate: setMainAvatar } = useSetMainAvatarMutation();
  const { mutate: deleteAvatar } = useDeleteAvatarMutation();

  const [view, setView] = useState<ValueOf<typeof ModalView>>(ModalView.GALLERY);

  const modalTitle =
    view === ModalView.GALLERY
      ? t('chatAvatarModal.avatarsTitle')
      : t('chatAvatarModal.uploadTitle');

  const handleClose = () => {
    if (view === ModalView.UPLOAD) {
      setView(ModalView.GALLERY);
      return;
    }
    onClose();
  };

  const handleUpload = async (file: File) => {
    await uploadAvatar({ id: chatId, file });
    setView(ModalView.GALLERY);
  };

  const handleSetMain = (mediaId: number) => {
    setMainAvatar({ id: chatId, mediaId });
  };

  const handleDelete = (mediaId: number) => {
    deleteAvatar({ id: chatId, mediaId });
  };

  return (
    <CommonModal isOpen={isOpen} onOpenChange={handleClose} title={modalTitle} size="lg">
      {view === ModalView.GALLERY ? (
        <div className="w-full flex justify-center">
          <AvatarSlider
            avatars={avatars}
            mainAvatarId={currentMainAvatarId}
            isLoading={isLoadingAvatars}
            onUpload={() => isMember && setView(ModalView.UPLOAD)}
            onSetMain={(id) => isMember && handleSetMain(id)}
            onDelete={(id) => isMember && handleDelete(id)}
          />
        </div>
      ) : (
        <div className="p-4">
          <ImageCropper uploadImage={handleUpload} />
        </div>
      )}
    </CommonModal>
  );
};
