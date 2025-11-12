import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from 'routes';
import { useGetUser } from 'hooks';
import { useLogoutMutation } from './hooks';
import {
  Avatar,
  AvatarFallback,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'components/ui';

export const UserPopover: FC = () => {
  const { t } = useTranslation('header');
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUser();
  const { logout, isLoggingOut } = useLogoutMutation();

  const [open, setOpen] = useState(false);

  if (isLoading || !user) return null;

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const handleProfile = () => {
    setOpen(false);
    void navigate(AppRoutes.PROFILE);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-64 p-4">
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{user.username || user.email}</p>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" onClick={handleProfile}>
                  {t('buttons.profile')}
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {t('buttons.logout')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>{t('buttons.profile')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
