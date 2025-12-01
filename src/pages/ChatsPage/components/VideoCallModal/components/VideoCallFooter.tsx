import { IconButton } from 'components/IconButton';
import { Phone, PhoneOff } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isReceivingCall: boolean;
  handleEndCall: () => void;
  answerCall: () => void;
}

export const VideoCallFooter: FC<Props> = ({ isReceivingCall, handleEndCall, answerCall }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <div className="flex justify-center gap-6 w-full mt-2">
      {isReceivingCall ? (
        <>
          <IconButton
            label={t('videoCall.buttons.reject')}
            icon={<PhoneOff className="h-6 w-6" />}
            variant="destructive"
            onClick={handleEndCall}
          />
          <IconButton
            label={t('videoCall.buttons.answer')}
            icon={<Phone className="h-6 w-6" />}
            variant="default"
            onClick={() => void answerCall()}
          />
        </>
      ) : (
        <IconButton
          label={t('videoCall.buttons.end')}
          icon={<PhoneOff className="h-6 w-6" />}
          variant="destructive"
          onClick={handleEndCall}
        />
      )}
    </div>
  );
};
