import { useEffect, type FC } from 'react';
import { Header } from 'components/Header';
import { Outlet } from 'react-router-dom';
import { useGetUser } from 'hooks';
import { notificationService } from 'utils/NotificationService';
import { audioService } from 'utils/AudioService';

export const MainLayout: FC = () => {
  useGetUser();

  audioService.register('message', '/sounds/alert.mp3');

  useEffect(() => {
    if (notificationService.permission === 'default') {
      void notificationService.requestPermission();
    }
  }, []);

  return (
    <>
      <Header />
      <main className="px-4 h-[calc(100dvh-73px)]">
        <Outlet />
      </main>
    </>
  );
};
