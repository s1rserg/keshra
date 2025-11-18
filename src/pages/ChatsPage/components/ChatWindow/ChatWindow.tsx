import { type FC } from 'react';
import { type ChatDetailsResponse, type User } from 'api';
import { Loader } from 'components/Loader';
import { useCreateMessage, useChatMessages, useJoinChat } from './hooks';
import {
  ChatInput,
  JoinChatBar,
  MessageList,
  ScrollDownButton,
  ChatAvatarModal,
} from './components';
import { Loader2 } from 'lucide-react';
import { useModal } from 'hooks';
import { Avatar, AvatarFallback, AvatarImage, Button } from 'components/ui';

interface Props {
  chatDetails: ChatDetailsResponse;
  isLoading: boolean;
  user: User;
}

export const ChatWindow: FC<Props> = ({ chatDetails, isLoading: isLoadingDetails, user }) => {
  const { id: chatId, title, participants, avatar } = chatDetails;
  const { isOpen: isAvatarModalOpen, open: openAvatarModal, close: closeAvatarModal } = useModal();

  const isMember = participants.some((p) => p.user.id === user.id);

  const {
    messages,
    isLoadingMessages,
    isFetchingPreviousPage,
    hasPreviousPage,
    scrollContainerRef,
    messagesEndRef,
    topTriggerRef,
    showScrollDownButton,
    scrollToBottom,
  } = useChatMessages(chatId);

  const { mutateAsync: createMessage } = useCreateMessage();
  const { mutate: joinChat, isPending: isJoining } = useJoinChat();

  const handleSendMessage = async (content: string) => {
    await createMessage({ chatId, content });
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoadingDetails) return <Loader />;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3.5 border-b border-gray-200 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative" onClick={openAvatarModal}>
          <Avatar className="h-8 w-8">
            {avatar ? (
              <AvatarImage src={avatar.secureUrl} />
            ) : (
              <AvatarFallback>{title[0]}</AvatarFallback>
            )}
          </Avatar>
        </Button>

        <span className="font-bold truncate">{title}</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'auto' }}
      >
        {hasPreviousPage && (
          <div ref={topTriggerRef} className="flex justify-center py-2 shrink-0 h-8 w-full">
            {isFetchingPreviousPage && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        )}

        {isLoadingMessages && !messages.length ? (
          <Loader />
        ) : (
          <MessageList messages={messages} currentUserId={user.id} />
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <ScrollDownButton show={showScrollDownButton} onClick={() => scrollToBottom('smooth')} />

      {isMember ? (
        <ChatInput onSubmit={handleSendMessage} />
      ) : (
        <JoinChatBar onJoin={() => joinChat(chatId)} isLoading={isJoining} />
      )}

      <ChatAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={closeAvatarModal}
        chatId={chatId}
        currentMainAvatarId={avatar?.id ?? null}
        isMember={isMember}
      />
    </div>
  );
};
