import { type FC } from 'react';
import { Loader } from 'components/Loader';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui';

interface Props {
  onJoin: () => void;
  isLoading: boolean;
}

export const JoinChatBar: FC<Props> = ({ onJoin, isLoading }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <div className="flex items-center justify-center p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800">
      {isLoading ? (
        <Loader />
      ) : (
        <Button onClick={onJoin} className="w-full cursor-pointer">
          {t('buttons.joinChat')}
        </Button>
      )}
    </div>
  );
};
