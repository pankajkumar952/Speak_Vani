import React from 'react';

interface SpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
  disabled?: boolean;
}

export const SpinButton: React.FC<SpinButtonProps> = ({
  onClick,
  isSpinning,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isSpinning}
      className={`relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 text-white font-extrabold text-lg sm:text-xl tracking-wider shadow-2xl border-4 border-slate-900 transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center group ${
        isSpinning ? 'opacity-80 cursor-not-allowed animate-pulse' : 'hover:scale-105 hover:shadow-indigo-500/40 cursor-pointer'
      }`}
    >
      {/* Glow pulse ring around button */}
      {!isSpinning && (
        <span className="absolute inset-0 rounded-full border-2 border-indigo-400/60 animate-ping pointer-events-none opacity-60" />
      )}
      <span className="drop-shadow-md">
        {isSpinning ? 'SPINNING' : 'SPIN'}
      </span>
    </button>
  );
};
