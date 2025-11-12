import { AppRoutes } from './config';
import { MainLayout } from 'layouts';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ChatsPage } from 'pages/ChatsPage/ChatsPage';

const APP_ROUTES: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: AppRoutes.CHATS,
        element: <ChatsPage />,
      },
    ],
  },
];

export const appRouter = createBrowserRouter(APP_ROUTES);
