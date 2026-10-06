/**
 * Calm Music & Celestial Audio Engine for "WOW CODING..."
 * Uses the Web Audio API to procedurally generate serene, calming ambient music
 * with warm ethereal chord pads, gentle celestial star chimes, and smooth fade envelopes.
 * Completely standalone, zero external audio assets required, guaranteed 100% reliability.
 */

class CalmMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private isAudioMuted: boolean = false;
  private volumeLevel: number = 0.65;
  private timerId: number | null = null;
  private chimeTimerId: number | null = null;
  private listeners: Set<() => void> = new Set();
  private currentChordIndex: number = 0;

  // Calming celestial chord voicings (Hz frequencies)
  // Chord progression: Fmaj9 -> Gsus4 -> Am9 -> Em7 (Peaceful, uplifting, sweet)
  private chords = [
    // F maj9 (Warm, open, dreamy)
    [174.61, 261.63, 329.63, 392.00, 440.00], 
    // G sus4 / Gadd9 (Soothing floating feeling)
    [196.00, 293.66, 392.00, 523.25, 587.33],
    // A min9 (Deep, contemplative, cosmic)
    [220.00, 329.63, 392.00, 493.88, 523.25],
    // E min7 / C maj7 (Sweet resolution)
    [164.81, 246.94, 329.63, 392.00, 493.88]
  ];

  // High celestial chime frequencies (E5, G5, A5, C6, D6, E6, G6)
  private chimePitches = [659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isAudioMuted ? 0 : this.volumeLevel, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public async startMusic() {
    try {
      const ctx = this.initContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (this.isMusicPlaying) return;
      this.isMusicPlaying = true;
      this.notify();

      // Master gain smooth fade-in
      if (this.masterGain) {
        const targetVol = this.isAudioMuted ? 0 : this.volumeLevel;
        this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 2.5);
      }

      // Start chord loop and star chimes
      this.playNextChord();
      this.startChimeTwinkles();
    } catch {
      // Audio autoplay might be suspended until user gesture
    }
  }

  private playNextChord() {
    if (!this.isMusicPlaying || !this.ctx || !this.masterGain) return;

    const ctx = this.ctx;
    const notes = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    const chordDuration = 7.0; // 7 seconds per breathing pad
    const startTime = ctx.currentTime;

    // Create a lush low-pass filter for velvety softness
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, startTime);
    filter.Q.setValueAtTime(1.2, startTime);
    filter.connect(this.masterGain);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Alternate warm sine and soft triangle for acoustic harmonic depth
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Subtle detune for lush chorus shimmer
      const detuneCents = (idx - 2) * 3.5;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime(detuneCents, startTime);

      // Slow gentle swelling attack and long peaceful release
      const baseNoteVolume = 0.055 / Math.sqrt(notes.length);
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(baseNoteVolume, startTime + 2.2);
      oscGain.gain.setValueAtTime(baseNoteVolume, startTime + chordDuration - 2.0);
      oscGain.gain.linearRampToValueAtTime(0.0001, startTime + chordDuration);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(startTime);
      osc.stop(startTime + chordDuration);
    });

    // Schedule next chord slightly overlapping (1.8s overlap for seamless crossfade)
    const nextDelay = (chordDuration - 1.8) * 1000;
    this.timerId = window.setTimeout(() => {
      this.playNextChord();
    }, nextDelay);
  }

  private startChimeTwinkles() {
    if (!this.isMusicPlaying) return;

    const scheduleNextChime = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.masterGain) return;

      // Play a soft sweet star chime
      this.playSingleChime();

      // Random peaceful delay between 1.5s and 3.8s
      const delay = 1500 + Math.random() * 2300;
      this.chimeTimerId = window.setTimeout(scheduleNextChime, delay);
    };

    scheduleNextChime();
  }

  private playSingleChime(pitchOverride?: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const pitch = pitchOverride || this.chimePitches[Math.floor(Math.random() * this.chimePitches.length)];

    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(pitch, now);

    // Subtle gentle bell strike envelope
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.045, now + 0.04);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    chimeOsc.start(now);
    chimeOsc.stop(now + 1.85);
  }

  /**
   * Sound effect for the shooting star intro animation:
   * A gentle ascending-descending celestial shimmer & star glissando
   */
  public playShootingStarSwoosh() {
    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // 1. Soft star chime glissando
    const pitches = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    pitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.04, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      if (this.masterGain) {
        gain.connect(this.masterGain);
      } else {
        gain.connect(ctx.destination);
      }

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });

    // 2. Gentle celestial warm swell
    const swellOsc = ctx.createOscillator();
    const swellGain = ctx.createGain();
    swellOsc.type = 'triangle';
    swellOsc.frequency.setValueAtTime(220, now);
    swellOsc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

    swellGain.gain.setValueAtTime(0, now);
    swellGain.gain.linearRampToValueAtTime(0.035, now + 0.6);
    swellGain.gain.linearRampToValueAtTime(0.0001, now + 2.0);

    swellOsc.connect(swellGain);
    if (this.masterGain) {
      swellGain.connect(this.masterGain);
    } else {
      swellGain.connect(ctx.destination);
    }

    swellOsc.start(now);
    swellOsc.stop(now + 2.05);
  }

  public stopMusic() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.chimeTimerId) {
      clearTimeout(this.chimeTimerId);
      this.chimeTimerId = null;
    }

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
    }

    this.isMusicPlaying = false;
    this.notify();
  }

  public toggleMute() {
    this.isAudioMuted = !this.isAudioMuted;
    if (this.ctx && this.masterGain) {
      const targetVol = this.isAudioMuted ? 0 : this.volumeLevel;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.3);
    }
    this.notify();
  }

  public setVolume(level: number) {
    this.volumeLevel = Math.max(0, Math.min(1, level));
    if (!this.isAudioMuted && this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volumeLevel, this.ctx.currentTime + 0.2);
    }
    this.notify();
  }

  public getStatus() {
    return {
      isPlaying: this.isMusicPlaying,
      isMuted: this.isAudioMuted,
      volume: this.volumeLevel,
    };
  }
}

export const calmMusic = new CalmMusicEngine();
