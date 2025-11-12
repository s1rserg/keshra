import { useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreatePublicChatDto, CreatePublicChatSchema } from 'api';
import { FormInput } from 'components/FormInput';
import { CommonModal } from 'components/CommonModal';
import { Button } from 'components/ui';
import { Loader } from 'components/Loader';
import { CreatePublicChatDefaultValues } from './config';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: CreatePublicChatDto) => Promise<boolean>;
  isLoading?: boolean;
}

export const CreatePublicChatModal: FC<Props> = ({
  open,
  handleClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation('chatsPage');

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CreatePublicChatDto>({
    resolver: zodResolver(CreatePublicChatSchema),
    defaultValues: CreatePublicChatDefaultValues,
  });

  const onFormSubmit = handleSubmit(async (data) => {
    const success = await onSubmit(data);
    if (success) {
      handleClose();
    }
  });

  useEffect(() => {
    if (open) {
      reset();
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  return (
    <CommonModal isOpen={open} onOpenChange={handleClose} title={t('createPublic.title')} size="md">
      <form onSubmit={(e) => void onFormSubmit(e)} className="space-y-4">
        <FormInput
          name="title"
          label={t('createPublic.labels.title')}
          placeholder={t('createPublic.placeholders.title')}
          control={control}
          clearErrors={clearErrors}
          errorMsg={t(errors.title?.message || '')}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" type="button" onClick={handleClose} disabled={isLoading}>
            {t('createPublic.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : t('createPublic.buttons.create')}
          </Button>
        </div>
      </form>
    </CommonModal>
  );
};
