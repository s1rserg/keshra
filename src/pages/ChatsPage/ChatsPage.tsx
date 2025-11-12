import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { AppRoutes } from 'routes';

export const ChatsPage: FC = () => {
  return (
    <div>
      <Link to={AppRoutes.REGISTER} className="text-primary text-sm hover:underline">
        Test Register
      </Link>
    </div>
  );
};
