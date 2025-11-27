import { AppRoutes } from './config';
import { AuthLayout, MainLayout } from 'layouts';
import { RegisterPage } from 'pages/RegisterPage/RegisterPage';
import { createHashRouter, type RouteObject } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/LoginPage';
import { ProtectedRoute, PublicRoute } from './components';
import { ChatsPage } from 'pages/ChatsPage/ChatsPage';
import { SocketProvider } from 'socket';
import { ProfilePage } from 'pages/ProfilePage/ProfilePage';

const APP_ROUTES: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <SocketProvider>
            <MainLayout />
          </SocketProvider>
        ),
        children: [
          {
            path: AppRoutes.CHATS,
            element: <ChatsPage />,
          },
          {
            path: AppRoutes.PROFILE,
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: AppRoutes.REGISTER,
            element: <RegisterPage />,
          },
          {
            path: AppRoutes.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
];

export const appRouter = createHashRouter(APP_ROUTES);
