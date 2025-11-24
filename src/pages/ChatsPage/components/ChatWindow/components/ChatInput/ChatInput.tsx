import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from 'components/ui';
import { Send } from 'lucide-react';
import { IconButton } from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { type CreateMessageDto } from 'api';
import { type EmojiClickData } from 'emoji-picker-react';
import { EmojiPickerButton } from './components';

interface Props {
  onSubmit: (content: string) => Promise<void>;
}

export const ChatInput: FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation('chatsPage');

  const { register, handleSubmit, reset, setValue, getValues, setFocus } =
    useForm<Pick<CreateMessageDto, 'content'>>();

  const handleSend = handleSubmit(async (data) => {
    const content = data.content.trim();
    if (!content) return;

    await onSubmit(content);
    reset();
  });

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = getValues('content') || '';
    setValue('content', currentContent + emojiData.emoji);
    setFocus('content');
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={(e) => void handleSend(e)} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Input
            {...register('content')}
            placeholder={t('sendMessage.placeholders.message')}
            autoComplete="off"
            className="pr-10"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <EmojiPickerButton onEmojiClick={handleEmojiClick} />
          </div>
        </div>

        <IconButton
          type="submit"
          label={t('sendMessage.buttons.send')}
          icon={<Send className="w-4 h-4" />}
        />
      </form>
    </div>
  );
};
