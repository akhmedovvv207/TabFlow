import React from 'react';
import { Volume2, Minus, Plus, RefreshCw } from 'lucide-react';
import { AppSettings, Language, Theme, MetroSound, TuningPreset } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { getAudioContext, playMetronomeClick } from '../utils/audio';

interface SettingsScreenProps {
  settings: AppSettings;
  lang: Language;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onResetSettings: () => void;
  onClearOffline: () => void;
  onReplaySplash?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  lang,
  onUpdateSettings,
  onResetSettings,
  onClearOffline
}) => {
  const t = TRANSLATIONS[lang];
  const offlineCount = Object.values(settings.songs).filter((s) => s.off).length;

  const testSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + 0.05;
    for (let i = 0; i < 4; i++) {
      playMetronomeClick(t0 + i * 0.3, i === 0 && settings.accent, settings.sound, settings.vol);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] select-none">
      {/* Top Header */}
      <header className="bg-[#7a2626] text-[#fff0e4] px-5 pt-4 pb-3 flex items-center justify-between shadow-sm shrink-0">
        <h1 className="font-display font-bold text-2xl tracking-tight">
          {t.settings}
        </h1>
      </header>

      {/* Main settings scroll container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-5 no-scrollbar">
        {/* Group 1: Appearance */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--chord)] px-1">
            {t.gApp}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-4 shadow-sm">
            {/* Theme */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.theme}
              </span>
              <div className="grid grid-cols-3 bg-[var(--bg)] p-1 rounded-xl border border-[var(--line)] gap-1">
                {[
                  { id: 'system', label: t.tSys },
                  { id: 'light', label: t.tLight },
                  { id: 'dark', label: t.tDark }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ theme: item.id as Theme })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settings.theme === item.id
                        ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.lang}
              </span>
              <div className="grid grid-cols-2 bg-[var(--bg)] p-1 rounded-xl border border-[var(--line)] gap-1">
                {[
                  { id: 'ru', label: 'Русский' },
                  { id: 'en', label: 'English' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ lang: item.id as Language })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settings.lang === item.id
                        ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[var(--fg)]">
                <span>{t.fontSize}</span>
                <span className="text-[var(--muted)]">{settings.fontSize} px</span>
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
              <div
                className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] font-semibold transition-all"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <span className="text-[var(--chord)] font-extrabold mr-2">Am</span>
                <span>{t.sample}</span>
                <span className="text-[var(--chord)] font-extrabold mx-2">F</span>
                <span>TabFlow</span>
              </div>
            </div>
          </div>
        </section>

        {/* Group 2: Auto-scroll & Microphone */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--chord)] px-1">
            {t.gScroll}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-4 shadow-sm">
            {/* Sensitivity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[var(--fg)]">
                <span>{t.sens}</span>
                <span className="text-[var(--muted)]">{settings.sens} / 10</span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                {t.sensD}
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.sens}
                onChange={(e) => onUpdateSettings({ sens: Number(e.target.value) })}
                className="w-full"
                style={{ '--p': `${((settings.sens - 1) / 9) * 100}%` } as any}
              />
            </div>

            {/* Default Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[var(--fg)]">
                <span>{t.defSpeed}</span>
                <span className="text-[var(--muted)]">{settings.speed}</span>
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

            {/* Keep screen on */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="block text-xs sm:text-sm font-bold text-[var(--fg)]">
                  {t.wake}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {t.wakeD}
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ wake: !settings.wake })}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                  settings.wake ? 'bg-[#7a2626]' : 'bg-[var(--line)]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    settings.wake ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Group 3: Metronome Settings */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--chord)] px-1">
            {t.gMetro}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-4 shadow-sm">
            {/* Click Sound */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                  {t.sound}
                </span>
                <button
                  onClick={testSound}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-bold text-[var(--chord)] hover:bg-[#7a2626]/10 active:scale-95 transition-all"
                >
                  ♪ {lang === 'ru' ? 'Тест звука' : 'Test sound'}
                </button>
              </div>
              <div className="grid grid-cols-3 bg-[var(--bg)] p-1 rounded-xl border border-[var(--line)] gap-1">
                {[
                  { id: 'click', label: t.sClick },
                  { id: 'wood', label: t.sWood },
                  { id: 'beep', label: t.sBeep }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ sound: item.id as MetroSound })}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settings.sound === item.id
                        ? 'bg-[#7a2626] text-[#fff0e4] shadow-sm'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent first beat */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.accent}
              </span>
              <button
                onClick={() => onUpdateSettings({ accent: !settings.accent })}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                  settings.accent ? 'bg-[#7a2626]' : 'bg-[var(--line)]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    settings.accent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.vib}
              </span>
              <button
                onClick={() => onUpdateSettings({ vib: !settings.vib })}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                  settings.vib ? 'bg-[#7a2626]' : 'bg-[var(--line)]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    settings.vib ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[var(--fg)]">
                <span>{t.vol}</span>
                <span className="text-[var(--muted)]">{settings.vol}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.vol}
                onChange={(e) => onUpdateSettings({ vol: Number(e.target.value) })}
                className="w-full"
                style={{ '--p': `${settings.vol}%` } as any}
              />
            </div>
          </div>
        </section>

        {/* Group 4: Tuner Settings */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--chord)] px-1">
            {t.gTuner}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-4 shadow-sm">
            {/* A4 calibration */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.a4}
              </span>
              <div className="flex items-center gap-2 bg-[var(--bg)] p-1 rounded-xl border border-[var(--line)]">
                <button
                  onClick={() => onUpdateSettings({ a4: Math.max(430, settings.a4 - 1) })}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-sm tabular-nums min-w-[54px] text-center">
                  {settings.a4} Hz
                </span>
                <button
                  onClick={() => onUpdateSettings({ a4: Math.min(450, settings.a4 + 1) })}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Default Tuning */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                {t.presetDef}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'std', label: t.pStd },
                  { id: 'drop', label: t.pDrop },
                  { id: 'half', label: t.pHalf },
                  { id: 'dad', label: t.pDad }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ tuning: item.id as TuningPreset })}
                    className={`p-2 rounded-xl text-xs font-bold transition-all border text-left ${
                      settings.tuning === item.id
                        ? 'bg-[#7a2626] text-[#fff0e4] border-[#7a2626] shadow-sm'
                        : 'bg-[var(--bg)] text-[var(--muted)] border-[var(--line)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Group 5: Data & Reset */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--chord)] px-1">
            {t.gData}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-3.5 shadow-sm">
            {/* Offline songs */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs sm:text-sm font-bold text-[var(--fg)]">
                  {t.offCount}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {t.offN(offlineCount)}
                </span>
              </div>
              <button
                onClick={onClearOffline}
                disabled={offlineCount === 0}
                className="px-3 py-1.5 rounded-xl border border-[var(--line)] font-bold text-xs text-[var(--fg)] hover:bg-[#7a2626]/10 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                {t.clearOff}
              </button>
            </div>

            {/* Reset settings */}
            <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]">
              <div>
                <span className="block text-xs sm:text-sm font-bold text-[var(--fg)]">
                  {t.reset}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {t.resetD}
                </span>
              </div>
              <button
                onClick={onResetSettings}
                className="px-4 py-1.5 rounded-xl bg-[#7a2626] font-bold text-xs text-[#fff0e4] active:scale-95 transition-all shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </section>

        {/* Footer version notice */}
        <div className="text-center text-xs font-bold text-[var(--muted)] pt-2 pb-4">
          {t.ver}
        </div>
      </div>
    </div>
  );
};
