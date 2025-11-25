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

  public play(key: string) {
    const audio = this.audioMap.get(key);
    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {});
  }
}

export const audioService = new AudioService();
