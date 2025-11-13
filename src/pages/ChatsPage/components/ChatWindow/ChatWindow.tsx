import { type FC } from 'react';
import { type ChatDetailsResponse, type User } from 'api';
import { Loader } from 'components/Loader';
import { useCreateMessage, useChatMessages, useJoinChat } from './hooks';
import { ChatInput, JoinChatBar } from './components';

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
  } = useChatMessages(chatId);

  const { mutate: createMessage } = useCreateMessage();

  const { mutate: joinChat, isPending: isJoining } = useJoinChat();

  const handleSendMessage = (content: string) => {
    createMessage({ chatId, content });
  };

  if (isLoadingDetails) return <Loader />;

  return (
    <div className="flex flex-col h-full">
      <span className="px-4 py-3.5 border-b border-gray-200 font-bold">{title}</span>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ scrollBehavior: 'auto' }}
      >
        {hasPreviousPage && (
          <div ref={topTriggerRef} className="flex justify-center py-2">
            {isFetchingPreviousPage && <Loader />}
          </div>
        )}

        {isLoadingMessages && !messages.length ? (
          <Loader />
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-bold">{msg.author?.username ?? 'User'}: </span>
              <span>{msg.content}</span>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>
      {isMember ? (
        <ChatInput onSubmit={handleSendMessage} />
      ) : (
        <JoinChatBar onJoin={() => joinChat(chatId)} isLoading={isJoining} />
      )}
    </div>
  );
};
