import { type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginForm } from './components/LoginForm';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from 'routes';
import { useSignInMutation } from './hooks';
import { localStorageService } from 'utils/LocalStorageService';
import type { SignInLocalDto } from 'api';
import type { Nullable } from 'types/utils';
import type { LocationState } from './types';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('loginPage');

  const signInMutation = useSignInMutation();

  const state = location.state as Nullable<LocationState>;

  const handleLoginSubmit = async (data: SignInLocalDto): Promise<boolean> => {
    try {
      const response = await signInMutation.mutateAsync(data);
      localStorageService.setAccessToken(response.data.accessToken);
      void navigate(state?.from?.pathname || AppRoutes.CHATS, { replace: true });
      return true;
    } catch {
      toast.error(t('errors.invalidCredentials'));
      return false;
    }
  };

  return <LoginForm onSubmit={handleLoginSubmit} isLoading={signInMutation.isPending} />;
};
