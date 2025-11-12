import { Navigate, Outlet } from 'react-router-dom';
import { type FC } from 'react';
import { localStorageService } from 'utils/LocalStorageService';
import { AppRoutes } from '../config';

export const PublicRoute: FC = () => {
  const accessToken = localStorageService.getAccessToken();

  if (accessToken) {
    return <Navigate to={AppRoutes.CHATS} replace />;
  }

  return <Outlet />;
};
