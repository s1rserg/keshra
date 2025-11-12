import type { infer as ZodInfer } from 'zod';
import type { SignInLocalSchema, SignUpLocalSchema } from './schemas';

export type SignInLocalDto = ZodInfer<typeof SignInLocalSchema>;

export type SignUpLocalDto = ZodInfer<typeof SignUpLocalSchema>;

export type AuthResponse = {
  accessToken: string;
};
