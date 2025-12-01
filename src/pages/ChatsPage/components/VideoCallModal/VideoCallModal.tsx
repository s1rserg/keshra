import { useEffect, useRef } from 'react';
import { CommonModal } from 'components/CommonModal';
import { useVideoCalls } from '../../hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { VideoCallFooter } from './components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  webRTC: ReturnType<typeof useVideoCalls>;
  remoteUserName: string;
}

export const VideoCallModal = ({ isOpen, onClose, webRTC, remoteUserName }: Props) => {
  const { t } = useTranslation('chatsPage');
  const { endCall, answerCall, isReceivingCall, isCallActive, localStream, remoteStream } = webRTC;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const modalTitle = isReceivingCall
    ? t('videoCall.incomingTitle', { name: remoteUserName })
    : t('videoCall.activeTitle', { name: remoteUserName });

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleEndCall();
    }
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.onloadedmetadata = async () => {
        try {
          remoteVideoRef.current!.muted = false;
          await remoteVideoRef.current!.play();
        } catch (_e) {
          toast.error(t('videoCall.playError'));
        }
      };
    }
  }, [remoteStream, t]);

  return (
    <CommonModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={modalTitle}
      size="4xl"
      footer={
        <VideoCallFooter
          isReceivingCall={isReceivingCall}
          handleEndCall={handleEndCall}
          answerCall={() => void answerCall()}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {t('videoCall.you')}
            </span>
          </div>

          <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
            {isCallActive && !remoteStream ? (
              <div className="text-gray-500 flex flex-col items-center animate-pulse">
                <span>{t('videoCall.connecting')}</span>
              </div>
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {remoteUserName || t('videoCall.remote')}
            </span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
