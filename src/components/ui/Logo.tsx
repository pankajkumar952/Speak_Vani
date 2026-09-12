import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';

export interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  to?: string;
  className?: string;
  imgClassName?: string;
  alt?: string;
  isRecording?: boolean;
  showWaveform?: boolean;
}

/**
 * SpeakVaani wordmark — an original inline SVG mark (no external image assets),
 * built from the app's own theme tokens so it re-colors automatically for
 * light/dark mode and any future palette change.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  to = '/',
  className = '',
  imgClassName = '',
  alt = 'SpeakVaani',
  isRecording = false,
  showWaveform = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const gradientId = useId();

  const fullSizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const waveActive = isRecording || isHovered || showWaveform;
  const sizeClass = variant === 'icon' ? iconSizeClasses[size] : fullSizeClasses[size];

  // Icon-only mark: a stylised "V" (for Vaani) cradling a sound wave.
  const iconMark = (
    <svg
      viewBox="0 0 48 48"
      className={`${sizeClass} w-auto ${imgClassName}`}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id={`${gradientId}-icon`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="55%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="13" fill={`url(#${gradientId}-icon)`} />
      <path
        d="M13 14 L24 34 L35 14"
        fill="none"
        stroke="white"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="34" r="2.6" fill="white" />
    </svg>
  );

  // Full wordmark: mark + "SpeakVaani" text set in the brand display font.
  const fullMark = (
    <svg
      viewBox="0 0 220 44"
      className={`${sizeClass} w-auto ${imgClassName}`}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id={`${gradientId}-full`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="55%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect x="0" y="2" width="40" height="40" rx="11" fill={`url(#${gradientId}-full)`} />
      <path
        d="M11 13 L20 30 L29 13"
        fill="none"
        stroke="white"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="30" r="2.2" fill="white" />
      <text
        x="50"
        y="30"
        fontFamily="'Outfit', sans-serif"
        fontWeight="700"
        fontSize="26"
        fill="var(--text-primary)"
      >
        Speak
        <tspan fill={`url(#${gradientId}-full)`}>Vaani</tspan>
      </text>
    </svg>
  );

  const content = (
    <div
      className={`relative inline-flex items-center gap-2 select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="transition-transform duration-200 group-hover:scale-[1.03]">
        {variant === 'icon' ? iconMark : fullMark}
      </div>

      {/* Animated Acoustic Waveform Indicator */}
      {(waveActive || isRecording) && (
        <div
          className="flex items-end gap-0.5 h-5 px-1 py-0.5 rounded-full bg-teal-500/10 dark:bg-teal-400/15 border border-teal-500/20 transition-all duration-300"
          title={isRecording ? 'Active Speech Recording' : 'SpeakVaani Voice Engine'}
        >
          <span className="w-1 bg-gradient-to-t from-indigo-600 to-cyan-500 rounded-full animate-audio-bar-1" />
          <span className="w-1 bg-gradient-to-t from-cyan-600 to-emerald-500 rounded-full animate-audio-bar-2" />
          <span className="w-1 bg-gradient-to-t from-indigo-500 to-emerald-400 rounded-full animate-audio-bar-3" />
          <span className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-audio-bar-4" />
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-teal-500/40 rounded-lg group transition-transform duration-150 active:scale-[0.98]"
        aria-label="SpeakVaani Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};
