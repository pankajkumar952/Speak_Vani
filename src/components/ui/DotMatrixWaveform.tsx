import React, { useState, useEffect } from 'react';

interface DotMatrixWaveformProps {
  isLive?: boolean;
  className?: string;
}

export const DotMatrixWaveform: React.FC<DotMatrixWaveformProps> = ({
  isLive = true,
  className = '',
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, [isLive]);

  // 15 vertical bar columns of 7 dots each, oscillating in soundwave formation
  const columns = 17;
  const rows = 7;

  return (
    <div className={`inline-flex items-center justify-center p-4 rounded-2xl editorial-surface select-none ${className}`}>
      <div className="flex items-center gap-2">
        {Array.from({ length: columns }).map((_, colIdx) => {
          // Calculate height amplitude based on sine wave with center peak
          const distFromCenter = Math.abs(colIdx - (columns - 1) / 2);
          const baseHeight = Math.max(1, 4 - distFromCenter * 0.4);
          const waveOffset = isLive ? Math.sin((frame * 0.2) + colIdx * 0.5) * 1.8 : 0;
          const activeDotCount = Math.min(rows, Math.max(1, Math.round(baseHeight + waveOffset)));

          return (
            <div key={colIdx} className="flex flex-col items-center gap-1.5">
              {Array.from({ length: rows }).map((_, rowIdx) => {
                const isDotActive = Math.abs(rowIdx - Math.floor(rows / 2)) < activeDotCount / 2;
                return (
                  <span
                    key={rowIdx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                      isDotActive
                        ? 'bg-[#0d9488] scale-110 opacity-90'
                        : 'bg-slate-300 dark:bg-zinc-700/60 opacity-30 scale-75'
                    }`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
