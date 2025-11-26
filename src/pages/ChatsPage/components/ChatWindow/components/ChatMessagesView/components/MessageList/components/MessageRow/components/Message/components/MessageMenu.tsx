import { ContextMenuItem, ContextMenuSeparator } from 'components/ui';
import { Pencil, Reply, Trash2 } from 'lucide-react';
import type { FC } from 'react';
import Picker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { useTheme } from 'styles';
import type { MessageWithAuthorResponseDto } from 'api';
import { useTranslation } from 'react-i18next';

interface Props {
  handleEmojiEvent: (emojiData: EmojiClickData) => void;
  isOwnMessage: boolean;
  message: MessageWithAuthorResponseDto;
  onEdit: (message: MessageWithAuthorResponseDto) => void;
  onDelete: (messageId: number) => void;
  onReply: (message: MessageWithAuthorResponseDto) => void;
}

export const MessageMenu: FC<Props> = ({
  handleEmojiEvent,
  isOwnMessage,
  message,
  onDelete,
  onEdit,
  onReply,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('chatsPage');

  return (
    <>
      <div className="mb-2 shadow-lg rounded-lg overflow-hidden">
        <Picker
          reactionsDefaultOpen={true}
          onReactionClick={handleEmojiEvent}
          onEmojiClick={handleEmojiEvent}
          lazyLoadEmojis={true}
          theme={theme as Theme}
          width={300}
          height={350}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-xl p-1 w-[300px]">
        <ContextMenuItem onClick={() => onReply(message)} className="cursor-pointer gap-2">
          <Reply className="w-4 h-4" />
          {t('messageMenu.buttons.reply')}
        </ContextMenuItem>
        {isOwnMessage && (
          <>
            <ContextMenuItem onClick={() => onEdit(message)} className="cursor-pointer gap-2">
              <Pencil className="w-4 h-4" />
              {t('messageMenu.buttons.edit')}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onDelete(message.id)}
              className="cursor-pointer gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              {t('messageMenu.buttons.delete')}
            </ContextMenuItem>
          </>
        )}
      </div>
    </>
  );
};
