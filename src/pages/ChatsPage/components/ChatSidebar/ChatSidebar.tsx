import { type FC } from 'react';
import { ChatListItem, CreateChatButton, CreatePublicChatModal } from './components';
import type { CreatePublicChatDto, PrivateChatListResponse, PublicChatListResponse } from 'api';
import type { Nullable } from 'types/utils';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';
import { useModal } from 'hooks';

interface Props {
  chats?: (PrivateChatListResponse | PublicChatListResponse)[];
  isLoading: boolean;
  selectedChatId: Nullable<number>;
  onSelectChat: (id: number) => void;
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
}) => {
  const { t } = useTranslation('chatsPage');
  const { isOpen, open, close } = useModal();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <span className="text-lg font-bold">{t('title')}</span>
        <CreateChatButton onClick={open} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats?.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
      <CreatePublicChatModal
        open={isOpen}
        handleClose={close}
        onSubmit={onCreatePublicChat}
        isLoading={isCreatingChat}
      />
    </div>
  );
};
