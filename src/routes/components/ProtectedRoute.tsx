import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { type FC } from 'react';
import { localStorageService } from 'utils/LocalStorageService';
import { AppRoutes } from '../config';

export const ProtectedRoute: FC = () => {
  const location = useLocation();
  const accessToken = localStorageService.getAccessToken();

  if (!accessToken) {
    return <Navigate to={AppRoutes.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
