import { type FC } from 'react';
import { type MessageWithAuthorResponseDto, type User } from 'api';
import { cn } from 'lib/utils';
import { MessageReactions } from './components';
import Picker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from 'components/ui';
import { useTheme } from 'styles';

interface Props {
  message: MessageWithAuthorResponseDto;
  isOwnMessage: boolean;
  currentUserId: number;
  onReactionSelect: (messageId: number, emoji: string) => void;
  onReactionClick: (messageId: number, emoji: string, isMyReaction: boolean) => void;
  onSelectUser: (user: User) => void;
}

export const Message: FC<Props> = ({
  message,
  isOwnMessage,
  currentUserId,
  onReactionSelect,
  onReactionClick,
  onSelectUser,
}) => {
  const { theme } = useTheme();

  const handleEmojiEvent = (emojiData: EmojiClickData) => {
    onReactionSelect(message.id, emojiData.emoji);
  };

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

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
            <div
              className={cn(
                'relative px-3 py-1.5 rounded-2xl shadow-sm min-w-[120px] text-left break-words',
                isOwnMessage
                  ? 'bg-blue-500 text-white dark:bg-blue-600 rounded-br-sm'
                  : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700/50',
              )}
            >
              {!isOwnMessage && (
                <div
                  className={cn('text-xs font-semibold mb-1 cursor-pointer hover:underline')}
                  onClick={() => onSelectUser(message.author)}
                >
                  {message.author.username}
                </div>
              )}
              <div className="text-[15px] leading-snug">
                <span className="whitespace-pre-wrap">{message.content}</span>
                <span
                  className={cn(
                    'float-right ml-3 mt-1.5 select-none text-[11px] flex items-center gap-1',
                    isOwnMessage ? 'text-blue-100/90' : 'text-gray-400',
                  )}
                >
                  {formattedTime}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent className="p-0 w-auto border-none bg-transparent shadow-none overflow-visible">
            <Picker
              reactionsDefaultOpen={true}
              onReactionClick={handleEmojiEvent}
              onEmojiClick={handleEmojiEvent}
              lazyLoadEmojis={true}
              theme={theme as Theme}
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
