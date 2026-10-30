import { ChordNotation, MetroSound } from '../types';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playTone(freq: number, time: number, dur: number, type: OscillatorType, vol: number, decay: number) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
  } catch {
    // Audio synthesis fallback
  }
}

export function playMetronomeClick(time: number, isAccent: boolean, sound: MetroSound, volumePercent: number) {
  const vol = (volumePercent / 100) * 0.7;
  if (sound === 'wood') {
    playTone(isAccent ? 1080 : 740, time, 0.12, 'sine', vol * 1.2, 0.09);
    playTone(isAccent ? 2160 : 1480, time, 0.05, 'triangle', vol * 0.45, 0.03);
  } else if (sound === 'beep') {
    playTone(isAccent ? 988 : 659, time, 0.13, 'sine', vol, 0.1);
  } else {
    // Sharp click
    playTone(isAccent ? 1900 : 1250, time, 0.06, 'square', vol * 0.45, 0.04);
  }
}

export function playStringTone(freq: number, volumePercent: number) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const vol = (volumePercent / 100) * 0.35;
  // Fundamental
  playTone(freq, now, 2.5, 'triangle', vol, 2.2);
  // Harmonics for rich acoustic guitar resonance
  playTone(freq * 2, now, 1.6, 'sine', vol * 0.45, 1.2);
  playTone(freq * 3, now, 0.8, 'sine', vol * 0.2, 0.6);
  playTone(freq * 4, now, 0.4, 'sine', vol * 0.1, 0.3);
}

// Chord Transposition Utilities
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_MAP: Record<string, string> = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };

export function formatNoteName(index: number, notation: ChordNotation): string {
  const normalizedIndex = ((index % 12) + 12) % 12;
  let note = SHARP_NOTES[normalizedIndex];
  if (notation === 'de') {
    if (note === 'A#') note = 'B';
    else if (note === 'B') note = 'H';
  }
  return note;
}

export function getNoteIndex(name: string): number {
  const standardName = FLAT_MAP[name] || name;
  return SHARP_NOTES.indexOf(standardName);
}

export function transposeChord(chord: string, steps: number, notation: ChordNotation = 'en'): string {
  return chord.replace(/^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/, (_, root, suffix, bass) => {
    const rootIdx = getNoteIndex(root);
    const newRoot = rootIdx !== -1 ? formatNoteName(rootIdx + steps, notation) : root;
    let newBass = '';
    if (bass) {
      const bassIdx = getNoteIndex(bass);
      newBass = '/' + (bassIdx !== -1 ? formatNoteName(bassIdx + steps, notation) : bass);
    }
    return newRoot + (suffix || '') + newBass;
  });
}

// Pitch Detection (Autocorrelation)
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const size = buffer.length;
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / size);
  if (rms < 0.01) return -1; // Not enough signal

  // Trimming edges
  let r1 = 0;
  let r2 = size - 1;
  const th = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < th) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < th) {
      r2 = size - i;
      break;
    }
  }

  const trimmed = buffer.slice(r1, r2);
  const trimmedSize = trimmed.length;
  if (trimmedSize < 64) return -1;

  const c = new Float32Array(trimmedSize);
  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] += trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (d < trimmedSize - 1 && c[d] > c[d + 1]) d++;
  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }

  const t0 = maxPos;
  if (t0 <= 0 || t0 >= trimmedSize - 1) return -1;

  // Parabolic interpolation for fine frequency resolution
  const x1 = c[t0 - 1];
  const x2 = c[t0];
  const x3 = c[t0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  let interpolatedT = t0;
  if (a) {
    interpolatedT = t0 - b / (2 * a);
  }

  return sampleRate / interpolatedT;
}
