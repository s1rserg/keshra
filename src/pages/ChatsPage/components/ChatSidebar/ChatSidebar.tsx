import { useMemo, useState, type FC } from 'react';
import {
  ChatListItem,
  ChatSidebarSearch,
  CreateChatButton,
  CreatePublicChatModal,
} from './components';
import type {
  CreatePublicChatDto,
  PrivateChatListResponse,
  PublicChatListResponse,
  User,
} from 'api';
import type { Nullable } from 'types/utils';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';
import { useModal } from 'hooks';
import { IconButton } from 'components/IconButton';
import { SearchIcon, XIcon } from 'lucide-react';

interface Props {
  chats?: (PrivateChatListResponse | PublicChatListResponse)[];
  isLoading: boolean;
  selectedChatId: Nullable<number>;
  onSelectChat: (id: number) => void;
  onSelectUser: (user: User) => void;
  isCreatingChat: boolean;
  onCreatePublicChat: (data: CreatePublicChatDto) => Promise<boolean>;
}

export const ChatSidebar: FC<Props> = ({
  chats,
  isLoading,
  selectedChatId,
  onSelectChat,
  isCreatingChat,
  onCreatePublicChat,
  onSelectUser,
}) => {
  const { t } = useTranslation('chatsPage');
  const { isOpen, open, close } = useModal();

  const [isSearching, setIsSearching] = useState(false);

  const sortedChats = useMemo(() => {
    if (!chats) return [];
    return [...chats].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [chats]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
        <span className="text-lg font-bold">{t('title')}</span>
        <div>
          <IconButton
            onClick={() => setIsSearching(!isSearching)}
            icon={isSearching ? <XIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
            label={isSearching ? t('buttons.cancelSearch') : t('buttons.search')}
          />
          <CreateChatButton onClick={open} />
        </div>
      </div>

      {isSearching ? (
        <ChatSidebarSearch onSelectChat={onSelectChat} onSelectUser={onSelectUser} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sortedChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      )}

      <CreatePublicChatModal
        open={isOpen}
        handleClose={close}
        onSubmit={onCreatePublicChat}
        isLoading={isCreatingChat}
      />
    </div>
  );
};
