import { type FC } from 'react';
import { Separator } from 'components/ui';
import { Logo, LanguageSwitch, ThemeSwitch, UserPopover } from './components';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from 'routes';

export const Header: FC = () => {
  const location = useLocation();
  return (
    <header className="border-b">
      <div className="flex justify-between items-center p-4">
        <Logo />

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <LanguageSwitch />
          {location.pathname !== AppRoutes.LOGIN && location.pathname !== AppRoutes.REGISTER && (
            <UserPopover />
          )}
        </div>
      </div>

      <Separator />
    </header>
  );
};
