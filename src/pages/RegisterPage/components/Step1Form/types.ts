import type { input } from 'zod';
import type { SignUpFormSchema } from './schemas';

export type SignUpFormInput = input<typeof SignUpFormSchema>;
