export type SoundEffectType =
  | 'click'
  | 'attack'
  | 'special'
  | 'defend'
  | 'potion'
  | 'enemyHit'
  | 'levelUp'
  | 'victory'
  | 'defeat'
  | 'dragonVictory';

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freqStart: number,
    freqEnd: number,
    duration: number,
    type: OscillatorType = 'triangle',
    gainPeak = 0.08,
    delay = 0
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const startTime = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, startTime);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), startTime + duration);
      }
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    } catch {
      // Ignore audio errors when browser blocks autoplay
    }
  }

  public play(effect: SoundEffectType): void {
    if (this.muted) return;
    switch (effect) {
      case 'click':
        this.playTone(520, 680, 0.06, 'triangle', 0.05);
        break;
      case 'attack':
        this.playTone(340, 110, 0.14, 'sawtooth', 0.07);
        this.playTone(620, 260, 0.09, 'square', 0.04, 0.03);
        break;
      case 'special':
        this.playTone(280, 720, 0.14, 'sawtooth', 0.08);
        this.playTone(720, 180, 0.22, 'square', 0.07, 0.11);
        break;
      case 'defend':
        this.playTone(380, 560, 0.12, 'triangle', 0.07);
        this.playTone(560, 660, 0.14, 'sine', 0.06, 0.08);
        break;
      case 'potion':
        this.playTone(440, 660, 0.12, 'sine', 0.06);
        this.playTone(660, 880, 0.16, 'sine', 0.06, 0.09);
        break;
      case 'enemyHit':
        this.playTone(190, 75, 0.18, 'sawtooth', 0.08);
        break;
      case 'levelUp':
        this.playTone(440, 440, 0.1, 'triangle', 0.07, 0);
        this.playTone(554, 554, 0.1, 'triangle', 0.07, 0.1);
        this.playTone(659, 659, 0.12, 'triangle', 0.08, 0.2);
        this.playTone(880, 880, 0.26, 'triangle', 0.09, 0.32);
        break;
      case 'victory':
        this.playTone(392, 392, 0.1, 'triangle', 0.07, 0);
        this.playTone(494, 494, 0.1, 'triangle', 0.07, 0.1);
        this.playTone(587, 587, 0.22, 'triangle', 0.08, 0.2);
        break;
      case 'defeat':
        this.playTone(311, 277, 0.18, 'sawtooth', 0.06, 0);
        this.playTone(261, 196, 0.24, 'sawtooth', 0.06, 0.18);
        this.playTone(174, 110, 0.34, 'triangle', 0.07, 0.42);
        break;
      case 'dragonVictory':
        this.playTone(392, 392, 0.12, 'triangle', 0.08, 0);
        this.playTone(523, 523, 0.12, 'triangle', 0.08, 0.12);
        this.playTone(659, 659, 0.14, 'triangle', 0.08, 0.24);
        this.playTone(784, 784, 0.36, 'triangle', 0.1, 0.38);
        break;
    }
  }
}

export const soundEngine = new RetroSoundEngine();
