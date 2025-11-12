import { type FC } from 'react';
import { Header } from 'components/Header';
import { Outlet } from 'react-router-dom';

export const AuthLayout: FC = () => {
  return (
    <>
      <Header />
      <main className="flex h-[calc(100dvh-73px)] items-center justify-center px-4">
        <div className="w-full sm:w-[90vw] md:w-[70vw] lg:w-[20vw]">
          <Outlet />
        </div>
      </main>
    </>
  );
};
