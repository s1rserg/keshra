import { createContext } from 'react';
import type { Nullable } from 'types/utils';
import type { AppSocket } from './types';

export const SocketContext = createContext<Nullable<AppSocket>>(null);
