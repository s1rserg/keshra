import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from 'components/ui';
import { Send } from 'lucide-react';
import { IconButton } from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { type CreateMessageDto } from 'api';

interface Props {
  onSubmit: (content: string) => void;
}

export const ChatInput: FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation('chatsPage');
  const { register, handleSubmit, reset } = useForm<Pick<CreateMessageDto, 'content'>>();

  const handleSend = handleSubmit((data) => {
    const content = data.content.trim();
    if (!content) return;

    onSubmit(content);
    reset();
  });

  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={(e) => void handleSend(e)} className="flex gap-2">
        <Input
          {...register('content')}
          placeholder={t('sendMessage.placeholders.message')}
          autoComplete="off"
        />
        <IconButton
          type="submit"
          label={t('sendMessage.buttons.send')}
          icon={<Send className="w-4 h-4" />}
        />
      </form>
    </div>
  );
};
