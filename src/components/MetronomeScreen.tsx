import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Play, Pause, ArrowLeft } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { getAudioContext, playMetronomeClick } from '../utils/audio';

interface MetronomeScreenProps {
  settings: AppSettings;
  lang: Language;
  fromSong?: boolean;
  onBackToSong?: () => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
}

const TEMPO_NAMES = [
  { max: 40, name: 'Grave' },
  { max: 60, name: 'Largo' },
  { max: 66, name: 'Larghetto' },
  { max: 76, name: 'Adagio' },
  { max: 108, name: 'Andante' },
  { max: 120, name: 'Moderato' },
  { max: 156, name: 'Allegro' },
  { max: 176, name: 'Vivace' },
  { max: 240, name: 'Presto' }
];

export const MetronomeScreen: React.FC<MetronomeScreenProps> = ({
  settings,
  lang,
  fromSong,
  onBackToSong,
  onUpdateSettings
}) => {
  const t = TRANSLATIONS[lang];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const tapTimesRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const beatRef = useRef<number>(0);

  const getTempoName = (bpm: number) => {
    return TEMPO_NAMES.find((item) => bpm <= item.max)?.name || 'Allegro';
  };

  // Schedule metronome clicks via Web Audio
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentBeat(-1);
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    beatRef.current = 0;
    nextBeatTimeRef.current = ctx.currentTime + 0.05;

    const schedule = () => {
      while (nextBeatTimeRef.current < ctx.currentTime + 0.15) {
        const beat = beatRef.current;
        const isAccent = beat === 0 && settings.accent;
        playMetronomeClick(nextBeatTimeRef.current, isAccent, settings.sound, settings.vol);

        const delayMs = Math.max(0, (nextBeatTimeRef.current - ctx.currentTime) * 1000);
        setTimeout(() => {
          if (!isPlaying) return;
          setCurrentBeat(beat);
          if (settings.vib && 'vibrate' in navigator) {
            try {
              navigator.vibrate(isAccent ? 35 : 15);
            } catch {}
          }
        }, delayMs);

        const secondsPerBeat = 60 / settings.bpm;
        nextBeatTimeRef.current += secondsPerBeat;
        beatRef.current = (beatRef.current + 1) % settings.sig;
      }
    };

    timerRef.current = window.setInterval(schedule, 25);
    schedule();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, settings.bpm, settings.sig, settings.accent, settings.sound, settings.vol, settings.vib]);

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.min(240, Math.max(30, Math.round(newBpm)));
    onUpdateSettings({ bpm: clamped });
  };

  const handleTap = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;
    if (taps.length && now - taps[taps.length - 1] > 2000) {
      tapTimesRef.current = [];
    }
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 5) tapTimesRef.current.shift();

    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b) / intervals.length;
      handleBpmChange(60000 / avg);
    }
  };

  // Hold-to-repeat increment/decrement
  const holdIntervalRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);

  const startHold = (delta: number) => {
    handleBpmChange(settings.bpm + delta);
    holdTimeoutRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        handleBpmChange(settings.bpm + delta);
      }, 70);
    }, 350);
  };

  const stopHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Metronome weight position calculated from BPM
  const weightY = 40 + ((settings.bpm - 30) / 210) * 60;
  // Pendulum swing angle
  const swingAngle = isPlaying ? (currentBeat % 2 === 0 ? 24 : -24) : 0;

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] select-none">
      {/* Top Header */}
      <header className="bg-[#7a2626] text-[#fff0e4] px-5 pt-4 pb-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          {fromSong && (
            <button
              onClick={onBackToSong}
              className="p-1 -ml-2 rounded-full hover:bg-black/20"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="font-display font-bold text-2xl tracking-tight">
            {t.metronome}
          </h1>
        </div>
      </header>

      {/* Main interactive area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 flex flex-col items-center justify-between no-scrollbar">
        {/* Mechanical Pendulum Visual */}
        <div className="relative w-40 h-44 flex items-center justify-center my-2">
          <svg viewBox="0 0 120 170" className="w-full h-full overflow-visible drop-shadow-md">
            {/* Pyramid Wooden Case */}
            <path
              d="M 28 150 L 44 24 H 76 L 92 150 Z"
              fill="var(--surface)"
              stroke="var(--fg)"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <rect x="22" y="148" width="76" height="14" rx="4" fill="#7a2626" />

            {/* Pendulum Arm & Sliding Weight */}
            <g
              style={{
                transformOrigin: '60px 140px',
                transform: `rotate(${swingAngle}deg)`,
                transition: `transform ${60 / settings.bpm}s cubic-bezier(0.4, 0.05, 0.6, 0.95)`
              }}
            >
              <line x1="60" y1="140" x2="60" y2="20" stroke="var(--fg)" strokeWidth="3.2" strokeLinecap="round" />
              {/* Counterweight */}
              <rect
                x="51"
                y={weightY}
                width="18"
                height="15"
                rx="3.5"
                fill="#7a2626"
                stroke="#fff0e4"
                strokeWidth="1.2"
              />
              <line x1="53" y1={weightY + 7.5} x2="67" y2={weightY + 7.5} stroke="#fff0e4" strokeWidth="1" />
            </g>

            {/* Pivot pin */}
            <circle cx="60" cy="140" r="6" fill="var(--fg)" />
          </svg>
        </div>

        {/* Big BPM and Tempo Label */}
        <div className="text-center my-1">
          <div className="font-display font-extrabold text-7xl sm:text-8xl tabular-nums leading-none text-[var(--fg)] tracking-tight">
            {settings.bpm}
          </div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--muted)] mt-1">
            {getTempoName(settings.bpm)}
          </div>
        </div>

        {/* Precision Range Slider + +/- Buttons */}
        <div className="w-full max-w-sm flex items-center gap-3 px-2">
          <button
            onPointerDown={() => startHold(-1)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-[var(--fg)] flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            aria-label="Decrease BPM"
          >
            <Minus className="w-5 h-5" />
          </button>

          <input
            type="range"
            min="30"
            max="240"
            value={settings.bpm}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            className="flex-1"
            style={{ '--p': `${((settings.bpm - 30) / 210) * 100}%` } as any}
          />

          <button
            onPointerDown={() => startHold(1)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-[var(--fg)] flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
            aria-label="Increase BPM"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Beat indicator dots */}
        <div className="flex items-center justify-center gap-3.5 my-3 min-h-[30px]">
          {Array.from({ length: settings.sig }).map((_, i) => {
            const isLit = i === currentBeat && isPlaying;
            const isFirst = i === 0;
            return (
              <div
                key={i}
                className={`w-5 h-5 rounded-full transition-all duration-100 ${
                  isLit
                    ? 'scale-135 bg-[#7a2626] shadow-md shadow-[#7a2626]/40'
                    : isFirst && settings.accent
                    ? 'bg-[#993333]/60'
                    : 'bg-[var(--line)]'
                }`}
              />
            );
          })}
        </div>

        {/* Time Signature Segmented Selector */}
        <div className="w-full max-w-sm">
          <span className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider text-center">
            {t.sig}
          </span>
          <div className="grid grid-cols-4 bg-[var(--surface)] p-1 rounded-2xl border border-[var(--line)] gap-1">
            {[2, 3, 4, 6].map((sigVal) => {
              const label = sigVal === 6 ? '6/8' : `${sigVal}/4`;
              const active = settings.sig === sigVal;
              return (
                <button
                  key={sigVal}
                  onClick={() => onUpdateSettings({ sig: sigVal })}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    active ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Tap Tempo and Play/Stop */}
        <div className="w-full max-w-sm flex items-center gap-3 pt-3">
          <button
            onClick={handleTap}
            className="flex-1 py-3.5 rounded-2xl border-2 border-[#7a2626] text-[#7a2626] dark:text-[#f6e4d4] dark:border-[var(--line)] font-extrabold text-sm sm:text-base tracking-wider uppercase active:scale-95 transition-all shadow-sm"
          >
            {t.tap}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 py-3.5 rounded-2xl bg-[#7a2626] text-[#fff0e4] font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#7a2626]/25 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" fill="currentColor" />
                <span>{t.stop}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                <span>{t.start}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
