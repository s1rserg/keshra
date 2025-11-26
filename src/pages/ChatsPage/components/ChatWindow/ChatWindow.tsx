import { type FC, useCallback, useState } from 'react';
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
  DeleteMessageModal,
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
    bottomRef,
    fetchPreviousPage,
  } = useChatMessages(!chatDetails && !!recipientUser ? null : activeChatId);

  const {
    isDraft,
    chatId,
    displayData,
    isJoining,
    joinChat,
    handleSendMessage,
    editingMessage,
    onSetEditingMessage,
    onCancelEdit,
    handleEditMessage,
    messageToDeleteId,
    isDeleting,
    onSetMessageToDelete,
    handleDeleteMessage,
    onCancelDelete,
    replyingMessage,
    onCancelReply,
    handleReplyMessage,
  } = useChatWindowLogic({
    chatDetails,
    recipientUser,
    currentUser,
    onChatCreated,
  });

  const handleToggleView = () => {
    setViewMode((prev) => (prev === ViewMode.MESSAGES ? ViewMode.PARTICIPANTS : ViewMode.MESSAGES));
  };

  const onFetchPreviousPageStable = useCallback(() => {
    void fetchPreviousPage();
  }, [fetchPreviousPage]);

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
          bottomRef={bottomRef}
          onSelectUser={onSelectUser}
          onEditMessage={onSetEditingMessage}
          onDeleteMessage={onSetMessageToDelete}
          onReplyMessage={handleReplyMessage}
          onFetchPreviousPage={onFetchPreviousPageStable}
        />
      )}

      {viewMode === ViewMode.MESSAGES && (
        <>
          {displayData.isMember ? (
            <ChatInput
              onSendMessage={handleSendMessage}
              onEditMessage={handleEditMessage}
              editingMessage={editingMessage}
              onCancelEdit={onCancelEdit}
              replyingMessage={replyingMessage}
              onCancelReply={onCancelReply}
            />
          ) : (
            <JoinChatBar onJoin={() => joinChat(chatId)} isLoading={isJoining} />
          )}
        </>
      )}

      <DeleteMessageModal
        isOpen={!!messageToDeleteId}
        onClose={onCancelDelete}
        onConfirm={() => void handleDeleteMessage()}
        isLoading={isDeleting}
      />

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
