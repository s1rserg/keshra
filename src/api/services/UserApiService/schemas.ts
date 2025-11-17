import { z } from 'zod';

export const UpdateUserSchema = z
  .strictObject({
    name: z.string().min(2, 'validation.nameMin').optional(),
    surname: z.string().min(2, 'validation.surnameMin').optional(),
    username: z
      .string()
      .min(2, 'validation.usernameMin')
      .max(20, 'validation.usernameMax')
      .optional(),
  })
  .partial();
