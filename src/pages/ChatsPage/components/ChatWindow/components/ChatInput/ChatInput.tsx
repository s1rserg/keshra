import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from 'components/ui';
import { Send, Check } from 'lucide-react';
import { IconButton } from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { type CreateMessageDto, type MessageWithAuthorResponseDto } from 'api';
import { type EmojiClickData } from 'emoji-picker-react';
import { EmojiPickerButton, EditMessageBar, ReplyMessageBar } from './components';
import type { Nullable } from 'types/utils';

interface Props {
  onSendMessage: (content: string, replyToId?: number) => Promise<void>;
  onEditMessage: (messageId: number, content: string) => Promise<void>;
  editingMessage: Nullable<MessageWithAuthorResponseDto>;
  replyingMessage: Nullable<MessageWithAuthorResponseDto>;
  onCancelEdit: () => void;
  onCancelReply: () => void;
}

export const ChatInput: FC<Props> = ({
  onSendMessage,
  onEditMessage,
  editingMessage,
  replyingMessage,
  onCancelEdit,
  onCancelReply,
}) => {
  const { t } = useTranslation('chatsPage');

  const { register, handleSubmit, reset, setValue, getValues, setFocus } =
    useForm<Pick<CreateMessageDto, 'content'>>();

  const handleFormSubmit = handleSubmit(async (data) => {
    const content = data.content.trim();
    if (!content) return;

    if (editingMessage) {
      await onEditMessage(editingMessage.id, content);
    } else {
      await onSendMessage(content, replyingMessage?.id);
    }

    if (!editingMessage) {
      reset();
    }
  });

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = getValues('content') || '';
    setValue('content', currentContent + emojiData.emoji);
    setFocus('content');
  };

  useEffect(() => {
    if (editingMessage) {
      setValue('content', editingMessage.content);
    }

    const timer = setTimeout(() => {
      setFocus('content');
    }, 0);

    return () => clearTimeout(timer);
  }, [editingMessage, replyingMessage, setValue, setFocus]);

  return (
    <div className="flex flex-col border-t border-gray-200 dark:border-gray-800">
      {editingMessage ? (
        <EditMessageBar
          isEditing={!!editingMessage}
          onCancel={onCancelEdit}
          originalContent={editingMessage.content}
        />
      ) : (
        <ReplyMessageBar replyingTo={replyingMessage} onCancel={onCancelReply} />
      )}

      <div className="p-4 pt-0 bg-background z-10">
        <form onSubmit={(e) => void handleFormSubmit(e)} className="flex gap-2 items-center">
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
            label={editingMessage ? t('editMessage.buttons.save') : t('sendMessage.buttons.send')}
            icon={editingMessage ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          />
        </form>
      </div>
    </div>
  );
};
