import { type FC, useEffect, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'components/ui';
import { useCreatePublicChat, useGetChatDetails, useGetChats } from './hooks';
import { ChatSidebar, ChatWindow } from './components';
import type { CreatePublicChatDto } from 'api';
import type { Nullable } from 'types/utils';
import { useGetUser } from 'hooks';
import { ClientToServerEvent, useSocket } from 'socket';

export const ChatsPage: FC = () => {
  const { data: user } = useGetUser();
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { mutateAsync: createPublicChat, isPending: isCreatingChat } = useCreatePublicChat();

  const socket = useSocket();
  const [previousChatId, setPreviousChatId] = useState<Nullable<number>>(null);

  const [selectedChatId, setSelectedChatId] = useState<Nullable<number>>(null);
  const { data: chatDetails, isLoading: isLoadingChatDetails } = useGetChatDetails(selectedChatId);

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
          onSelectChat={setSelectedChatId}
          isCreatingChat={isCreatingChat}
          onCreatePublicChat={handleCreatePublicChat}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={75} className="h-full">
        {chatDetails && (
          <ChatWindow
            key={chatDetails.id}
            chatDetails={chatDetails}
            isLoading={isLoadingChatDetails}
            user={user}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
