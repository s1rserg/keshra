import type { FC } from 'react';
import type { User } from 'api';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'components/ui';

export interface Props {
  user: User;
  openUpdateModal: () => void;
}

export const UserData: FC<Props> = ({ user, openUpdateModal }) => {
  const { t } = useTranslation('profilePage');

  return (
    <Card className="w-[400px] p-4">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          <strong>{t('labels.username')}: </strong> {user.username}
        </p>
        <p>
          <strong>{t('labels.name')}: </strong> {user.name ?? '-'}
        </p>
        <p>
          <strong>{t('labels.surname')}: </strong> {user.surname ?? '-'}
        </p>
        <p>
          <strong>{t('labels.joined')}: </strong>
          {new Date(user.createdAt).toISOString().split('T')[0]}
        </p>
        <Button className="mt-2" onClick={openUpdateModal}>
          {t('buttons.edit')}
        </Button>
      </CardContent>
    </Card>
  );
};
