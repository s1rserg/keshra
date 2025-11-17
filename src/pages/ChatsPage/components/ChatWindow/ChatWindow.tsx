import { type FC } from 'react';
import { type ChatDetailsResponse, type User } from 'api';
import { Loader } from 'components/Loader';
import { useCreateMessage, useChatMessages, useJoinChat } from './hooks';
import { ChatInput, JoinChatBar, MessageList, ScrollDownButton } from './components';
import { Loader2 } from 'lucide-react';

interface Props {
  chatDetails: ChatDetailsResponse;
  isLoading: boolean;
  user: User;
}

export const ChatWindow: FC<Props> = ({ chatDetails, isLoading: isLoadingDetails, user }) => {
  const { id: chatId, title, participants } = chatDetails;

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
      <span className="px-4 py-3.5 border-b border-gray-200 font-bold">{title}</span>
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
    </div>
  );
};
