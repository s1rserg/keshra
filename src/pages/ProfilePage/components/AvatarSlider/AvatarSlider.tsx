import { useState, useEffect, type FC } from 'react';
import { ImageSlider } from 'components/ImageSlider';
import type { Nullable } from 'types/utils';
import type { UserAvatarMedia } from 'api';
import { AvatarOverlay, AvatarPlaceholder } from './components';

interface Props {
  avatars: UserAvatarMedia[];
  mainAvatarId: Nullable<number>;
  onUpload: () => void;
  onSetMain: (mediaId: UserAvatarMedia['id']) => void;
  onDelete: (mediaId: UserAvatarMedia['id']) => void;
  isLoading: boolean;
}

export const AvatarSlider: FC<Props> = ({
  avatars,
  mainAvatarId,
  onUpload,
  onSetMain,
  onDelete,
  isLoading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderItems = avatars.map((a) => ({
    id: a.id,
    url: a.secureUrl,
    altText: `Avatar ${a.id}`,
    createdAt: a.createdAt,
  }));

  const currentItem = sliderItems[currentIndex];
  const isMain = currentItem?.id === mainAvatarId;

  const handleDelete = () => {
    if (!currentItem) return;
    onDelete(currentItem.id);
  };

  const handleSetMain = () => {
    if (!currentItem) return;
    onSetMain(currentItem.id);
  };

  useEffect(() => {
    setCurrentIndex(mainAvatarId ? avatars.findIndex((a) => a.id === mainAvatarId) : 0);
  }, [avatars, mainAvatarId]);

  return (
    <ImageSlider
      items={sliderItems}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      overlay={
        <AvatarOverlay
          currentIndex={currentIndex}
          sliderItems={sliderItems}
          onUpload={onUpload}
          onDelete={handleDelete}
          onSetMain={handleSetMain}
          isMainAvatar={isMain}
          isLoading={isLoading}
        />
      }
      placeholder={<AvatarPlaceholder isLoading={isLoading} onUpload={onUpload} />}
    />
  );
};
