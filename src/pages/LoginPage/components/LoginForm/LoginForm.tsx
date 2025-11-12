import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInLocalSchema, type SignInLocalDto } from 'api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from 'routes';
import { FormDefaultValues } from './config';
import { FormInput } from 'components/FormInput';
import { PasswordInput } from 'components/PasswordInput';
import { Button } from 'components/ui';
import { Loader } from 'components/Loader';

interface Props {
  onSubmit: (authData: SignInLocalDto) => Promise<boolean>;
  isLoading: boolean;
}

export const LoginForm: FC<Props> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation('loginPage');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<SignInLocalDto>({
    resolver: zodResolver(SignInLocalSchema),
    defaultValues: FormDefaultValues,
    reValidateMode: 'onSubmit',
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    if (await onSubmit(data)) {
      reset();
    }
  });

  return (
    <form onSubmit={(e) => void handleFormSubmit(e)} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>

      <Link to={AppRoutes.REGISTER} className="text-primary text-sm hover:underline">
        {t('link')}
      </Link>

      <FormInput
        control={control}
        clearErrors={clearErrors}
        name="email"
        label={t('labels.email')}
        placeholder="you@example.com"
        errorMsg={t(errors.email?.message || '')}
      />

      <PasswordInput
        control={control}
        clearErrors={clearErrors}
        name="password"
        label={t('labels.password')}
        errorMsg={t(errors.password?.message || '')}
      />

      <Button type="submit" disabled={isLoading} className="w-full mt-2 py-5 text-base">
        {isLoading ? <Loader /> : t('buttons.continue')}
      </Button>
    </form>
  );
};
