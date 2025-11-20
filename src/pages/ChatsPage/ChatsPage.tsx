import { type FC, useEffect, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'components/ui';
import {
  useChatListSocketSubscription,
  useCreatePublicChat,
  useGetChatDetails,
  useGetChats,
} from './hooks';
import { ChatSidebar, ChatWindow } from './components';
import { ChatType, type CreatePublicChatDto, type User } from 'api';
import type { Nullable } from 'types/utils';
import { useGetUser } from 'hooks';
import { ClientToServerEvent, useSocket } from 'socket';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';

export const ChatsPage: FC = () => {
  const { t } = useTranslation('chatsPage');

  const { data: user } = useGetUser();
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { mutateAsync: createPublicChat, isPending: isCreatingChat } = useCreatePublicChat();

  const socket = useSocket();

  useChatListSocketSubscription(chats);

  const [selectedChatId, setSelectedChatId] = useState<Nullable<number>>(null);
  const [previousChatId, setPreviousChatId] = useState<Nullable<number>>(null);
  const [selectedUser, setSelectedUser] = useState<Nullable<User>>(null);

  const { data: chatDetails, isLoading: isLoadingChatDetails } = useGetChatDetails(selectedChatId);

  const handleSelectChat = (id: number) => {
    setSelectedUser(null);
    setSelectedChatId(id);
  };

  const handleSelectUser = (user: User) => {
    const privateChat = chats?.find(
      (chat) => chat.title === user.username && chat.type === ChatType.DIRECT_MESSAGES,
    );

    if (privateChat) {
      setSelectedChatId(privateChat.id);
      return;
    }

    setSelectedChatId(null);
    setSelectedUser(user);
  };

  const handleChatCreated = (newChatId: number) => {
    setSelectedUser(null);
    setSelectedChatId(newChatId);
  };

  const handleCreatePublicChat = async (data: CreatePublicChatDto) => {
    try {
      await createPublicChat(data);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!socket) return;

    if (selectedChatId !== previousChatId && previousChatId) {
      socket.emit(ClientToServerEvent.CHAT_LEAVE, previousChatId);
    }

    if (selectedChatId) {
      socket.emit(ClientToServerEvent.CHAT_JOIN, selectedChatId);
      setPreviousChatId(selectedChatId);
    }

    return () => {
      if (selectedChatId) {
        socket.emit(ClientToServerEvent.CHAT_LEAVE, selectedChatId);
      }
    };
  }, [socket, selectedChatId, previousChatId]);

  if (!user) return null;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={25} minSize={15} maxSize={35} className="h-full">
        <ChatSidebar
          chats={chats}
          isLoading={isLoadingChats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onSelectUser={handleSelectUser}
          isCreatingChat={isCreatingChat}
          onCreatePublicChat={handleCreatePublicChat}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={75} className="h-full">
        {selectedChatId && isLoadingChatDetails && <Loader />}
        {(chatDetails || selectedUser) && (
          <ChatWindow
            key={chatDetails?.id ?? `user-${selectedUser?.id}`}
            chatDetails={chatDetails}
            recipientUser={selectedUser}
            isLoading={!!selectedChatId && isLoadingChatDetails}
            currentUser={user}
            onChatCreated={handleChatCreated}
            onSelectUser={handleSelectUser}
          />
        )}

        {!selectedChatId && !selectedUser && (
          <div className="h-full flex items-center justify-center text-gray-400">
            {t('noChatSelected')}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
