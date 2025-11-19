import { useMemo } from 'react';
import type { ChatDetailsResponse, User } from 'api';
import type { Nullable } from 'types/utils';
import { useCreateMessage, useJoinChat } from '../../hooks';
import { useCreatePrivateChat } from '../../../../hooks';

interface UseChatWindowLogicProps {
  chatDetails?: Nullable<ChatDetailsResponse>;
  recipientUser: Nullable<User>;
  currentUser: User;
  onChatCreated?: (chatId: number) => void;
  scrollToBottom: () => void;
}

export const useChatWindowLogic = ({
  chatDetails,
  recipientUser,
  currentUser,
  onChatCreated,
  scrollToBottom,
}: UseChatWindowLogicProps) => {
  const { mutateAsync: createMessage } = useCreateMessage();
  const { mutateAsync: createPrivateChat } = useCreatePrivateChat();
  const { mutate: joinChat, isPending: isJoining } = useJoinChat();

  const isDraft = !chatDetails && !!recipientUser;
  const chatId = chatDetails?.id ?? -1;

  const displayData = useMemo(() => {
    if (chatDetails) {
      return {
        title: chatDetails.title,
        avatar: chatDetails.avatar,
        isMember: chatDetails.participants.some((p) => p.user.id === currentUser.id),
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

  const handleSendMessage = async (content: string) => {
    try {
      let targetChatId = chatId;

      if (isDraft && recipientUser) {
        const { data: newChat } = await createPrivateChat({ receiverId: recipientUser.id });
        targetChatId = newChat.id;
        if (onChatCreated) onChatCreated(newChat.id);
      }

      await createMessage({ chatId: targetChatId, content });
      scrollToBottom();
    } catch (_error) {
      /* empty */
    }
  };

  return {
    isDraft,
    chatId,
    displayData,
    handleSendMessage,
    joinChat,
    isJoining,
  };
};
