import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bookmark, Heart, Play, Pause, Mic, SlidersHorizontal, Plus, Minus } from 'lucide-react';
import { Song, SongUserState, Language, ChordNotation, AppSettings } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { transposeChord } from '../utils/audio';
import { GUITAR_TABS } from '../data/songs';

interface SongDetailScreenProps {
  song: Song;
  songState: SongUserState;
  settings: AppSettings;
  lang: Language;
  onBack: () => void;
  onToggleFavorite: () => void;
  onToggleOffline: () => void;
  onTransposeChange: (newTranspose: number) => void;
  onOpenTuner: () => void;
  onOpenMetronome: () => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
}

export const SongDetailScreen: React.FC<SongDetailScreenProps> = ({
  song,
  songState,
  settings,
  lang,
  onBack,
  onToggleFavorite,
  onToggleOffline,
  onTransposeChange,
  onOpenTuner,
  onOpenMetronome,
  onUpdateSettings
}) => {
  const t = TRANSLATIONS[lang];
  const [view, setView] = useState<'chords' | 'tabs'>('chords');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio / Mic analysis state
  const [micActive, setMicActive] = useState(false);
  const [detectedBpm, setDetectedBpm] = useState(song.bpm);
  const [micLevel, setMicLevel] = useState(0);

  const lyricsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accScrollRef = useRef<number>(0);
  const micIntervalRef = useRef<number | null>(null);

  // Wake lock
  useEffect(() => {
    let wakeLock: any = null;
    if (isPlaying && settings.wake && 'wakeLock' in navigator) {
      (navigator as any).wakeLock.request('screen').then((lock: any) => {
        wakeLock = lock;
      }).catch(() => {});
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [isPlaying, settings.wake]);

  // Handle scroll progress
  const handleScroll = () => {
    const el = lyricsRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (el.scrollTop / max) * 100)));
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTimeRef.current = performance.now();
    accScrollRef.current = 0;

    const loop = (ts: number) => {
      const el = lyricsRef.current;
      if (!el) return;

      const dt = Math.min(0.1, (ts - lastTimeRef.current) / 1000);
      lastTimeRef.current = ts;

      // Base speed px/sec
      let speed = 8 + settings.speed * 4.5;
      if (isListening) {
        speed = micActive ? speed * Math.min(1.8, Math.max(0.5, detectedBpm / song.bpm)) : 0;
      }

      accScrollRef.current += speed * dt;
      const px = Math.floor(accScrollRef.current);
      if (px > 0) {
        el.scrollTop += px;
        accScrollRef.current -= px;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          setIsPlaying(false);
          return;
        }
      }

      handleScroll();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, isListening, micActive, detectedBpm, settings.speed, song.bpm]);

  // Mic simulation / detection
  useEffect(() => {
    if (!isListening) {
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      setMicLevel(0);
      setMicActive(false);
      return;
    }

    // Attempt real audio or graceful simulation
    let micStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    const startMic = async () => {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        });
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtxClass();
        const src = audioCtx.createMediaStreamSource(micStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        src.connect(analyser);

        const buffer = new Float32Array(analyser.fftSize);
        let lastOnset = 0;
        const intervals: number[] = [];

        micIntervalRef.current = window.setInterval(() => {
          if (!analyser) return;
          analyser.getFloatTimeDomainData(buffer);
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
          const rms = Math.sqrt(sum / buffer.length);
          const threshold = 0.05 - settings.sens * 0.004;
          const now = performance.now();

          if (rms > threshold && now - lastOnset > 250) {
            if (lastOnset > 0) intervals.push(now - lastOnset);
            lastOnset = now;
            if (intervals.length > 5) intervals.shift();
            if (intervals.length >= 3) {
              const median = [...intervals].sort((a, b) => a - b)[intervals.length >> 1];
              let b = 60000 / median;
              while (b < 50) b *= 2;
              while (b > 200) b /= 2;
              setDetectedBpm(Math.round(b));
            }
          }

          const active = now - lastOnset < 2500;
          setMicActive(active);
          setMicLevel(Math.min(1, rms / (threshold * 3)));
        }, 60);
      } catch {
        // Fallback demo simulation
        const t0 = performance.now();
        micIntervalRef.current = window.setInterval(() => {
          const elapsed = (performance.now() - t0) / 1000;
          const active = (elapsed % 12) < 8.5;
          setMicActive(active);
          setDetectedBpm(Math.round(song.bpm * (1 + Math.sin(elapsed) * 0.05)));
          setMicLevel(active ? 0.3 + 0.6 * Math.abs(Math.sin(elapsed * 4)) : 0.05);
        }, 80);
      }
    };

    startMic();

    return () => {
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      if (micStream) micStream.getTracks().forEach((tr) => tr.stop());
      if (audioCtx) audioCtx.close().catch(() => {});
    };
  }, [isListening, settings.sens, song.bpm]);

  // Transposed key and chords
  const currentKey = transposeChord(song.key, songState.transpose, settings.notation);

  // Extract unique used chords
  const usedChords: string[] = [];
  song.parts.forEach(([, lines]) => {
    lines.forEach((l) => {
      const matches = l.match(/\[([^\]]+)\]/g) || [];
      matches.forEach((m) => {
        const raw = m.slice(1, -1);
        const transposed = transposeChord(raw, songState.transpose, settings.notation);
        if (!usedChords.includes(transposed)) {
          usedChords.push(transposed);
        }
      });
    });
  });

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg)] select-none overflow-hidden">
      {/* Top Header */}
      <header className="bg-[#7a2626] text-[#fff0e4] px-4 pt-3 pb-2.5 flex items-center justify-between gap-2 shadow-sm shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-1 rounded-full hover:bg-black/20 active:scale-90 transition-transform"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0 text-center px-1">
          <h1 className="font-display font-bold text-base sm:text-lg truncate leading-tight">
            {song.title}
          </h1>
          <p className="text-xs font-semibold opacity-85 truncate">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center gap-0.5 -mr-1">
          <button
            onClick={onToggleOffline}
            className={`p-2 rounded-full transition-transform active:scale-90 ${
              songState.off ? 'text-[#ffd9a8]' : 'text-[#fff0e4]/80'
            }`}
            aria-label={t.offline}
          >
            <Bookmark className="w-5 h-5" fill={songState.off ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-transform active:scale-90 ${
              songState.fav ? 'text-[#ffd9a8]' : 'text-[#fff0e4]/80'
            }`}
            aria-label={t.favs}
          >
            <Heart className="w-5 h-5" fill={songState.fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      {/* Scroll progress bar */}
      <div className="h-1 bg-black/10 shrink-0">
        <div
          className="h-full bg-[#ffd9a8] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sub-header toolbar: Mode Segment & Info */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--line)] bg-[var(--surface)] shrink-0">
        <div className="flex bg-[var(--bg)] p-0.5 rounded-xl border border-[var(--line)]">
          <button
            onClick={() => setView('chords')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              view === 'chords' ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            {t.chords}
          </button>
          <button
            onClick={() => setView('tabs')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              view === 'tabs' ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            {t.tabs}
          </button>
        </div>

        <div className="text-xs font-bold text-[var(--muted)] flex items-center gap-1.5">
          <span>{currentKey}</span>
          <span>·</span>
          <span>{song.bpm} {t.bpm}</span>
          {songState.transpose !== 0 && (
            <span className="text-[var(--chord)]">
              ({songState.transpose > 0 ? `+${songState.transpose}` : songState.transpose})
            </span>
          )}
        </div>
      </div>

      {/* Used Chords Pill Strip */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[var(--line)]/50">
        <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider shrink-0 mr-1">
          {t.key}:
        </span>
        {usedChords.map((chord) => (
          <span
            key={chord}
            className="px-2.5 py-0.5 rounded-lg border border-[var(--chord)] text-[var(--chord)] font-extrabold text-xs shrink-0 bg-[var(--surface)]"
          >
            {chord}
          </span>
        ))}
      </div>

      {/* Lyrics & Tablature Viewport */}
      <div
        ref={lyricsRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-4 pb-36 no-scrollbar"
        style={{ fontSize: `${settings.fontSize}px` }}
      >
        {/* Floating live audio equalizer pill when microphone mode is active */}
        {isPlaying && isListening && (
          <div className="sticky top-2 z-20 mx-auto w-max mb-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7a2626] text-[#fff0e4] text-xs font-bold shadow-lg">
            <div className="flex items-end gap-0.5 h-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-[#ffd9a8] rounded-full transition-all duration-100"
                  style={{
                    height: `${3 + micLevel * 10 * (0.6 + 0.4 * Math.sin(i * 1.5))}%`
                  }}
                />
              ))}
            </div>
            <span>
              {micActive
                ? `${t.listening} · ♩≈${detectedBpm}`
                : t.paused}
            </span>
          </div>
        )}

        {view === 'tabs' ? (
          <div className="space-y-6">
            <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
              <span className="text-xs font-bold text-[var(--muted)] block mb-1">
                TabFlow Tablature Engine:
              </span>
              <pre className="font-mono-code text-xs sm:text-sm font-semibold overflow-x-auto text-[var(--fg)] p-2 bg-black/5 dark:bg-white/5 rounded-xl">
                {GUITAR_TABS[song.tabIndex % GUITAR_TABS.length]}
              </pre>
            </div>

            {song.parts.map(([partName, lines], idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                    {partName}
                  </h3>
                  <div className="flex-1 h-[1px] bg-[var(--line)]" />
                </div>
                <div className="space-y-1 font-semibold text-sm">
                  {lines.map((line, lIdx) => (
                    <div key={lIdx} className="opacity-90">
                      {line.replace(/\[([^\]]+)\]/g, '$1 ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {song.parts.map(([partName, lines], idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                    {partName}
                  </h3>
                  <div className="flex-1 h-[1px] bg-[var(--line)]" />
                </div>

                <div className="space-y-2.5">
                  {lines.map((line, lIdx) => {
                    const tokens = line.split(/(\[[^\]]+\])/).filter(Boolean);
                    let pendingChord: string | null = null;
                    const segments: { chord: string; text: string }[] = [];

                    tokens.forEach((tok) => {
                      if (tok.startsWith('[')) {
                        if (pendingChord !== null) {
                          segments.push({ chord: pendingChord, text: '' });
                        }
                        pendingChord = tok.slice(1, -1);
                      } else {
                        segments.push({ chord: pendingChord || '', text: tok });
                        pendingChord = null;
                      }
                    });
                    if (pendingChord !== null) {
                      segments.push({ chord: pendingChord, text: '' });
                    }

                    return (
                      <div key={lIdx} className="leading-tight flex flex-wrap items-end font-semibold">
                        {segments.map((seg, sIdx) => (
                          <span key={sIdx} className="inline-flex flex-col align-top mr-1">
                            <span className="text-[var(--chord)] font-extrabold text-[0.88em] leading-tight min-h-[1.25em]">
                              {seg.chord
                                ? transposeChord(seg.chord, songState.transpose, settings.notation)
                                : '\u00A0'}
                            </span>
                            <span className="text-[var(--fg)]">
                              {seg.text || '\u00A0'}
                            </span>
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Control Dock matching PDF design */}
      <div className="relative z-30 bg-[#7a2626] text-[#fff0e4] px-4 py-3 rounded-t-3xl shadow-[0_-8px_25px_rgba(0,0,0,0.3)] flex items-center justify-between gap-3 shrink-0">
        {/* Key Transpose Stepper */}
        <div className="flex items-center bg-black/25 rounded-2xl p-1 gap-1">
          <button
            onClick={() => onTransposeChange(Math.max(-11, songState.transpose - 1))}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 active:scale-90 transition-transform"
            aria-label="Lower key"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="px-1 text-center min-w-[40px]">
            <span className="block text-[9px] font-black uppercase opacity-75 leading-none">
              {t.key}
            </span>
            <span className="font-extrabold text-sm leading-tight">
              {currentKey}
            </span>
          </div>
          <button
            onClick={() => onTransposeChange(Math.min(11, songState.transpose + 1))}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 active:scale-90 transition-transform"
            aria-label="Raise key"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Big Floating Play / Pause Action Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-[#fff0e4] text-[#7a2626] flex items-center justify-center shadow-xl border-4 border-[var(--bg)] -mt-9 active:scale-92 transition-transform cursor-pointer"
          aria-label={isPlaying ? t.stop : t.start}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          )}
        </button>

        {/* Right Action Icons: Microphone toggle and Tools sheet trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isListening;
              setIsListening(next);
              if (next && !isPlaying) setIsPlaying(true);
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
              isListening
                ? 'bg-[#fff0e4] text-[#7a2626] shadow-md'
                : 'bg-black/25 text-[#fff0e4] hover:bg-black/35'
            }`}
            title="Auto-scroll by sound"
            aria-label="Microphone auto-scroll"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => setToolsOpen(true)}
            className="w-11 h-11 rounded-2xl bg-black/25 text-[#fff0e4] flex items-center justify-center hover:bg-black/35 active:scale-90 transition-transform"
            aria-label={t.tools}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Tools Bottom Sheet Modal */}
      {toolsOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setToolsOpen(false)}
          />

          <div className="relative z-10 bg-[var(--bg)] rounded-t-3xl p-5 shadow-2xl border-t border-[var(--line)] space-y-4 max-h-[85%] overflow-y-auto no-scrollbar">
            <div className="w-10 h-1.5 bg-[var(--line)] rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[var(--fg)]">
                {t.tools}
              </h3>
              <button
                onClick={() => setToolsOpen(false)}
                className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--surface)] text-[var(--muted)]"
              >
                ✕
              </button>
            </div>

            {/* Scroll speed slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
                <span>{t.speed}</span>
                <span className="text-[var(--fg)]">{settings.speed}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.speed}
                onChange={(e) => onUpdateSettings({ speed: Number(e.target.value) })}
                className="w-full"
                style={{ '--p': `${((settings.speed - 1) / 9) * 100}%` } as any}
              />
            </div>

            {/* Font size slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
                <span>{t.textSize}</span>
                <span className="text-[var(--fg)]">{settings.fontSize} px</span>
              </div>
              <input
                type="range"
                min="14"
                max="28"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="w-full"
                style={{ '--p': `${((settings.fontSize - 14) / 14) * 100}%` } as any}
              />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => {
                  setToolsOpen(false);
                  onOpenTuner();
                }}
                className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-bold text-xs text-[var(--fg)] flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all"
              >
                🎸 {t.openTuner}
              </button>

              <button
                onClick={() => {
                  setToolsOpen(false);
                  onOpenMetronome();
                }}
                className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] font-bold text-xs text-[var(--fg)] flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all"
              >
                ⏱️ {t.openMetro} ({song.bpm})
              </button>
            </div>

            {/* Reset Key Button */}
            <button
              onClick={() => {
                onTransposeChange(0);
                setToolsOpen(false);
              }}
              className="w-full py-2.5 rounded-2xl border-2 border-[#7a2626] font-bold text-xs text-[var(--fg)] hover:bg-[#7a2626]/10 active:scale-98 transition-all"
            >
              {t.resetKey} ({song.key})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
