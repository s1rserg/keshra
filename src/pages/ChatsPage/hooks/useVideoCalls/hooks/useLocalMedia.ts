import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { Nullable } from 'types/utils';

export const useLocalMedia = () => {
  const { t } = useTranslation('chatsPage');
  const [localStream, setLocalStream] = useState<Nullable<MediaStream>>(null);
  const localStreamRef = useRef<Nullable<MediaStream>>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (_error) {
      toast.error(t('initLocalStreamError'));
      return null;
    }
  }, [t]);

  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
  }, []);

  return {
    localStream,
    localStreamRef,
    localVideoRef,
    initLocalStream,
    stopLocalStream,
  };
};
