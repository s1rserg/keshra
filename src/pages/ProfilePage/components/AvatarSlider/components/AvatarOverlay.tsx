import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { SliderItem } from 'components/ImageSlider';
import { IconButton } from 'components/IconButton';
import { CircleCheckBig, ImagePlus, Trash } from 'lucide-react';

interface Props {
  currentIndex: number;
  sliderItems: SliderItem[];
  isMainAvatar: boolean;
  isLoading: boolean;
  onUpload: () => void;
  onSetMain: () => void;
  onDelete: () => void;
}

export const AvatarOverlay: FC<Props> = ({
  onUpload,
  onDelete,
  onSetMain,
  isMainAvatar,
  currentIndex,
  sliderItems,
  isLoading,
}) => {
  const { t } = useTranslation('profilePage');

  const currentItem = sliderItems[currentIndex];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-1">
        <IconButton
          onClick={onUpload}
          disabled={isLoading}
          label={t('slider.add') || ''}
          icon={<ImagePlus className="h-4 w-4 text-white" />}
        />

        <IconButton
          onClick={onDelete}
          disabled={isLoading}
          label={t('slider.delete') || ''}
          icon={<Trash className="h-4 w-4 text-white" />}
        />

        <IconButton
          onClick={onSetMain}
          disabled={isMainAvatar || isLoading}
          label={t('slider.setMain') || ''}
          variant={isMainAvatar ? 'secondary' : 'ghost'}
          icon={
            <CircleCheckBig
              className={isMainAvatar ? 'h-4 w-4 text-primary' : 'h-4 w-4 text-white'}
            />
          }
        />
      </div>

      {currentItem && (
        <span className="text-xs">{new Date(currentItem.createdAt).toLocaleDateString()}</span>
      )}

      <span className="text-sm">
        {sliderItems.length ? `${currentIndex + 1} / ${sliderItems.length}` : '-'}
      </span>
    </div>
  );
};
