import type { Nullable } from 'types/utils';

export interface User {
  id: number;
  email: string;
  name: Nullable<string>;
  surname: Nullable<string>;
  username: string;
}
