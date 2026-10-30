import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface SplashScreenProps {
  lang: Language;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ lang, onFinish }) => {
  const t = TRANSLATIONS[lang];
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Allow instant tap-to-skip after 500ms
    const skipTimer = setTimeout(() => setCanSkip(true), 400);
    // Auto-advance after 2.8s
    const advanceTimer = setTimeout(() => {
      onFinish();
    }, 2900);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(advanceTimer);
    };
  }, [onFinish]);

  const handleInteraction = () => {
    if (canSkip) {
      onFinish();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.3 }}
      onClick={handleInteraction}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#7a2626] text-[#fff0e4] cursor-pointer select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #8c2e2e 0%, #7a2626 55%, #591919 100%)'
      }}
    >
      {/* Background ambient texture / subtle sound aura */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top / Brand Zone matching PDF Page 4 */}
      <div className="relative z-10 flex flex-col items-center pt-16 sm:pt-20 px-6 w-full max-w-sm">
        {/* Animated Brand Wordmark and Waveform */}
        <div className="w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.9, 0.25, 1] }}
            className="flex items-center justify-center gap-1"
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#fff0e4] drop-shadow-sm">
              TabFlow
            </h1>
          </motion.div>

          {/* Soundwave pulse stroke underneath logo as shown in PDF Page 4 */}
          <div className="w-full max-w-[280px] mt-2 mb-2">
            <svg viewBox="0 0 280 48" fill="none" className="w-full overflow-visible">
              <defs>
                <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd9a8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#fff0e4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffd9a8" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 4 24 L 62 24 L 70 12 L 80 38 L 90 2 L 100 44 L 110 16 L 118 24 L 276 24"
                stroke="url(#waveGlow)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.35, ease: 'easeInOut' }}
              />
              {/* Secondary baseline line */}
              <motion.line
                x1="20"
                y1="34"
                x2="260"
                y2="34"
                stroke="rgba(255, 240, 228, 0.28)"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.8, ease: 'easeOut' }}
              />
            </svg>
          </div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
            className="font-display text-sm sm:text-base font-semibold tracking-wide text-[#ffe8d6] text-center"
          >
            {t.slogan}
          </motion.p>
        </div>
      </div>

      {/* Middle / Center Three Guitar Headstocks matching PDF Page 4 Screenshot */}
      <div className="relative w-full flex-1 flex items-end justify-center px-4 overflow-hidden">
        <div className="relative w-full max-w-[340px] h-[320px] sm:h-[350px] flex items-end justify-center">
          
          {/* 1. Left: Electric Guitar Headstock (Fender Strat Style, 6-in-line) */}
          <motion.div
            initial={{ y: 340, opacity: 0, rotate: -18 }}
            animate={{ y: 0, opacity: 1, rotate: -12 }}
            transition={{
              type: 'spring',
              stiffness: 110,
              damping: 14,
              mass: 0.9,
              delay: 0.45
            }}
            className="absolute left-[3%] bottom-[-10px] w-[95px] sm:w-[105px] origin-bottom z-10"
          >
            <svg viewBox="0 0 100 240" fill="none" className="w-full drop-shadow-2xl">
              {/* Neck wood */}
              <path d="M 28 80 L 28 240 L 72 240 L 72 80 Z" fill="#fff0e4" />
              {/* Fretboard frets */}
              <line x1="28" y1="100" x2="72" y2="100" stroke="#7a2626" strokeWidth="2" />
              <line x1="28" y1="125" x2="72" y2="125" stroke="#7a2626" strokeWidth="2" />
              <line x1="28" y1="155" x2="72" y2="155" stroke="#7a2626" strokeWidth="2.2" />
              <line x1="28" y1="190" x2="72" y2="190" stroke="#7a2626" strokeWidth="2.4" />
              <line x1="28" y1="225" x2="72" y2="225" stroke="#7a2626" strokeWidth="2.5" />
              {/* Position dot markers */}
              <circle cx="50" cy="140" r="3.5" fill="#7a2626" />
              <circle cx="50" cy="207" r="3.5" fill="#7a2626" />
              
              {/* Nut */}
              <rect x="26" y="74" width="48" height="6" rx="2" fill="#3a1010" />

              {/* Strat Headstock outline */}
              <path
                d="M 28 74 C 24 50, 16 35, 14 18 C 13 8, 24 4, 34 5 C 48 6, 68 18, 70 32 C 72 44, 73 60, 72 74 Z"
                fill="#fff0e4"
              />
              <path
                d="M 28 74 C 24 50, 16 35, 14 18 C 13 8, 24 4, 34 5 C 48 6, 68 18, 70 32 C 72 44, 73 60, 72 74"
                stroke="#6d2020"
                strokeWidth="1.5"
              />

              {/* 6 Tuning Pegs along the left side */}
              {[14, 25, 36, 47, 58, 69].map((y, i) => (
                <g key={`peg-strat-${i}`}>
                  {/* Peg post */}
                  <rect x="7" y={y - 2} width="8" height="4" rx="1.5" fill="#e8d0bc" stroke="#591919" strokeWidth="1" />
                  {/* Peg button */}
                  <circle cx="4" cy={y} r="3.8" fill="#fff0e4" stroke="#591919" strokeWidth="1.2" />
                  <circle cx="38" cy={y - 2} r="2.2" fill="#591919" />
                </g>
              ))}

              {/* 6 Guitar strings running straight down */}
              {[32, 38, 44, 50, 56, 62].map((x, i) => (
                <line
                  key={`str-strat-${i}`}
                  x1={x}
                  y1={20 + i * 8}
                  x2={x}
                  y2="240"
                  stroke="#591919"
                  strokeWidth={1.2 + (5 - i) * 0.25}
                  strokeOpacity="0.85"
                />
              ))}
            </svg>
          </motion.div>

          {/* 2. Middle: Classical Spanish Slotted Headstock (Center & Proud) */}
          <motion.div
            initial={{ y: 350, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 105,
              damping: 13,
              mass: 1,
              delay: 0.6
            }}
            className="relative z-20 w-[115px] sm:w-[125px] origin-bottom mb-[-6px]"
          >
            <svg viewBox="0 0 110 260" fill="none" className="w-full drop-shadow-2xl">
              {/* Neck body */}
              <rect x="25" y="90" width="60" height="170" fill="#fff0e4" />
              {/* Frets */}
              <line x1="25" y1="110" x2="85" y2="110" stroke="#7a2626" strokeWidth="2.2" />
              <line x1="25" y1="138" x2="85" y2="138" stroke="#7a2626" strokeWidth="2.4" />
              <line x1="25" y1="172" x2="85" y2="172" stroke="#7a2626" strokeWidth="2.6" />
              <line x1="25" y1="210" x2="85" y2="210" stroke="#7a2626" strokeWidth="2.8" />
              <line x1="25" y1="248" x2="85" y2="248" stroke="#7a2626" strokeWidth="3" />
              
              {/* Classical bone nut */}
              <rect x="22" y="84" width="66" height="7" rx="2" fill="#fffaf5" stroke="#7a2626" strokeWidth="1" />

              {/* Headstock body */}
              <path
                d="M 24 84 L 20 22 C 20 10, 34 6, 55 6 C 76 6, 90 10, 90 22 L 86 84 Z"
                fill="#fff0e4"
                stroke="#6d2020"
                strokeWidth="1.5"
              />

              {/* Two classical slot cutouts */}
              <rect x="33" y="18" width="16" height="56" rx="4" fill="#7a2626" />
              <rect x="61" y="18" width="16" height="56" rx="4" fill="#7a2626" />

              {/* Horizontal rollers in slots */}
              {[28, 45, 62].map((y, i) => (
                <g key={`roller-${i}`}>
                  <rect x="31" y={y - 2} width="20" height="4.5" rx="1.5" fill="#e8d0bc" />
                  <rect x="59" y={y - 2} width="20" height="4.5" rx="1.5" fill="#e8d0bc" />
                  {/* Left peg knob */}
                  <circle cx="8" cy={y} r="5" fill="#fff0e4" stroke="#591919" strokeWidth="1.4" />
                  <line x1="12" y1={y} x2="20" y2={y} stroke="#7a2626" strokeWidth="2" />
                  {/* Right peg knob */}
                  <circle cx="102" cy={y} r="5" fill="#fff0e4" stroke="#591919" strokeWidth="1.4" />
                  <line x1="90" y1={y} x2="98" y2={y} stroke="#7a2626" strokeWidth="2" />
                </g>
              ))}

              {/* 6 strings routed to rollers and down the fretboard */}
              {[30, 38, 46, 64, 72, 80].map((x, i) => (
                <line
                  key={`str-class-${i}`}
                  x1={x}
                  y1={28 + (i % 3) * 17}
                  x2={x}
                  y2="260"
                  stroke="#7a2626"
                  strokeWidth={1.2 + (5 - i) * 0.3}
                  strokeOpacity="0.9"
                />
              ))}
            </svg>
          </motion.div>

          {/* 3. Right: Acoustic 3+3 Crown Headstock (Dreadnought / Acoustic) */}
          <motion.div
            initial={{ y: 340, opacity: 0, rotate: 18 }}
            animate={{ y: 0, opacity: 1, rotate: 12 }}
            transition={{
              type: 'spring',
              stiffness: 110,
              damping: 14,
              mass: 0.9,
              delay: 0.75
            }}
            className="absolute right-[3%] bottom-[-10px] w-[95px] sm:w-[105px] origin-bottom z-10"
          >
            <svg viewBox="0 0 100 240" fill="none" className="w-full drop-shadow-2xl">
              {/* Neck body */}
              <rect x="28" y="80" width="44" height="160" fill="#fff0e4" />
              {/* Frets */}
              <line x1="28" y1="102" x2="72" y2="102" stroke="#7a2626" strokeWidth="2" />
              <line x1="28" y1="130" x2="72" y2="130" stroke="#7a2626" strokeWidth="2.2" />
              <line x1="28" y1="164" x2="72" y2="164" stroke="#7a2626" strokeWidth="2.4" />
              <line x1="28" y1="202" x2="72" y2="202" stroke="#7a2626" strokeWidth="2.6" />
              {/* Fret marker dot */}
              <circle cx="50" cy="147" r="3.5" fill="#7a2626" />
              
              {/* Nut */}
              <rect x="26" y="74" width="48" height="6" rx="2" fill="#4d1616" />

              {/* Crown profile headstock */}
              <path
                d="M 28 74 C 20 60, 16 40, 18 18 C 28 8, 44 14, 50 8 C 56 14, 72 8, 82 18 C 84 40, 80 60, 72 74 Z"
                fill="#fff0e4"
                stroke="#6d2020"
                strokeWidth="1.5"
              />

              {/* Truss rod cover badge */}
              <path d="M 46 64 L 54 64 L 52 50 L 48 50 Z" fill="#7a2626" />
              <circle cx="50" cy="62" r="1" fill="#fff" />

              {/* 3 Left tuning pegs */}
              {[22, 38, 54].map((y, i) => (
                <g key={`peg-ac-l-${i}`}>
                  <rect x="9" y={y - 2} width="8" height="4" rx="1.5" fill="#e8d0bc" />
                  <circle cx="6" cy={y} r="4" fill="#fff0e4" stroke="#591919" strokeWidth="1.2" />
                  <circle cx="32" cy={y + 1} r="2.2" fill="#591919" />
                </g>
              ))}

              {/* 3 Right tuning pegs */}
              {[22, 38, 54].map((y, i) => (
                <g key={`peg-ac-r-${i}`}>
                  <rect x="83" y={y - 2} width="8" height="4" rx="1.5" fill="#e8d0bc" />
                  <circle cx="94" cy={y} r="4" fill="#fff0e4" stroke="#591919" strokeWidth="1.2" />
                  <circle cx="68" cy={y + 1} r="2.2" fill="#591919" />
                </g>
              ))}

              {/* 6 Strings */}
              {[33, 39, 45, 55, 61, 67].map((x, i) => (
                <line
                  key={`str-ac-${i}`}
                  x1={x}
                  y1={24 + (i < 3 ? i : 5 - i) * 14}
                  x2={x}
                  y2="240"
                  stroke="#591919"
                  strokeWidth={1.2 + (5 - i) * 0.25}
                  strokeOpacity="0.85"
                />
              ))}
            </svg>
          </motion.div>

        </div>
      </div>

      {/* Bottom hint / skip affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="relative z-10 pb-7 text-xs font-semibold tracking-wider text-[#ffe4cf] text-center"
      >
        {t.tapStart}
      </motion.div>
    </motion.div>
  );
};
