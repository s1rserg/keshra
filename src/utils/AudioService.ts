class AudioService {
  private audioMap: Map<string, HTMLAudioElement>;

  constructor() {
    this.audioMap = new Map();
  }

  public register(key: string, src: string) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.audioMap.set(key, audio);
  }

  public play(key: string, loop: boolean = false) {
    const audio = this.audioMap.get(key);
    if (!audio) return;

    if (!audio.paused && loop) return;

    audio.loop = loop;
    audio.currentTime = 0;

    audio.play().catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('Audio play blocked:', error);
    });
  }

  public stop(key: string) {
    const audio = this.audioMap.get(key);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  }
}

export const audioService = new AudioService();
