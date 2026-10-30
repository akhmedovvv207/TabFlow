export type Tab = 'songs' | 'metro' | 'tuner' | 'settings' | 'song';

export type Language = 'ru' | 'en';
export type Theme = 'system' | 'light' | 'dark';
export type ChordNotation = 'en' | 'de';
export type MetroSound = 'click' | 'wood' | 'beep';
export type TuningPreset = 'std' | 'drop' | 'half' | 'dad';

export interface SongPart {
  name: string;
  lines: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  hue: number;
  plays: number;
  tabIndex: number;
  parts: [string, string[]][];
}

export interface SongUserState {
  fav: boolean;
  off: boolean;
  transpose: number;
}

export interface AppSettings {
  theme: Theme;
  lang: Language;
  fontSize: number;
  notation: ChordNotation;
  sens: number;
  speed: number;
  wake: boolean;
  sound: MetroSound;
  accent: boolean;
  vib: boolean;
  vol: number;
  a4: number;
  tuning: TuningPreset;
  bpm: number;
  sig: number;
  songs: Record<string, SongUserState>;
}
