import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from './components';
import { AppRoutes } from 'routes';
import { localStorageService } from 'utils/LocalStorageService';
import { useSignUpMutation } from './hooks';
import type { SignUpLocalDto } from 'api';

export const RegisterPage: FC = () => {
  const { t } = useTranslation('registerPage');
  const navigate = useNavigate();

  const signUpMutation = useSignUpMutation();

  const handleSignUpSubmit = async (data: SignUpLocalDto): Promise<boolean> => {
    try {
      const response = await signUpMutation.mutateAsync(data);
      localStorageService.setAccessToken(response.data.accessToken);
      toast.success(t('successMsg'));
      void navigate(AppRoutes.CHATS);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <RegisterForm onSubmit={handleSignUpSubmit} isLoading={signUpMutation.isPending} />
    </div>
  );
};
