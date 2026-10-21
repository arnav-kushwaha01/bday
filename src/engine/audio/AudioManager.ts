/**
 * ANSHIKA — THE ARCHIVE
 * Audio Ambience & Sound Effects Engine (Phase 13)
 *
 * Implements:
 * 1. Web Audio context initialization with lazy start (strictly respects Rule 7: no autoplay).
 * 2. Room-specific ambient soundscapes (Hub, Gallery, Versions, Evidence, Distance, Little Things, Main Character, Future, and near-silence for Final per Rule 6).
 * 3. Dedicated Love Song acoustic synthesizer & custom track player:
 *    - "Perfect" (Ed Sheeran) — Acoustic guitar & piano 12/8 romantic ballad arrangement.
 *    - "Rut" (Navjot Ahuja) — Soulful Punjabi acoustic love ballad arrangement.
 *    - "Archive Noir" — Atmospheric detective mystery lounge.
 *    - "Celestial Horizon" — Cosmic ambient resonance.
 *    - "Birthday Music Box" — Nostalgic 23rd birthday musical clock chimes.
 * 4. Custom MP3/OGG file loader for /media/audio/songs/ directory or external audio links.
 * 5. Procedural sound effects: footsteps, evidence inspect chime, safe dial tick, safe unlock, door latch, paper rustle, cassette click, wish star.
 */

import { RoomState } from "@/store/useAppStore";

export type AudioPlayMode = "ROOM_SYNC" | "LOVE_SONGS";

export interface LoveSongTrack {
  id: string;
  title: string;
  artist: string;
  subtitle: string;
  type: "synth" | "file";
  filePath?: string;
  durationSeconds: number;
}

export const LOVE_SONGS_PLAYLIST: LoveSongTrack[] = [
  {
    id: "perfect",
    title: "Perfect",
    artist: "Ed Sheeran",
    subtitle: "Original Studio Master • Ed Sheeran",
    type: "file",
    filePath: "/media/audio/songs/perfect.mp3",
    durationSeconds: 263,
  },
  {
    id: "rut",
    title: "Rut",
    artist: "Navjot Ahuja",
    subtitle: "Original Studio Master • Navjot Ahuja",
    type: "file",
    filePath: "/media/audio/songs/rut.mp3",
    durationSeconds: 215,
  },
  {
    id: "noir_archive",
    title: "Case No. 1025",
    artist: "The Archive",
    subtitle: "Noir Tape Reel & Warm Vintage Jazz Mood",
    type: "synth",
    durationSeconds: 198,
  },
  {
    id: "celestial_horizon",
    title: "Celestial Trajectory",
    artist: "The Observatory",
    subtitle: "Harmonic Crystal Cosmic Reverie",
    type: "synth",
    durationSeconds: 240,
  },
  {
    id: "birthday_chimes",
    title: "23 Years (Birthday Reverie)",
    artist: "Arnav for Anshika",
    subtitle: "Music Box & Warm Celesta Chimes",
    type: "synth",
    durationSeconds: 185,
  },
];

class AudioManager {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Gain nodes
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Settings
  private isMuted = true; // Rule 7: sound starts muted until user activates
  private masterVolume = 0.8;
  private ambienceVolume = 0.7;
  private musicVolume = 0.85;
  private sfxVolume = 0.75;

  // State
  private currentRoom: RoomState = "HUB";
  private playMode: AudioPlayMode = "ROOM_SYNC";
  private currentTrackIndex = 0;
  private isPlaying = false;

  // Synthesis loops & intervals
  private synthInterval: number | null = null;
  private synthStep = 0;
  private activeOscillators: OscillatorNode[] = [];

  // Footstep throttling
  private lastFootstepTime = 0;

  // Custom audio element for file playback
  private customAudio: HTMLAudioElement | null = null;

  // Listeners for UI updates
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Lazy initialization on first user interaction
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error("Audio listener error:", e);
      }
    });
  }

  /**
   * Initializes the AudioContext upon user gesture.
   */
  public async init(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (this.isInitialized && this.ctx && this.ctx.state === "running") return true;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return false;

      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }

      if (this.ctx.state === "suspended") {
        await this.ctx.resume();
      }

      // Create master gain bus
      this.masterGain = this.ctx.createGain();
      this.ambienceGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.ambienceGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyGains();
      this.isInitialized = true;

      return true;
    } catch (err) {
      console.warn("Failed to initialize Web Audio context:", err);
      return false;
    }
  }

  private applyGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterVal = this.isMuted ? 0 : this.masterVolume;

    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(masterVal, now + 0.1);
    }
    if (this.ambienceGain) {
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.linearRampToValueAtTime(this.ambienceVolume, now + 0.1);
    }
    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, now + 0.1);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.cancelScheduledValues(now);
      this.sfxGain.gain.linearRampToValueAtTime(this.sfxVolume, now + 0.1);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted
        ? 0
        : (this.currentRoom === "FINAL" ? 0.02 : 1) * this.masterVolume * this.musicVolume;
    }
  }

  // ─── Control Methods ─────────────────────────────────────────────────────────

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      if (this.customAudio && this.isPlaying) {
        this.customAudio.play().catch(() => {});
      }
      this.init().then(() => {
        if (!this.isPlaying) {
          this.startPlayback();
        }
      });
    } else {
      if (this.customAudio) {
        this.customAudio.pause();
      }
    }
    this.applyGains();
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMasterVolume(v: number) {
    this.masterVolume = Math.max(0, Math.min(1, v));
    this.applyGains();
    this.notify();
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setAmbienceVolume(v: number) {
    this.ambienceVolume = Math.max(0, Math.min(1, v));
    this.applyGains();
    this.notify();
  }

  public getAmbienceVolume(): number {
    return this.ambienceVolume;
  }

  public setMusicVolume(v: number) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    this.applyGains();
    this.notify();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(v: number) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    this.applyGains();
    this.notify();
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setPlayMode(mode: AudioPlayMode) {
    if (this.playMode === mode) return;
    this.playMode = mode;
    this.stopActivePlayback();
    if (!this.isMuted) {
      this.startPlayback();
    }
    this.notify();
  }

  public getPlayMode(): AudioPlayMode {
    return this.playMode;
  }

  public getCurrentTrack(): LoveSongTrack {
    return LOVE_SONGS_PLAYLIST[this.currentTrackIndex] || LOVE_SONGS_PLAYLIST[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public setTrackIndex(index: number) {
    const nextIdx = (index + LOVE_SONGS_PLAYLIST.length) % LOVE_SONGS_PLAYLIST.length;
    this.currentTrackIndex = nextIdx;
    this.stopActivePlayback();
    if (!this.isMuted) {
      this.startPlayback();
    }
    this.notify();
  }

  public nextTrack() {
    this.setTrackIndex(this.currentTrackIndex + 1);
  }

  public previousTrack() {
    this.setTrackIndex(this.currentTrackIndex - 1);
  }

  public togglePlayPause() {
    if (this.isMuted) {
      this.setMuted(false);
      return;
    }
    if (this.isPlaying) {
      this.stopActivePlayback();
      this.isPlaying = false;
    } else {
      this.startPlayback();
    }
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isMuted;
  }

  /**
   * Called when the active 3D room changes.
   * If in ROOM_SYNC mode, crossfades to the new room soundscape.
   * If in FINAL room, always adheres strictly to Rule 6 (near-silence).
   */
  public onRoomChange(newRoom: RoomState) {
    this.currentRoom = newRoom;
    if (this.playMode === "ROOM_SYNC") {
      this.stopActivePlayback();
      if (!this.isMuted) {
        this.startPlayback();
      }
    } else {
      // If playing love songs and user enters FINAL room, duck music to near silence per Rule 6
      if (newRoom === "FINAL") {
        if (this.customAudio) {
          this.customAudio.volume = 0.02;
        }
        if (this.musicGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.musicGain.gain.cancelScheduledValues(now);
          this.musicGain.gain.linearRampToValueAtTime(0.02, now + 1.5);
        }
      } else {
        if (this.customAudio) {
          this.customAudio.volume = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
        }
        if (this.musicGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.musicGain.gain.cancelScheduledValues(now);
          this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, now + 1.5);
        }
      }
    }
    this.notify();
  }

  // ─── Playback Engine ─────────────────────────────────────────────────────────

  private async startPlayback() {
    await this.init();
    if (!this.ctx) return;

    this.isPlaying = true;

    if (this.playMode === "ROOM_SYNC") {
      this.startRoomAmbience(this.currentRoom);
    } else {
      this.startLoveSong(this.getCurrentTrack());
    }
    this.notify();
  }

  private stopActivePlayback() {
    if (this.synthInterval !== null) {
      window.clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.synthStep = 0;

    // Stop active oscillators
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeOscillators = [];

    // Pause custom audio if active
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
  }

  // ─── Room Ambience Synthesizers ──────────────────────────────────────────────

  private startRoomAmbience(room: RoomState) {
    if (!this.ctx || !this.ambienceGain) return;

    // Rule 6: Final room is near-silence. Minimal room air tone only.
    if (room === "FINAL") {
      this.createSubtleAirTone(0.03, 140);
      return;
    }

    switch (room) {
      case "HUB":
        // Mysterious museum tone, low warm drone, gentle vintage tape hiss
        this.createDrone([65.4, 130.8, 196.0], 0.08, "sine");
        this.createAirHiss(0.015, 600);
        break;

      case "HER_GALLERY":
        // Warm acoustic piano chords in A Major / C# minor
        this.startArpeggiatedPad([
          [220.0, 277.18, 329.63, 440.0], // A
          [164.81, 246.94, 329.63, 392.0], // E
          [138.59, 207.65, 277.18, 329.63], // C#m
          [146.83, 220.0, 293.66, 369.99], // D
        ], 3200);
        this.createDrone([55.0, 110.0], 0.06, "triangle");
        break;

      case "VERSIONS":
        // Nostalgic, reflective warm pad
        this.startArpeggiatedPad([
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [130.81, 196.0, 261.63, 329.63], // C
          [146.83, 220.0, 261.63, 349.23], // Dm7
          [116.54, 174.61, 233.08, 293.66], // Bb
        ], 3600);
        break;

      case "EVIDENCE":
        // Noir tape reel hum, warm Rhodes tone, gentle mystery
        this.createDrone([73.42, 110.0, 164.81], 0.07, "triangle");
        this.createAirHiss(0.025, 800);
        this.startArpeggiatedPad([
          [146.83, 220.0, 261.63, 349.23], // Dm7
          [98.0, 146.83, 220.0, 293.66], // G9
          [116.54, 174.61, 233.08, 349.23], // Bbmaj7
          [110.0, 164.81, 207.65, 261.63], // A7b9
        ], 4000);
        break;

      case "DISTANCE":
        // Deep cosmic spatial drone, resonant starlight frequencies
        this.createDrone([43.65, 87.31, 130.81], 0.1, "sine");
        this.createDrone([261.63, 392.0, 523.25], 0.03, "sine");
        this.createAirHiss(0.012, 1400);
        break;

      case "LITTLE_THINGS":
        // Cozy library atmosphere, crackling hearth tone, delicate celesta notes
        this.createAirHiss(0.02, 500);
        this.createDrone([98.0, 146.83], 0.05, "sine");
        this.startMusicBoxTones([
          392.0, 440.0, 493.88, 587.33, 659.25, 783.99,
        ], 1600);
        break;

      case "MAIN_CHARACTER":
        // Theatrical cinema hall presence, proscenium velvet resonance
        this.createDrone([65.4, 98.0, 130.81, 196.0], 0.09, "sawtooth", 450);
        this.startArpeggiatedPad([
          [130.81, 196.0, 246.94, 329.63], // Cmaj7
          [110.0, 164.81, 220.0, 261.63], // Am7
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [196.0, 246.94, 293.66, 392.0], // G
        ], 3000);
        break;

      case "FUTURE":
        // Uplifting celestial overture, crystalline horizon shimmer
        this.createDrone([55.0, 110.0, 164.81], 0.07, "sine");
        this.startArpeggiatedPad([
          [220.0, 277.18, 329.63, 415.3], // Amaj7
          [185.0, 246.94, 293.66, 369.99], // F#m7
          [146.83, 220.0, 277.18, 329.63], // Dmaj7
          [164.81, 246.94, 329.63, 440.0], // Eadd9
        ], 2800);
        break;

      default:
        this.createDrone([65.4, 130.8], 0.05, "sine");
        break;
    }
  }

  // ─── Love Song Synthesis ("Perfect", "Rut", etc.) ────────────────────────────

  private async startLoveSong(track: LoveSongTrack) {
    if (!this.ctx || !this.musicGain) return;

    // 1. Try to load original master audio tracks
    const candidatePaths: string[] = [];
    if (track.filePath) candidatePaths.push(track.filePath);
    if (track.id === "perfect") {
      candidatePaths.push("/media/audio/songs/perfect.mp3");
      candidatePaths.push("/media/audio/songs/ytmp3free.cc_ed-sheeran-perfect-youtubemp3free.org.mp3");
    } else if (track.id === "rut") {
      candidatePaths.push("/media/audio/songs/rut.mp3");
      candidatePaths.push("/media/audio/songs/ytmp3free.cc_navjot-ahuja-rut-official-audio-youtubemp3free.org.mp3");
    }

    for (const path of candidatePaths) {
      try {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.volume = this.isMuted
          ? 0
          : (this.currentRoom === "FINAL" ? 0.02 : 1) * this.masterVolume * this.musicVolume;

        audio.onended = () => {
          this.nextTrack();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.customAudio = audio;
          return;
        }
      } catch {
        // Try next candidate or smoothly fall back to procedural synth arrangement
      }
    }

    // 2. High-fidelity procedural synthesizer arrangements
    if (track.id === "perfect") {
      this.playPerfectArrangement();
    } else if (track.id === "rut") {
      this.playRutArrangement();
    } else if (track.id === "noir_archive") {
      this.playNoirArrangement();
    } else if (track.id === "celestial_horizon") {
      this.playCelestialArrangement();
    } else {
      this.playBirthdayMusicBoxArrangement();
    }
  }

  /**
   * "Perfect" by Ed Sheeran
   * Key: G Major, 12/8 time signature romantic acoustic guitar & piano waltz.
   * Chords: G (G-B-D) -> Em (E-G-B) -> C (C-E-G) -> D (D-F#-A).
   * Synthesizes warm plucked acoustic guitar harmonics and soft piano voicings.
   */
  private playPerfectArrangement() {
    if (!this.ctx || !this.musicGain) return;

    // G Major chord progressions in 12/8 lilting waltz
    const chords = [
      // G Major
      { bass: 98.0, arpeggio: [196.0, 246.94, 293.66, 392.0, 293.66, 246.94], melody: 392.0 },
      // E Minor
      { bass: 82.41, arpeggio: [164.81, 196.0, 246.94, 329.63, 246.94, 196.0], melody: 369.99 },
      // C Major
      { bass: 65.41, arpeggio: [130.81, 164.81, 196.0, 261.63, 196.0, 164.81], melody: 329.63 },
      // D Major
      { bass: 73.42, arpeggio: [146.83, 185.0, 220.0, 293.66, 220.0, 185.0], melody: 293.66 },
    ];

    let chordIdx = 0;
    let arpIdx = 0;
    const stepTimeMs = 280; // 12/8 lilting pulse

    // Warm underlying bass pad
    this.createDrone([98.0, 146.83], 0.05, "sine");

    this.synthInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const current = chords[chordIdx];

      // Play acoustic guitar plucked note
      const noteFreq = current.arpeggio[arpIdx];
      this.triggerPluckedString(noteFreq, 0.14, 0.45);

      // On beat 1 of each chord, play bass and piano chord tone
      if (arpIdx === 0) {
        this.triggerBassNote(current.bass, 0.18, 1.2);
        this.triggerPianoNote(current.melody, 0.16, 1.5);
      }

      arpIdx++;
      if (arpIdx >= current.arpeggio.length) {
        arpIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, stepTimeMs);
  }

  /**
   * "Rut" by Navjot Ahuja
   * Key: D Major, Soulful acoustic Punjabi ballad.
   * Chords: D Major -> B Minor -> G Major -> A Major.
   * Synthesizes emotional acoustic guitar picking with warm vocal pad overtone.
   */
  private playRutArrangement() {
    if (!this.ctx || !this.musicGain) return;

    const chords = [
      // D Major
      { bass: 73.42, arpeggio: [146.83, 220.0, 293.66, 369.99, 293.66, 220.0], melody: 369.99 },
      // B Minor
      { bass: 61.74, arpeggio: [123.47, 185.0, 246.94, 293.66, 246.94, 185.0], melody: 329.63 },
      // G Major
      { bass: 49.0, arpeggio: [98.0, 146.83, 196.0, 246.94, 196.0, 146.83], melody: 293.66 },
      // A Major
      { bass: 55.0, arpeggio: [110.0, 164.81, 220.0, 277.18, 220.0, 164.81], melody: 277.18 },
    ];

    let chordIdx = 0;
    let arpIdx = 0;
    const stepTimeMs = 310;

    // Warm soulful background drone
    this.createDrone([73.42, 110.0], 0.05, "triangle");

    this.synthInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const current = chords[chordIdx];

      // Soulful acoustic guitar pluck
      const noteFreq = current.arpeggio[arpIdx];
      this.triggerPluckedString(noteFreq, 0.13, 0.5);

      if (arpIdx === 0) {
        this.triggerBassNote(current.bass, 0.2, 1.4);
        this.triggerPianoNote(current.melody, 0.15, 1.6);
      }

      arpIdx++;
      if (arpIdx >= current.arpeggio.length) {
        arpIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, stepTimeMs);
  }

  /**
   * "Case No. 1025" — Noir Detective Lounge
   */
  private playNoirArrangement() {
    this.createAirHiss(0.02, 600);
    this.createDrone([73.42, 110.0], 0.06, "triangle");
    this.startArpeggiatedPad([
      [146.83, 220.0, 261.63, 349.23], // Dm7
      [116.54, 174.61, 233.08, 349.23], // Bbmaj7
      [98.0, 146.83, 196.0, 246.94], // G7
      [110.0, 164.81, 207.65, 261.63], // A7b9
    ], 3800);
  }

  /**
   * "Celestial Horizon" — Cosmic Reverie
   */
  private playCelestialArrangement() {
    this.createAirHiss(0.015, 1200);
    this.createDrone([65.4, 98.0, 130.81, 261.63], 0.08, "sine");
    this.startArpeggiatedPad([
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 440.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G
    ], 3200);
  }

  /**
   * "23 Years (Birthday Reverie)" — Music box & celesta
   */
  private playBirthdayMusicBoxArrangement() {
    this.createDrone([98.0, 146.83], 0.04, "sine");
    this.startMusicBoxTones([
      392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99,
    ], 1400);
  }

  // ─── Sound Generators & Synthesizers ─────────────────────────────────────────

  private triggerPluckedString(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  private triggerPianoNote(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private triggerBassNote(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private createDrone(
    freqs: number[],
    volume: number,
    type: OscillatorType = "sine",
    filterFreq: number = 800
  ) {
    if (!this.ctx || !this.ambienceGain) return;
    const now = this.ctx.currentTime;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 2.0);

    filter.connect(gain);
    gain.connect(this.ambienceGain);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(f, now);
      osc.connect(filter);
      osc.start(now);
      this.activeOscillators.push(osc);
    });
  }

  private createAirHiss(volume: number, filterCutoff: number) {
    if (!this.ctx || !this.ambienceGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambienceGain);

      whiteNoise.start();
    } catch {
      // fallback
    }
  }

  private createSubtleAirTone(volume: number, freq: number) {
    if (!this.ctx || !this.ambienceGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 1.5);

    osc.connect(gain);
    gain.connect(this.ambienceGain);

    osc.start(now);
    this.activeOscillators.push(osc);
  }

  private startArpeggiatedPad(chords: number[][], intervalMs: number) {
    let index = 0;

    const playChord = () => {
      if (!this.ctx || !this.ambienceGain || this.isMuted) return;
      const chord = chords[index];
      const now = this.ctx.currentTime;
      const duration = intervalMs / 1000 * 1.1;

      chord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.ambienceGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(freq * 2.5, now);

        gain.gain.setValueAtTime(0.001, now + noteIdx * 0.08);
        gain.gain.linearRampToValueAtTime(0.045, now + noteIdx * 0.08 + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambienceGain);

        osc.start(now + noteIdx * 0.08);
        osc.stop(now + duration + 0.1);
      });

      index = (index + 1) % chords.length;
    };

    playChord();
    this.synthInterval = window.setInterval(playChord, intervalMs);
  }

  private startMusicBoxTones(scale: number[], intervalMs: number) {
    this.synthInterval = window.setInterval(() => {
      if (!this.ctx || !this.ambienceGain || this.isMuted) return;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const now = this.ctx.currentTime;
      const duration = 1.6;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    }, intervalMs);
  }

  // ─── Sound Effects (SFX) ─────────────────────────────────────────────────────

  /**
   * Footsteps on archival parquet/stone floor.
   * Throttled to ~320ms so it sounds natural while moving.
   */
  public playFootstep(type: "stone" | "wood" = "stone") {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastFootstepTime < 320) return;
    this.lastFootstepTime = now;

    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const pitchJitter = 0.95 + Math.random() * 0.1;
      const baseFreq = type === "stone" ? 75 * pitchJitter : 95 * pitchJitter;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, audioNow);
      osc.frequency.exponentialRampToValueAtTime(35, audioNow + 0.08);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, audioNow);

      gain.gain.setValueAtTime(0.001, audioNow);
      gain.gain.linearRampToValueAtTime(0.09 * this.sfxVolume, audioNow + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.09);
    } catch {
      // ignore
    }
  }

  /**
   * Inspect chime when focusing on evidence or photos.
   */
  public playInspect() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const chord = [1046.5, 1318.51, 1567.98]; // C6, E6, G6 glass chime

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioNow + idx * 0.04);

        gain.gain.setValueAtTime(0.001, audioNow + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.08 * this.sfxVolume, audioNow + idx * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + idx * 0.04 + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(audioNow + idx * 0.04);
        osc.stop(audioNow + idx * 0.04 + 0.5);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Safe combination dial mechanical tick.
   */
  public playSafeDialTick() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200 + Math.random() * 200, audioNow);
      osc.frequency.exponentialRampToValueAtTime(400, audioNow + 0.025);

      gain.gain.setValueAtTime(0.001, audioNow);
      gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, audioNow + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.035);
    } catch {
      // ignore
    }
  }

  /**
   * Safe unlock heavy vault release chime.
   */
  public playSafeUnlock() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      // Heavy mechanical thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();

      thud.type = "sine";
      thud.frequency.setValueAtTime(90, audioNow);
      thud.frequency.exponentialRampToValueAtTime(30, audioNow + 0.3);

      thudGain.gain.setValueAtTime(0.25 * this.sfxVolume, audioNow);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.35);

      thud.connect(thudGain);
      thudGain.connect(this.sfxGain);

      thud.start(audioNow);
      thud.stop(audioNow + 0.4);

      // Brass resolution chime (F#5, A#5, C#6)
      [739.99, 932.33, 1108.73].forEach((f, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, audioNow + 0.15 + idx * 0.05);

        gain.gain.setValueAtTime(0.001, audioNow + 0.15 + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.1 * this.sfxVolume, audioNow + 0.15 + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.15 + idx * 0.05 + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(audioNow + 0.15 + idx * 0.05);
        osc.stop(audioNow + 0.15 + idx * 0.05 + 0.75);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Door latch and room transition whoosh.
   */
  public playDoorLatch() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, audioNow);
      osc.frequency.exponentialRampToValueAtTime(50, audioNow + 0.25);

      gain.gain.setValueAtTime(0.001, audioNow);
      gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, audioNow + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.35);
    } catch {
      // ignore
    }
  }

  /**
   * Manila folder paper rustle.
   */
  public playPaperRustle() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, audioNow);
      osc.frequency.linearRampToValueAtTime(450, audioNow + 0.1);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(700, audioNow);

      gain.gain.setValueAtTime(0.001, audioNow);
      gain.gain.linearRampToValueAtTime(0.08 * this.sfxVolume, audioNow + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.16);
    } catch {
      // ignore
    }
  }

  /**
   * Cassette tape mechanical clunk.
   */
  public playTapeClick() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(600, audioNow);
      osc.frequency.exponentialRampToValueAtTime(150, audioNow + 0.06);

      gain.gain.setValueAtTime(0.001, audioNow);
      gain.gain.linearRampToValueAtTime(0.14 * this.sfxVolume, audioNow + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.08);
    } catch {
      // ignore
    }
  }

  /**
   * 11:11 Wishing Star celestial chime.
   */
  public playWishStar() {
    if (this.isMuted) return;
    if (!this.ctx || !this.sfxGain) {
      this.init();
      return;
    }

    try {
      const audioNow = this.ctx.currentTime;
      const frequencies = [880, 1108.73, 1318.51, 1661.22, 1975.53, 2637.02];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioNow + idx * 0.08);

        gain.gain.setValueAtTime(0.001, audioNow + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08 * this.sfxVolume, audioNow + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(audioNow + idx * 0.08);
        osc.stop(audioNow + idx * 0.08 + 0.95);
      });
    } catch {
      // ignore
    }
  }
}

// Global Singleton Instance
export const soundEngine = new AudioManager();

if (typeof window !== "undefined") {
  (window as unknown as { __SOUND_ENGINE__: AudioManager }).__SOUND_ENGINE__ = soundEngine;
}
