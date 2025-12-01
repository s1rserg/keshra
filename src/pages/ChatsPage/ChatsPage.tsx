import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'components/ui';
import {
  useChatListSocketSubscription,
  useCreatePublicChat,
  useGetChatDetails,
  useGetChats,
  useGetOnlineUsers,
  useVideoCalls,
} from './hooks';
import { ChatSidebar, ChatWindow, VideoCallModal } from './components';
import { ChatType, type CreatePublicChatDto, type User } from 'api';
import type { Nullable } from 'types/utils';
import { useGetUser } from 'hooks';
import { ClientToServerEvent, useSocket } from 'socket';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';

export const ChatsPage: FC = () => {
  const { t } = useTranslation('chatsPage');

  const { data: user } = useGetUser();
  const { data: chats, isLoading: isLoadingChats, isSuccess } = useGetChats();
  const { mutateAsync: createPublicChat, isPending: isCreatingChat } = useCreatePublicChat();

  useGetOnlineUsers({ enabled: isSuccess });

  const socket = useSocket();

  const webRTC = useVideoCalls(user?.id);
  const { isCallActive, isReceivingCall, localStream, activePartnerId } = webRTC;
  const isVideoModalOpen = isCallActive || isReceivingCall || !!localStream;

  const [selectedChatId, setSelectedChatId] = useState<Nullable<number>>(null);
  const [previousChatId, setPreviousChatId] = useState<Nullable<number>>(null);
  const [selectedUser, setSelectedUser] = useState<Nullable<User>>(null);

  useChatListSocketSubscription(chats, selectedChatId);
  const { data: chatDetails, isLoading: isLoadingChatDetails } = useGetChatDetails(selectedChatId);

  const handleSelectChat = (id: number) => {
    setSelectedUser(null);
    setSelectedChatId(id);
  };

  const remoteUserName = useMemo(() => {
    if (!activePartnerId || !chats) return t('videoCall.unknownUser');
    const chat = chats.find((c) => {
      if ('partnerUserId' in c) return c.partnerUserId === activePartnerId;
      return false;
    });

    return chat ? chat.title : t('videoCall.unknownUser');
  }, [activePartnerId, chats, t]);

  const handleSelectUser = useCallback(
    (user: User) => {
      const privateChat = chats?.find(
        (chat) => chat.title === user.username && chat.type === ChatType.DIRECT_MESSAGES,
      );

      if (privateChat) {
        setSelectedChatId(privateChat.id);
        return;
      }

      setSelectedChatId(null);
      setSelectedUser(user);
    },
    [chats],
  );

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

  const handleStartVideoCall = (receiverId: number) => {
    if (selectedChatId) {
      void webRTC.startCall(receiverId);
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
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} maxSize={35} className="h-full">
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
              onVideoCallStart={handleStartVideoCall}
              isCallActive={isCallActive}
            />
          )}

          {!selectedChatId && !selectedUser && (
            <div className="h-full flex items-center justify-center text-gray-400">
              {t('noChatSelected')}
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
      <VideoCallModal
        isOpen={isVideoModalOpen}
        onClose={webRTC.endCall}
        webRTC={webRTC}
        remoteUserName={remoteUserName}
      />
    </>
  );
};
