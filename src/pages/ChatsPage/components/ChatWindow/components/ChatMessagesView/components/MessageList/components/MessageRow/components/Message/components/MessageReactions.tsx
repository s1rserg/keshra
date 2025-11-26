import { type FC, useMemo } from 'react';
import { type Reaction } from 'api';
import { cn } from 'lib/utils';

interface Props {
  reactions: Reaction[];
  currentUserId: number;
  onReactionClick: (emoji: string, isMyReaction: boolean) => void;
}

export const MessageReactions: FC<Props> = ({ reactions, currentUserId, onReactionClick }) => {
  const groupedReactions = useMemo(() => {
    const groups = new Map<string, Reaction[]>();
    reactions.forEach((r) => {
      const list = groups.get(r.emoji) || [];
      list.push(r);
      groups.set(r.emoji, list);
    });
    return Array.from(groups.entries());
  }, [reactions]);

  const totalReactionsCount = reactions.length;
  const showCount = totalReactionsCount > 3;

  if (groupedReactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {groupedReactions.map(([emoji, list]) => {
        const isMyReaction = list.some((r) => r.authorId === currentUserId);
        const count = list.length;

        return (
          <button
            key={emoji}
            onClick={() => onReactionClick(emoji, isMyReaction)}
            className={cn(
              'flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-colors select-none',
              isMyReaction
                ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                : 'bg-gray-100 border-transparent dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            <span>{emoji}</span>

            {showCount ? (
              <span
                className={cn(
                  'font-medium ml-0.5',
                  isMyReaction
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400',
                )}
              >
                {count}
              </span>
            ) : (
              <div className="flex -space-x-1 ml-1">
                {list.map((r) => (
                  <div
                    key={r.id}
                    className="w-4 h-4 rounded-full border border-white dark:border-gray-900 overflow-hidden bg-gray-300 flex items-center justify-center"
                  >
                    {r.author.avatar ? (
                      <img
                        src={r.author.avatar.secureUrl}
                        alt="ava"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[8px] text-white bg-blue-500 w-full h-full flex items-center justify-center">
                        {r.author.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
