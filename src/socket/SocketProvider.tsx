import { useEffect, useState, type ReactNode } from 'react';
import { io } from 'socket.io-client';
import { ServerToClientEvent, type AppSocket } from './types';
import { SocketContext } from './SocketContext';
import { localStorageService } from 'utils/LocalStorageService';
import type { Nullable } from 'types/utils';
import { useGetUser } from 'hooks';
import { handleApiError } from 'api';
import { useOnlinePresenceSubscription } from './hooks';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isSuccess: isAuthenticated } = useGetUser();

  const [socket, setSocket] = useState<Nullable<AppSocket>>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorageService.getAccessToken();
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    setSocket(newSocket);

    newSocket.on(ServerToClientEvent.APP_ERROR, (error) => {
      handleApiError(error);
    });

    return () => {
      newSocket?.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated]);

  useOnlinePresenceSubscription(socket);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
