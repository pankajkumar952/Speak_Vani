import React, { useState } from 'react';
import type { PromptFontSize, PromptOpacity, PromptPosition } from '../../types';
import { Type, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface FloatingPromptProps {
  promptText: string;
  category?: string;
  fontSize?: PromptFontSize;
  opacity?: PromptOpacity;
  position?: PromptPosition;
  isHidden?: boolean;
  onConfigChange?: (config: {
    fontSize?: PromptFontSize;
    opacity?: PromptOpacity;
    position?: PromptPosition;
    isHidden?: boolean;
  }) => void;
}

export const FloatingPrompt: React.FC<FloatingPromptProps> = ({
  promptText,
  category = 'Speaking Prompt',
  fontSize = 'md',
  opacity = 'medium',
  position = 'top',
  isHidden = false,
  onConfigChange,
}) => {
  const [showControls, setShowControls] = useState(false);

  if (isHidden) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => onConfigChange?.({ isHidden: false })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/20 hover:bg-slate-900 transition-all shadow-lg"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>Show Prompt</span>
        </button>
      </div>
    );
  }

  // Positioning classes
  const positionClasses: Record<PromptPosition, string> = {
    top: 'top-6 sm:top-8 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    middle: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2',
  };

  // Font size classes
  const fontClasses: Record<PromptFontSize, string> = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg font-medium leading-snug',
    md: 'text-base sm:text-lg md:text-xl font-medium leading-snug',
    lg: 'text-lg sm:text-xl md:text-2xl font-semibold leading-snug',
    xl: 'text-xl sm:text-2xl font-bold leading-snug',
  };

  // Opacity classes
  const opacityClasses: Record<PromptOpacity, string> = {
    low: 'bg-slate-950/60 backdrop-blur-sm border-white/10',
    translucent: 'bg-slate-950/60 backdrop-blur-sm border-white/10',
    medium: 'bg-slate-950/80 backdrop-blur-md border-white/20',
    high: 'bg-slate-950/95 backdrop-blur-xl border-white/30',
    solid: 'bg-slate-950/95 backdrop-blur-xl border-white/30',
  };


  return (
    <div
      className={`absolute z-30 w-[92%] max-w-xl transition-all duration-300 animate-float ${positionClasses[position]}`}
    >
      <div
        className={`relative p-5 sm:p-6 rounded-2xl text-white shadow-2xl border ${opacityClasses[opacity]}`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300/90">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowControls(!showControls)}
              title="Customize Teleprompter Prompt"
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
            >
              <Type className="w-3 h-3 text-indigo-300" />
              <span>Prompt Controls</span>
              {showControls ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => onConfigChange?.({ isHidden: true })}
              title="Hide Prompt"
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Prompt Main Text */}
        <p className={`text-white text-center font-sans tracking-wide drop-shadow-md select-none ${fontClasses[fontSize]}`}>
          "{promptText}"
        </p>

        {/* Control Panel Settings Drawer */}
        {showControls && (
          <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-xs">
            {/* Size selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider block">Size</span>
              <div className="flex rounded-lg bg-white/10 p-0.5">
                {(['sm', 'md', 'lg'] as PromptFontSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onConfigChange?.({ fontSize: sz })}
                    className={`flex-1 py-1 text-center rounded capitalize font-medium transition-all ${
                      fontSize === sz ? 'bg-indigo-600 text-white shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {sz === 'sm' ? 'S' : sz === 'md' ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider block">Opacity</span>
              <div className="flex rounded-lg bg-white/10 p-0.5">
                {(['low', 'medium', 'high'] as PromptOpacity[]).map((op) => (
                  <button
                    key={op}
                    onClick={() => onConfigChange?.({ opacity: op })}
                    className={`flex-1 py-1 text-center rounded capitalize font-medium transition-all ${
                      opacity === op ? 'bg-indigo-600 text-white shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {op === 'low' ? '70%' : op === 'medium' ? '85%' : '100%'}
                  </button>
                ))}
              </div>
            </div>

            {/* Position selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider block">Position</span>
              <div className="flex rounded-lg bg-white/10 p-0.5">
                {(['top', 'center', 'bottom'] as PromptPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => onConfigChange?.({ position: pos })}
                    className={`flex-1 py-1 text-center rounded capitalize font-medium transition-all ${
                      position === pos ? 'bg-indigo-600 text-white shadow' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {pos === 'top' ? 'Top' : pos === 'center' ? 'Mid' : 'Bot'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
