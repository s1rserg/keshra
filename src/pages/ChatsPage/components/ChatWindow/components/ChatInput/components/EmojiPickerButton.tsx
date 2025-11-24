import { type FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui';
import { Smile } from 'lucide-react';
import Picker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { useTheme } from 'styles';
import { IconButton } from 'components/IconButton';
import { useTranslation } from 'react-i18next';

interface Props {
  onEmojiClick: (emojiData: EmojiClickData) => void;
}

export const EmojiPickerButton: FC<Props> = ({ onEmojiClick }) => {
  const { t } = useTranslation('chatsPage');
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="inline-flex">
          <IconButton
            label={t('sendMessage.buttons.addEmoji')}
            icon={
              <Smile className="w-5 h-5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
            }
            variant="ghost"
            size="icon"
          />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-none shadow-none bg-transparent"
        side="top"
        align="end"
        sideOffset={10}
      >
        <Picker
          theme={theme as Theme}
          onEmojiClick={onEmojiClick}
          lazyLoadEmojis={true}
          searchDisabled={false}
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
        />
      </PopoverContent>
    </Popover>
  );
};
