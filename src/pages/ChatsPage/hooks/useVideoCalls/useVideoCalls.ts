import { useEffect, useRef, useState, useCallback } from 'react';
import {
  useSocket,
  ClientToServerEvent,
  ServerToClientEvent,
  type CallSignalPayload,
} from 'socket';
import { useLocalMedia } from './hooks';
import { ICE_SERVERS } from './config';
import { waitForIceGathering } from './helpers';
import type { Nullable } from 'types/utils';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { audioService } from 'utils/AudioService';

export const useVideoCalls = (currentUserId: number | undefined) => {
  const { t } = useTranslation('chatsPage');
  const socket = useSocket();

  const { localStream, localStreamRef, localVideoRef, initLocalStream, stopLocalStream } =
    useLocalMedia();

  const peerConnection = useRef<Nullable<RTCPeerConnection>>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [activePartnerId, setActivePartnerId] = useState<Nullable<number>>(null);
  const [remoteStream, setRemoteStream] = useState<Nullable<MediaStream>>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);

  const cleanupCall = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    stopLocalStream();

    setRemoteStream(null);
    setIsCallActive(false);
    setIsReceivingCall(false);
    setActivePartnerId(null);
  }, [stopLocalStream]);

  const createPeerConnection = useCallback(() => {
    if (peerConnection.current) return peerConnection.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0] || new MediaStream([event.track]));
    };

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === 'disconnected' ||
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'closed'
      ) {
        cleanupCall();
        toast.info(t('videoCall.callEndedRemote'));
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [cleanupCall, t]);

  const endCall = useCallback(() => {
    if (activePartnerId) {
      socket?.emit(ClientToServerEvent.CALL_HANGUP, activePartnerId);
    }
    cleanupCall();
  }, [activePartnerId, socket, cleanupCall]);

  const startCall = async (partnerId: number) => {
    setIsCallActive(true);
    setActivePartnerId(partnerId);
    createPeerConnection();

    const stream = await initLocalStream();
    if (!stream) {
      cleanupCall();
      return;
    }

    stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));

    try {
      const offer = await peerConnection.current?.createOffer();
      if (!offer) return;
      await peerConnection.current?.setLocalDescription(offer);

      const bundledOffer = await waitForIceGathering(peerConnection.current!);
      if (!bundledOffer) return;

      socket?.emit(ClientToServerEvent.CALL_OFFER, {
        partnerId,
        signal: bundledOffer,
      });
    } catch (_error) {
      toast.error(t('videoCall.startCallError'));
      cleanupCall();
    }
  };

  const answerCall = async () => {
    setIsReceivingCall(false);
    setIsCallActive(true);

    if (!peerConnection.current) return;

    let stream = localStreamRef.current;
    if (!stream) {
      stream = await initLocalStream();
    }
    if (!stream) {
      cleanupCall();
      return;
    }

    try {
      stream.getTracks().forEach((track) => {
        const senders = peerConnection.current?.getSenders();
        const hasTrack = senders?.some((s) => s.track?.kind === track.kind);
        if (!hasTrack) peerConnection.current?.addTrack(track, stream);
      });

      const answer = await peerConnection.current.createAnswer();
      if (!answer) return;
      await peerConnection.current.setLocalDescription(answer);

      const bundledAnswer = await waitForIceGathering(peerConnection.current);
      if (!bundledAnswer) return;

      if (activePartnerId) {
        socket?.emit(ClientToServerEvent.CALL_ANSWER, {
          partnerId: activePartnerId,
          signal: bundledAnswer,
        });
      }
    } catch (_error) {
      toast.error(t('videoCall.answerCallError'));
      cleanupCall();
    }
  };

  useEffect(() => {
    if (isReceivingCall) {
      audioService.play('ringtone', true);
      return;
    }
    audioService.stop('ringtone');

    return () => {
      audioService.stop('ringtone');
    };
  }, [isReceivingCall]);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const onCallMade = async (payload: CallSignalPayload) => {
      const callerId = payload.partnerId;

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      const pc = createPeerConnection();

      setIsReceivingCall(true);
      setActivePartnerId(callerId);

      void initLocalStream();

      const signal = payload.signal as RTCSessionDescriptionInit;

      await pc?.setRemoteDescription(new RTCSessionDescription(signal));
    };

    const onCallAnswered = async (payload: CallSignalPayload) => {
      const signal = payload.signal as RTCSessionDescriptionInit;
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(signal));
    };

    const onCallEnded = () => {
      cleanupCall();
    };

    socket.on(ServerToClientEvent.CALL_MADE, onCallMade);
    socket.on(ServerToClientEvent.CALL_ANSWERED, onCallAnswered);
    socket.on(ServerToClientEvent.CALL_ENDED, onCallEnded);

    return () => {
      socket.off(ServerToClientEvent.CALL_MADE, onCallMade);
      socket.off(ServerToClientEvent.CALL_ANSWERED, onCallAnswered);
      socket.off(ServerToClientEvent.CALL_ENDED, onCallEnded);

      cleanupCall();
    };
  }, [socket, currentUserId, createPeerConnection, initLocalStream, cleanupCall]);

  return {
    startCall,
    answerCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
    isCallActive,
    isReceivingCall,
    localStream,
    remoteStream,
    activePartnerId,
  };
};
