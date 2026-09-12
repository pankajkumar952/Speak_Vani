import React, { useEffect, useRef } from 'react';
import { playCountdownTick, playKidsCountdownTick, playCountdownStart } from '../../utils/sound';

export interface CountdownOverlayProps {
  /** Current countdown digit: 3, 2, 1 → 0 = GO stage → null = hidden / recording */
  count: number | null;
  isKidsMode?: boolean;
  soundEnabled?: boolean;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  count,
  isKidsMode = false,
  soundEnabled = true,
}) => {
  const prevCountRef = useRef<number | null>(null);

  // Sound effects on digit change
  useEffect(() => {
    if (count === null) return;
    if (count === prevCountRef.current) return;
    prevCountRef.current = count;

    if (soundEnabled) {
      if (count > 0) {
        if (isKidsMode) {
          playKidsCountdownTick(count === 1);
        } else {
          playCountdownTick(count === 1);
        }
      } else if (count === 0) {
        playCountdownStart(isKidsMode);
      }
    }
  }, [count, isKidsMode, soundEnabled]);

  if (count === null) return null;

  const isGo = count === 0;

  // Subtitle hints for each countdown state
  const subtitle = isGo
    ? isKidsMode ? "Let's go! Start talking!" : "Start speaking now"
    : count === 3
    ? isKidsMode ? "Get ready to share your story!" : "Get ready..."
    : count === 2
    ? isKidsMode ? "Think of your cool ideas!" : "Focus your thoughts..."
    : isKidsMode ? "Take a deep breath!" : "Take a breath...";

  const stateHeader = isGo ? 'GO' : 'READY';

  return (
    <div
      className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-white/20 shadow-2xl text-center select-none w-full max-w-sm mx-auto transition-all duration-300 animate-in fade-in zoom-in-95"
      role="status"
      aria-live="polite"
      aria-label={isGo ? 'Start speaking' : `Get ready: ${count}`}
    >
      {/* State Badge */}
      <span className={`text-[11px] font-extrabold uppercase tracking-[0.25em] mb-1 ${
        isGo
          ? 'text-emerald-400 font-black'
          : isKidsMode
          ? 'text-amber-300'
          : 'text-[#0d9488]'
      }`}>
        {stateHeader}
      </span>

      {/* Main Countdown Display */}
      <div className="my-1 flex items-center justify-center h-20">
        {isGo ? (
          <div className="flex items-center gap-2 text-4xl sm:text-5xl font-display font-black text-emerald-400 tracking-wider animate-pulse">
            <span>GO!</span>
            <span>🎙</span>
          </div>
        ) : (
          <span className="font-mono text-6xl sm:text-7xl font-black text-white tabular-nums tracking-tight filter drop-shadow-md">
            {count}
          </span>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-300 font-medium max-w-[220px]">
        {subtitle}
      </p>

      {/* Segmented Dots Indicator */}
      {!isGo && (
        <div className="flex items-center gap-2 mt-4">
          {[3, 2, 1].map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                step >= count
                  ? isKidsMode
                    ? 'bg-amber-400 scale-110 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'bg-[#0d9488] scale-110 shadow-[0_0_8px_rgba(217,119,87,0.8)]'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
