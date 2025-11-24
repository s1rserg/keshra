import { type FC, useState } from 'react';
import { type ChatDetailsResponse, type User } from 'api';
import { Loader } from 'components/Loader';
import { useChatMessages, useChatWindowLogic } from './hooks';
import {
  ChatInput,
  JoinChatBar,
  ChatAvatarModal,
  ChatHeader,
  ChatMessagesView,
  ChatParticipantsView,
} from './components';
import { useModal } from 'hooks';
import type { Nullable, ValueOf } from 'types/utils';
import { useTranslation } from 'react-i18next';
import { ViewMode } from './types';

interface Props {
  chatDetails?: Nullable<ChatDetailsResponse>;
  recipientUser: Nullable<User>;
  isLoading: boolean;
  currentUser: User;
  onChatCreated?: (chatId: number) => void;
  onSelectUser: (user: User) => void;
}

export const ChatWindow: FC<Props> = ({
  chatDetails,
  recipientUser,
  isLoading: isLoadingDetails,
  currentUser,
  onChatCreated,
  onSelectUser,
}) => {
  const { t } = useTranslation('chatsPage');
  const { isOpen: isAvatarModalOpen, open: openAvatarModal, close: closeAvatarModal } = useModal();

  const [viewMode, setViewMode] = useState<ValueOf<typeof ViewMode>>(ViewMode.MESSAGES);

  const activeChatId = chatDetails?.id || null;

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
  } = useChatMessages(!chatDetails && !!recipientUser ? null : activeChatId);

  const { isDraft, chatId, displayData, handleSendMessage, joinChat, isJoining } =
    useChatWindowLogic({
      chatDetails,
      recipientUser,
      currentUser,
      onChatCreated,
      scrollToBottom: () => {
        setViewMode(ViewMode.MESSAGES);
        scrollToBottom('smooth');
      },
    });

  const handleToggleView = () => {
    setViewMode((prev) => (prev === ViewMode.MESSAGES ? ViewMode.PARTICIPANTS : ViewMode.MESSAGES));
  };

  if (isLoadingDetails) return <Loader />;

  if (!displayData) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        {t('noChatSelected')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        title={displayData.title}
        avatar={displayData.avatar}
        isDraft={isDraft}
        chatType={chatDetails?.type}
        partnerUserId={displayData.partnerUserId || null}
        currentView={viewMode}
        onToggleView={handleToggleView}
        onAvatarClick={openAvatarModal}
      />

      {viewMode === ViewMode.PARTICIPANTS && chatDetails ? (
        <ChatParticipantsView
          participants={chatDetails.participants}
          currentUserId={currentUser.id}
          onSelectUser={onSelectUser}
        />
      ) : (
        <ChatMessagesView
          messages={messages}
          currentUserId={currentUser.id}
          chatId={chatId}
          isLoading={isLoadingMessages}
          isDraft={isDraft}
          hasPreviousPage={hasPreviousPage}
          isFetchingPreviousPage={isFetchingPreviousPage}
          showScrollDownButton={showScrollDownButton}
          onScrollToBottom={() => scrollToBottom('smooth')}
          scrollRef={scrollContainerRef}
          topTriggerRef={topTriggerRef}
          bottomRef={messagesEndRef}
          onSelectUser={onSelectUser}
        />
      )}

      {viewMode === ViewMode.MESSAGES && (
        <>
          {displayData.isMember ? (
            <ChatInput onSubmit={handleSendMessage} />
          ) : (
            <JoinChatBar onJoin={() => joinChat(chatId)} isLoading={isJoining} />
          )}
        </>
      )}

      {!isDraft && (
        <ChatAvatarModal
          isOpen={isAvatarModalOpen}
          onClose={closeAvatarModal}
          chatId={chatId}
          currentMainAvatarId={displayData.avatar?.id ?? null}
          isMember={displayData.isMember}
        />
      )}
    </div>
  );
};
