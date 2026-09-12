import React from 'react';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number; // width/height in px
  strokeWidth?: number;
  label?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Overall Score',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color theme based on score
  let ringColor = 'stroke-indigo-600 dark:stroke-indigo-400';
  if (score >= 90) ringColor = 'stroke-emerald-500';
  else if (score < 70) ringColor = 'stroke-amber-500';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle track */}
          <circle
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated score circle */}
          <circle
            className={`${ringColor} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
};
