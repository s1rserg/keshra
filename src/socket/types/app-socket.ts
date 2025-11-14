import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents } from './server-to-client-events';
import type { ClientToServerEvents } from './client-to-server-events';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
