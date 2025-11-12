import { type FC } from 'react';
import { Header } from 'components/Header';
import { Outlet } from 'react-router-dom';
import { useGetUser } from 'hooks';

export const MainLayout: FC = () => {
  useGetUser();

  return (
    <>
      <Header />
      <main className="px-4">
        <Outlet />
      </main>
    </>
  );
};
