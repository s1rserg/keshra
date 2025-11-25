import { type FC } from 'react';
import { type MessageWithAuthorResponseDto, type User } from 'api';
import { cn } from 'lib/utils';
import { MessageContent, MessageMenu, MessageReactions } from './components';
import { type EmojiClickData } from 'emoji-picker-react';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from 'components/ui';

interface Props {
  message: MessageWithAuthorResponseDto;
  isOwnMessage: boolean;
  currentUserId: number;
  onReactionSelect: (messageId: number, emoji: string) => void;
  onReactionClick: (messageId: number, emoji: string, isMyReaction: boolean) => void;
  onSelectUser: (user: User) => void;
  onEdit: (message: MessageWithAuthorResponseDto) => void;
  onDelete: (messageId: number) => void;
}

export const Message: FC<Props> = ({
  message,
  isOwnMessage,
  currentUserId,
  onReactionSelect,
  onReactionClick,
  onSelectUser,
  onEdit,
  onDelete,
}) => {
  const handleEmojiEvent = (emojiData: EmojiClickData) => {
    onReactionSelect(message.id, emojiData.emoji);
  };

  return (
    <div className={cn('flex mb-2 flex-col', isOwnMessage ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'flex max-w-full sm:max-w-[85%] md:max-w-[75%]',
          isOwnMessage ? 'justify-end' : 'justify-start',
        )}
      >
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-2 self-end mb-1">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 flex items-center justify-center text-sm font-bold text-white overflow-hidden shadow-sm cursor-pointer"
              onClick={() => onSelectUser(message.author)}
            >
              {message.author.avatar ? (
                <img
                  src={message.author.avatar.secureUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (message.author.username?.[0]?.toUpperCase() ?? 'U')
              )}
            </div>
          </div>
        )}

        <ContextMenu>
          <ContextMenuTrigger>
            <MessageContent
              message={message}
              isOwnMessage={isOwnMessage}
              onSelectUser={onSelectUser}
            />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-auto p-0 overflow-hidden border-none bg-transparent shadow-none">
            <MessageMenu
              handleEmojiEvent={handleEmojiEvent}
              message={message}
              isOwnMessage={isOwnMessage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <div className={cn('mt-1', isOwnMessage ? 'mr-0' : 'ml-10')}>
        <MessageReactions
          reactions={message.reactions}
          currentUserId={currentUserId}
          onReactionClick={(emoji, isMyReaction) =>
            onReactionClick(message.id, emoji, isMyReaction)
          }
        />
      </div>
    </div>
  );
};
