import React from 'react';
import { Music, Activity, Disc, Settings as SettingsIcon } from 'lucide-react';
import { Tab, Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface BottomNavProps {
  currentTab: Tab;
  lang: Language;
  onTabChange: (tab: Tab) => void;
  isMetronomeActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  lang,
  onTabChange,
  isMetronomeActive = false
}) => {
  const t = TRANSLATIONS[lang];

  // Custom Metronome SVG icon matching page 3 & 4 of PDF
  const MetronomeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M 8 21 L 10 3 H 14 L 16 21 Z" />
      <path d="M 12 17 L 16 8" />
      <path d="M 9 14 H 15" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );

  // Custom Tuner SVG icon matching page 3 & 4 of PDF
  const TunerIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M 7 9 H 17" />
      <path d="M 7 12 H 17" />
      <path d="M 7 15 H 17" />
      <circle cx="14" cy="9" r="1.6" fill="currentColor" />
      <circle cx="9" cy="12" r="1.6" fill="currentColor" />
      <circle cx="15" cy="15" r="1.6" fill="currentColor" />
    </svg>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode; pulse?: boolean }[] = [
    {
      id: 'songs',
      label: t.songs,
      icon: <Music className="w-5 h-5" strokeWidth={2.2} />
    },
    {
      id: 'metro',
      label: t.metronome,
      icon: <MetronomeIcon className="w-5 h-5" />,
      pulse: isMetronomeActive && currentTab !== 'metro'
    },
    {
      id: 'tuner',
      label: t.tuner,
      icon: <TunerIcon className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: t.settings,
      icon: <SettingsIcon className="w-5 h-5" strokeWidth={2.2} />
    }
  ];

  return (
    <nav className="bg-[#7a2626] text-[#fff0e4] px-3 pt-2 pb-2.5 flex items-center justify-around gap-1 shrink-0 z-40 border-t border-black/15 shadow-[0_-4px_16px_rgba(0,0,0,0.18)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl relative transition-all active:scale-92 ${
              isActive
                ? 'bg-black/30 text-[#fff0e4] font-extrabold shadow-inner'
                : 'text-[#fff0e4]/80 hover:text-[#fff0e4] font-bold'
            }`}
            aria-label={tab.label}
          >
            <div className="relative">
              {tab.icon}
              {tab.pulse && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ffd9a8] animate-ping" />
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight mt-1 truncate max-w-full">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
