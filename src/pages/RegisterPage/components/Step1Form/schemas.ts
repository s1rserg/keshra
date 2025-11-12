import { z } from 'zod';
import { SignInLocalSchema } from 'api';

export const SignUpFormSchema = SignInLocalSchema.extend({
  confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordsDontMatch',
  path: ['confirmPassword'],
});
