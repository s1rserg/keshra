import { useEffect, useMemo, type FC } from 'react';
import { UpdateUserSchema, type UpdateUserDto, type User } from 'api';
import { useTranslation } from 'react-i18next';
import { CommonModal } from 'components/CommonModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { FormInput } from 'components/FormInput';
import { Button } from 'components/ui';
import { cn } from 'lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserDto) => Promise<boolean>;
  user: User;
  isLoading: boolean;
}
export const UpdateProfileModal: FC<Props> = ({ isOpen, onClose, onSubmit, isLoading, user }) => {
  const { t } = useTranslation('profilePage');

  const initialData = useMemo<Partial<UpdateUserDto>>(
    () => ({
      name: user.name ?? '',
      surname: user.surname ?? '',
      username: user.username ?? '',
    }),
    [user],
  );

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(UpdateUserSchema) as Resolver<UpdateUserDto>,
    defaultValues: initialData,
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const handleFormSubmit = handleSubmit(async (data: UpdateUserDto) => {
    if (await onSubmit(data)) {
      reset();
    }
  });

  return (
    <CommonModal isOpen={isOpen} onOpenChange={onClose} title={t('updateModal.title')} size="md">
      <div>
        <form onSubmit={(e) => void handleFormSubmit(e)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <FormInput
              control={control}
              clearErrors={clearErrors}
              name="username"
              label={t('updateModal.labels.username')}
              errorMsg={t(errors['username']?.message || '')}
            />

            <FormInput
              control={control}
              clearErrors={clearErrors}
              name="name"
              label={t('updateModal.labels.name')}
              autoComplete="given-name"
              errorMsg={t(errors['name']?.message || '')}
            />

            <FormInput
              control={control}
              clearErrors={clearErrors}
              name="surname"
              label={t('updateModal.labels.surname')}
              autoComplete="family-name"
              errorMsg={t(errors['surname']?.message || '')}
            />

            <div className="flex gap-2 pt-2 justify-between">
              <Button
                type="button"
                variant="outline"
                className={cn('py-3')}
                disabled={isLoading}
                onClick={onClose}
              >
                {t('updateModal.buttons.cancel')}
              </Button>
              <Button type="submit" className={cn('py-3')} disabled={isLoading || !isDirty}>
                {t('updateModal.buttons.save')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </CommonModal>
  );
};
