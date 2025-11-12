import { z } from 'zod';
import { SignUpLocalSchema } from 'api';

export const SignUpFormSchema = SignUpLocalSchema.extend({
  confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordsDontMatch',
  path: ['confirmPassword'],
});
