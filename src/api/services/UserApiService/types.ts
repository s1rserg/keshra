import type { Nullable } from 'types/utils';
import type { infer as ZodInfer } from 'zod';
import type { UpdateUserSchema } from './schemas';

export type UpdateUserDto = ZodInfer<typeof UpdateUserSchema>;

export interface UserAvatarMedia {
  id: number;
  createdAt: string;
  width: number;
  height: number;
  secureUrl: string;
}

export interface User {
  id: number;
  email: string;
  name: Nullable<string>;
  surname: Nullable<string>;
  username: string;
  createdAt: Date;
  avatar: Nullable<UserAvatarMedia>;
}

export interface GetAllUsersQueryDto {
  search?: string;
}
