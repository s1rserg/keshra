import { type FC } from 'react';
import { Separator } from 'components/ui';
import { Logo, LanguageSwitch, ThemeSwitch, UserPopover } from './components';

export const Header: FC = () => {
  return (
    <header className="border-b">
      <div className="flex justify-between items-center p-4">
        <Logo />

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <LanguageSwitch />
          <UserPopover />
        </div>
      </div>

      <Separator />
    </header>
  );
};
