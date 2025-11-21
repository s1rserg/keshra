import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'api';
import { useEffect } from 'react';
import { ServerToClientEvent, type AppSocket } from '../types';
import type { Nullable } from 'types/utils';

export const useOnlinePresenceSubscription = (socket: Nullable<AppSocket>) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleFriendOnline = (userId: number) => {
      queryClient.setQueryData<number[]>(QueryKeys.onlineUsers, (oldData) => {
        const currentList = oldData || [];
        if (currentList.includes(userId)) return currentList;
        return [...currentList, userId];
      });
    };

    const handleFriendOffline = (userId: number) => {
      queryClient.setQueryData<number[]>(QueryKeys.onlineUsers, (oldData) => {
        const currentList = oldData || [];
        return currentList.filter((id) => id !== userId);
      });
    };

    const handleReconnect = () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.onlineUsers });
    };

    socket.on(ServerToClientEvent.CHAT_PRESENCE_USER_ONLINE, handleFriendOnline);
    socket.on(ServerToClientEvent.CHAT_PRESENCE_USER_OFFLINE, handleFriendOffline);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off(ServerToClientEvent.CHAT_PRESENCE_USER_ONLINE, handleFriendOnline);
      socket.off(ServerToClientEvent.CHAT_PRESENCE_USER_OFFLINE, handleFriendOffline);
      socket.off('connect', handleReconnect);
    };
  }, [socket, queryClient]);
};
