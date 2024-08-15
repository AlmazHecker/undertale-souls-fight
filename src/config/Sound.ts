const context = new AudioContext();

// Audio API не позволяет играть один звук несколько раз
// Этот класс решает проблему
export class Sound {
  private buffer: AudioBuffer | null = null;
  private sources: AudioBufferSourceNode[] = [];

  constructor(private readonly url: string) {}

  async load(): Promise<Sound> {
    if (!this.url) return Promise.reject(new Error("Missing or invalid URL"));

    if (this.buffer) return this;

    const assetUrl = new URL(this.url, window.location.origin).href;
    try {
      const response = await fetch(assetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer);
      if (!buffer) {
        throw new Error(`Sound decoding error: ${this.url}`);
      }
      this.buffer = buffer;
      return this;
    } catch (err) {
      console.log(`Sound fetch or decoding error: ${err}`);
      throw err;
    }
  }

  play(volume = 1, time = 0) {
    if (!this.buffer) return;

    const source = context.createBufferSource();

    source.buffer = this.buffer;

    const insertedAt = this.sources.push(source) - 1;

    source.onended = () => {
      source.stop(0);

      this.sources.splice(insertedAt, 1);
    };

    const gainNode = context.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode).connect(context.destination);

    source.start(time);
  }

  stop() {
    this.sources.forEach((source) => {
      source.stop(0);
    });

    this.sources = [];
  }
}
