import { z } from 'zod';

export const SignInLocalSchema = z.strictObject({
  email: z.email('validation.email').max(50, 'validation.emailMax'),
  password: z.string().min(6, 'validation.passwordMin').max(50, 'validation.passwordMax'),
});

export const SignUpLocalSchema = z.strictObject({
  email: z.email('validation.email').max(50, 'validation.emailMax'),
  password: z.string().min(6, 'validation.passwordMin').max(50, 'validation.passwordMax'),
  username: z.string().min(2, 'validation.usernameMin').max(20, 'validation.usernameMax'),
});
