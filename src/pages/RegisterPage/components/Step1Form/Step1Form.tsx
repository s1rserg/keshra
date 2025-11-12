import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpFormSchema } from './schemas';
import { Step1DefaultValues } from './config';
import type { SignUpFormInput } from './types';
import type { SignUpLocalDto } from 'api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AppRoutes } from 'routes';
import { FormInput } from 'components/FormInput';
import { PasswordInput } from 'components/PasswordInput';
import { Button } from 'components/ui';
import { Loader } from 'components/Loader';

interface Props {
  onSubmit: (authData: SignUpLocalDto) => Promise<boolean>;
  isLoading: boolean;
}

export const Step1Form: FC<Props> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation('registerPage');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: Step1DefaultValues,
    reValidateMode: 'onSubmit',
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const { confirmPassword: _confirmPassword, ...dto } = data;
    if (await onSubmit(dto)) {
      reset();
    }
  });

  return (
    <form onSubmit={(e) => void handleFormSubmit(e)} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('step1.title')}</h1>

      <Link to={AppRoutes.LOGIN} className="text-primary text-sm hover:underline">
        {t('step1.link')}
      </Link>

      <FormInput
        control={control}
        clearErrors={clearErrors}
        name="email"
        label={t('step1.labels.email')}
        placeholder="you@example.com"
        errorMsg={t(errors.email?.message || '')}
      />

      <PasswordInput
        control={control}
        clearErrors={clearErrors}
        name="password"
        label={t('step1.labels.password')}
        errorMsg={t(errors.password?.message || '')}
      />

      <PasswordInput
        control={control}
        clearErrors={clearErrors}
        name="confirmPassword"
        label={t('step1.labels.confirmPassword')}
        errorMsg={t(errors.confirmPassword?.message || '')}
      />

      <Button type="submit" disabled={isLoading} className="w-full mt-2 py-5 text-base">
        {isLoading ? <Loader /> : t('step1.buttons.continue')}
      </Button>
    </form>
  );
};
