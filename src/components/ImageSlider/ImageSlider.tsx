import { type FC, type ReactNode } from 'react';
import type { SliderItem } from './types';
import { Button } from 'components/ui';
import { cn } from 'lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  items: SliderItem[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  overlay?: ReactNode;
  placeholder?: ReactNode;
}

export const ImageSlider: FC<Props> = ({
  items,
  currentIndex,
  onIndexChange,
  overlay,
  placeholder,
}) => {
  const handlePrev = () => {
    onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  const currentItem = items[currentIndex];

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[330px] aspect-square flex items-center justify-center rounded-xl overflow-hidden bg-muted">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[330px] aspect-square relative rounded-xl overflow-hidden bg-black">
      {currentItem && (
        <img
          src={currentItem.url}
          alt={currentItem.altText}
          className="w-full h-full object-cover"
        />
      )}

      {overlay && (
        <div className="absolute top-0 left-0 w-full p-2 flex items-center justify-between bg-black/35 backdrop-blur-md text-white">
          {overlay}
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 left-2 bg-black/40 backdrop-blur-md text-white hover:bg-black/60',
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 right-2 bg-black/40 backdrop-blur-md text-white hover:bg-black/60',
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
