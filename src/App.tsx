import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppSettings, Song, Tab, SongUserState } from './types';
import { INITIAL_SONGS } from './data/songs';
import { TRANSLATIONS } from './utils/i18n';
import { SplashScreen } from './components/SplashScreen';
import { SongsScreen } from './components/SongsScreen';
import { SongDetailScreen } from './components/SongDetailScreen';
import { MetronomeScreen } from './components/MetronomeScreen';
import { TunerScreen } from './components/TunerScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  lang: 'ru',
  fontSize: 16,
  notation: 'en',
  sens: 6,
  speed: 5,
  wake: false,
  sound: 'click',
  accent: true,
  vib: true,
  vol: 80,
  a4: 440,
  tuning: 'std',
  bpm: 96,
  sig: 4,
  songs: {
    's-cold': { fav: true, off: true, transpose: 0 },
    's-scientist': { fav: true, off: false, transpose: 0 },
    's-wonderwall': { fav: false, off: true, transpose: 0 }
  }
};

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('tabflow_settings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          songs: { ...DEFAULT_SETTINGS.songs, ...(parsed.songs || {}) }
        };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [currentTab, setCurrentTab] = useState<Tab>('songs');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[settings.lang];

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('tabflow_settings_v2', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Handle Theme
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Show toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleFavorite = (songId: string) => {
    setSettings((prev) => {
      const curState = prev.songs[songId] || { fav: false, off: false, transpose: 0 };
      const nextFav = !curState.fav;
      showToast(nextFav ? t.tFav : t.tUnfav);
      return {
        ...prev,
        songs: {
          ...prev.songs,
          [songId]: { ...curState, fav: nextFav }
        }
      };
    });
  };

  const toggleOffline = (songId: string) => {
    setSettings((prev) => {
      const curState = prev.songs[songId] || { fav: false, off: false, transpose: 0 };
      const nextOff = !curState.off;
      showToast(nextOff ? t.tSaved : t.tUnsaved);
      return {
        ...prev,
        songs: {
          ...prev.songs,
          [songId]: { ...curState, off: nextOff }
        }
      };
    });
  };

  const handleTranspose = (songId: string, steps: number) => {
    setSettings((prev) => {
      const curState = prev.songs[songId] || { fav: false, off: false, transpose: 0 };
      return {
        ...prev,
        songs: {
          ...prev.songs,
          [songId]: { ...curState, transpose: steps }
        }
      };
    });
  };

  const clearOffline = () => {
    setSettings((prev) => {
      const updated: Record<string, SongUserState> = {};
      Object.keys(prev.songs).forEach((k) => {
        updated[k] = { ...prev.songs[k], off: false };
      });
      return { ...prev, songs: updated };
    });
    showToast(t.tCleared);
  };

  const resetAllSettings = () => {
    const keepLang = settings.lang;
    setSettings({ ...DEFAULT_SETTINGS, lang: keepLang });
    showToast(t.tReset);
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#241715] flex flex-col items-center justify-center p-0 sm:p-4 select-none relative font-body overflow-x-hidden">
      
      {/* Phone container wrapper: matches the PDF design (iPhone / Android mobile shell on desktop, 100% full-screen on mobile) */}
      <div
        className={`w-full h-screen h-[100dvh] sm:h-[844px] transition-all duration-300 relative overflow-hidden flex flex-col ${
          showDeviceFrame
            ? 'sm:max-w-[395px] sm:rounded-[44px] sm:border-[10px] sm:border-[#0e0908] sm:shadow-[0_25px_70px_rgba(0,0,0,0.65)]'
            : 'sm:max-w-md sm:rounded-3xl sm:border border-[var(--line)] sm:shadow-2xl'
        }`}
        style={{
          backgroundColor: 'var(--bg)'
        }}
      >
        {/* Speaker notch / Dynamic Island on desktop mock frame */}
        {showDeviceFrame && (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-24 h-4 bg-[#0e0908] rounded-full items-center justify-center pointer-events-none">
            <div className="w-8 h-1 bg-[#261816] rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1b100e] ml-2" />
          </div>
        )}

        {/* 1. Animated Splash Screen */}
        <AnimatePresence mode="wait">
          {showSplash && (
            <SplashScreen
              key="splash"
              lang={settings.lang}
              onFinish={() => setShowSplash(false)}
            />
          )}
        </AnimatePresence>

        {/* 2. Main Application Flow */}
        <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
          {activeSong ? (
            <SongDetailScreen
              song={activeSong}
              songState={settings.songs[activeSong.id] || { fav: false, off: false, transpose: 0 }}
              settings={settings}
              lang={settings.lang}
              onBack={() => setActiveSong(null)}
              onToggleFavorite={() => toggleFavorite(activeSong.id)}
              onToggleOffline={() => toggleOffline(activeSong.id)}
              onTransposeChange={(st) => handleTranspose(activeSong.id, st)}
              onOpenTuner={() => {
                setActiveSong(null);
                setCurrentTab('tuner');
              }}
              onOpenMetronome={() => {
                setActiveSong(null);
                setCurrentTab('metro');
              }}
              onUpdateSettings={updateSettings}
            />
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {currentTab === 'songs' && (
                <SongsScreen
                  songs={INITIAL_SONGS}
                  songStates={settings.songs}
                  lang={settings.lang}
                  onSelectSong={(s) => setActiveSong(s)}
                  onToggleFavorite={toggleFavorite}
                  onToggleOffline={toggleOffline}
                />
              )}

              {currentTab === 'metro' && (
                <MetronomeScreen
                  settings={settings}
                  lang={settings.lang}
                  onUpdateSettings={updateSettings}
                />
              )}

              {currentTab === 'tuner' && (
                <TunerScreen
                  settings={settings}
                  lang={settings.lang}
                  onUpdateSettings={updateSettings}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsScreen
                  settings={settings}
                  lang={settings.lang}
                  onUpdateSettings={updateSettings}
                  onResetSettings={resetAllSettings}
                  onClearOffline={clearOffline}
                  onReplaySplash={() => setShowSplash(true)}
                />
              )}
            </div>
          )}

          {/* Bottom Navigation (visible unless a song detail is open) */}
          {!activeSong && (
            <BottomNav
              currentTab={currentTab}
              lang={settings.lang}
              onTabChange={(tab) => setCurrentTab(tab)}
            />
          )}
        </div>

        {/* Home bar on desktop mock frame */}
        {showDeviceFrame && (
          <div className="hidden sm:block absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/40 rounded-full z-50 pointer-events-none" />
        )}

        {/* Toast Alert Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -16, x: '-50%' }}
              transition={{ duration: 0.25 }}
              className="absolute top-16 left-1/2 z-50 bg-[#1d1210] text-[#fff0e4] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl border border-white/10 max-w-[85%] text-center pointer-events-none"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outer desktop controls bar */}
      <div className="hidden sm:flex items-center gap-4 mt-3 text-xs font-semibold text-[#f5d5b8]/70">
        <span>TabFlow Mobile Web App</span>
        <span>·</span>
        <button
          onClick={() => setShowSplash(true)}
          className="hover:text-[#fff0e4] underline cursor-pointer"
        >
          {t.replaySplash}
        </button>
        <span>·</span>
        <button
          onClick={() => setShowDeviceFrame(!showDeviceFrame)}
          className="hover:text-[#fff0e4] underline cursor-pointer"
        >
          {showDeviceFrame ? 'Полный экран' : 'В рамке телефона'}
        </button>
      </div>
    </div>
  );
}
