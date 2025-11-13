import { type FC, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'components/ui';
import { useCreatePublicChat, useGetChatDetails, useGetChats } from './hooks';
import { ChatSidebar, ChatWindow } from './components';
import type { CreatePublicChatDto } from 'api';
import type { Nullable } from 'types/utils';
import { useGetUser } from 'hooks';

export const ChatsPage: FC = () => {
  const { data: user } = useGetUser();
  const { data: chats, isLoading: isLoadingChats } = useGetChats();
  const { mutateAsync: createPublicChat, isPending: isCreatingChat } = useCreatePublicChat();

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
          <ChatWindow chatDetails={chatDetails} isLoading={isLoadingChatDetails} user={user} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
