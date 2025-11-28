import { useCallback, useMemo, useState } from 'react';
import {
  ChatType,
  type ChatDetailsResponse,
  type MessageWithAuthorResponseDto,
  type User,
} from 'api';
import type { Nullable } from 'types/utils';
import { useCreatePrivateChat } from '../../../../hooks';
import { useJoinChat, useCreateMessage, useUpdateMessage, useDeleteMessage } from './hooks';

interface UseChatWindowLogicProps {
  chatDetails?: Nullable<ChatDetailsResponse>;
  recipientUser: Nullable<User>;
  currentUser: User;
  onChatCreated?: (chatId: number) => void;
}

export const useChatWindowLogic = ({
  chatDetails,
  recipientUser,
  currentUser,
  onChatCreated,
}: UseChatWindowLogicProps) => {
  const { mutateAsync: createMessage, isPending: isCreating } = useCreateMessage();
  const { mutateAsync: createPrivateChat } = useCreatePrivateChat();
  const { mutate: joinChat, isPending: isJoining } = useJoinChat();
  const { mutateAsync: updateMessage, isPending: isUpdating } = useUpdateMessage();
  const { mutateAsync: deleteMessage, isPending: isDeleting } = useDeleteMessage();

  const [editingMessage, setEditingMessage] =
    useState<Nullable<MessageWithAuthorResponseDto>>(null);
  const [replyingMessage, setReplyingMessage] =
    useState<Nullable<MessageWithAuthorResponseDto>>(null);
  const [messageToDeleteId, setMessageToDeleteId] = useState<Nullable<number>>(null);

  const isDraft = !chatDetails && !!recipientUser;
  const chatId = chatDetails?.id ?? -1;

  const displayData = useMemo(() => {
    if (chatDetails) {
      return {
        title: chatDetails.title,
        avatar: chatDetails.avatar,
        isMember: chatDetails.participants.some((p) => p.user.id === currentUser.id),
        partnerUserId:
          chatDetails?.type === ChatType.DIRECT_MESSAGES
            ? chatDetails.participants.find((p) => p.user.id !== currentUser.id)?.user.id
            : null,
      };
    }
    if (recipientUser) {
      return {
        title: recipientUser.username,
        avatar: recipientUser.avatar,
        isMember: true,
      };
    }
    return null;
  }, [chatDetails, recipientUser, currentUser.id]);

  const handleSendMessage = async (content: string, replyToId?: number) => {
    try {
      let targetChatId = chatId;

      if (isDraft && recipientUser) {
        const { data: newChat } = await createPrivateChat({ receiverId: recipientUser.id });
        targetChatId = newChat.id;
        if (onChatCreated) onChatCreated(newChat.id);
      }

      await createMessage({ chatId: targetChatId, content, replyToId });
      setReplyingMessage(null);
    } catch (_error) {
      /* empty */
    }
  };

  const handleReplyMessage = useCallback((msg: MessageWithAuthorResponseDto) => {
    setReplyingMessage(msg);
    setEditingMessage((prev) => (prev ? null : prev));
  }, []);

  const handleEditMessage = async (messageId: number, content: string) => {
    if (!chatDetails) return;
    try {
      await updateMessage({ id: messageId, chatId: chatDetails.id, data: { content } });
      setEditingMessage(null);
    } catch (_e) {
      /* empty */
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDeleteId || !chatDetails) return;
    try {
      await deleteMessage({ id: messageToDeleteId, chatId: chatDetails.id });
      setMessageToDeleteId(null);
    } catch (_e) {
      /* empty */
    }
  };

  const onSetEditingMessage = useCallback((msg: MessageWithAuthorResponseDto) => {
    setEditingMessage(msg);
  }, []);

  const onCancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const onCancelReply = useCallback(() => {
    setReplyingMessage(null);
  }, []);

  const onSetMessageToDelete = useCallback((id: number) => {
    setMessageToDeleteId(id);
  }, []);

  const onCancelDelete = useCallback(() => {
    setMessageToDeleteId(null);
  }, []);

  return {
    isDraft,
    chatId,
    displayData,
    isJoining,
    joinChat,

    isSending: isCreating || isUpdating,
    handleSendMessage,

    editingMessage,
    onSetEditingMessage,
    onCancelEdit,
    handleEditMessage,

    messageToDeleteId,
    isDeleting,
    onSetMessageToDelete,
    onCancelDelete,
    handleDeleteMessage,

    replyingMessage,
    onCancelReply,
    handleReplyMessage,
  };
};
