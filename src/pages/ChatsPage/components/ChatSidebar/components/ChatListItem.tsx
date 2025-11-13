import { type FC } from 'react';
import type { PrivateChatListResponse, PublicChatListResponse } from 'api';
import clsx from 'clsx';

interface Props {
  chat: PrivateChatListResponse | PublicChatListResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem: FC<Props> = ({ chat, isSelected, onClick }) => {
  return (
    <div
      className={clsx(
        'flex flex-col px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-gray-200 dark:bg-gray-700',
      )}
      onClick={onClick}
    >
      <div className="font-semibold">{chat.title}</div>
      {chat.lastMessagePreview && (
        <div className="text-sm text-gray-500 truncate">{chat.lastMessagePreview}</div>
      )}
    </div>
  );
};
