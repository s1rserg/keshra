import { z } from 'zod';

export const CreatePublicChatSchema = z.strictObject({
  title: z.string().min(3, 'validation.titleMin'),
});

export const CreatePrivateChatSchema = z.strictObject({
  receiverId: z.number().min(1, 'validation.receiverIdRequired'),
});
