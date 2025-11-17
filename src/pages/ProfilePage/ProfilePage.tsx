import { Loader } from 'components/Loader';
import { type FC } from 'react';
import { useGetUser, useModal } from 'hooks';
import { type UpdateUserDto, type UserAvatarMedia } from 'api';
import { AvatarSlider, UploadAvatarModal, UserData, UpdateProfileModal } from './components';
import {
  useDeleteAvatarMutation,
  useGetAllAvatars,
  useSetMainAvatarMutation,
  useUploadAvatarMutation,
  useUpdateProfileMutation,
} from './hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const ProfilePage: FC = () => {
  const { t } = useTranslation('profilePage');

  const { data: user, isLoading: isUserLoading } = useGetUser();
  const { data: allAvatars = [], isLoading: areAvatarsLoading } = useGetAllAvatars();

  const { isOpen: isUploadModalOpen, open: openUploadModal, close: closeUploadModal } = useModal();
  const { isOpen: isUpdateModalOpen, open: openUpdateModal, close: closeUpdateModal } = useModal();

  const { mutateAsync: updateUser, isPending: isUpdateLoading } = useUpdateProfileMutation();
  const { mutateAsync: uploadAvatar } = useUploadAvatarMutation();

  const { mutate: setMainAvatar, isPending: isSettingMain } = useSetMainAvatarMutation();
  const { mutate: deleteAvatar, isPending: isDeleting } = useDeleteAvatarMutation();

  const handleUpdateUserSubmit = async (data: UpdateUserDto): Promise<boolean> => {
    try {
      await updateUser(data);
      closeUpdateModal();
      toast.success(t('updateModal.successMsg'));
      return true;
    } catch (_error) {
      return false;
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await uploadAvatar(file);
      closeUploadModal();
    } catch (_error) {
      /* empty */
    }
  };

  const handleSetMainAvatar = (mediaId: UserAvatarMedia['id']) => {
    setMainAvatar(mediaId);
  };

  const handleDeleteAvatar = (mediaId: UserAvatarMedia['id']) => {
    deleteAvatar(mediaId);
  };

  if (isUserLoading || areAvatarsLoading || !user) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex gap-4 justify-center align-center flex-wrap p-4  ">
        <AvatarSlider
          avatars={allAvatars}
          mainAvatarId={user.avatar?.id ?? null}
          onUpload={openUploadModal}
          onSetMain={handleSetMainAvatar}
          onDelete={handleDeleteAvatar}
          isLoading={isSettingMain || isDeleting}
        />
        <UserData user={user} openUpdateModal={openUpdateModal} />
      </div>

      <UploadAvatarModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onUpload={handleUploadAvatar}
      />
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateUserSubmit}
        isLoading={isUpdateLoading}
        user={user}
      />
    </>
  );
};
