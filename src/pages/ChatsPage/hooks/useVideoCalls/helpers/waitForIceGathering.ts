import type { Nullable } from 'types/utils';

export const waitForIceGathering = async (
  pc: RTCPeerConnection,
): Promise<Nullable<RTCSessionDescription>> => {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      resolve(pc.localDescription);
      return;
    }

    const checkState = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', checkState);
        resolve(pc.localDescription);
      }
    };

    pc.addEventListener('icegatheringstatechange', checkState);

    setTimeout(() => {
      pc.removeEventListener('icegatheringstatechange', checkState);
      resolve(pc.localDescription);
    }, 2000);
  });
};
