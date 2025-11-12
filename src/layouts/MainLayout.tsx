import { type FC } from 'react';
import { Header } from 'components/Header';
import { Outlet } from 'react-router-dom';

export const MainLayout: FC = () => {
  return (
    <>
      <Header />
      <main className="px-4">
        <Outlet />
      </main>
    </>
  );
};
