import React, { useState } from 'react';
import { PromptFontSize, PromptOpacity, PracticeModeType } from '../../types';
import { Type, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface FloatingTopicProps {
  topicName: string;
  categoryName?: string;
  information?: string | null;
  mode: PracticeModeType;
  fontSize?: PromptFontSize;
  opacity?: PromptOpacity;
  isKidsMode?: boolean;
}

export const FloatingTopic: React.FC<FloatingTopicProps> = ({
  topicName,
  categoryName = 'Speaking Practice',
  information,
  mode,
  fontSize = 'md',
  opacity = 'medium',
  isKidsMode = false,
}) => {
  const [showControls, setShowControls] = useState(false);
  const [currentFontSize, setFontSize] = useState<PromptFontSize>(fontSize);
  const [currentOpacity, setOpacity] = useState<PromptOpacity>(opacity);

  // Font size mapping
  const fontClasses: Record<PromptFontSize, string> = {
    sm: 'text-sm sm:text-base leading-snug',
    base: 'text-base sm:text-lg font-bold leading-snug',
    md: 'text-base sm:text-xl font-bold leading-snug',
    lg: 'text-lg sm:text-2xl font-extrabold leading-tight',
    xl: 'text-xl sm:text-3xl font-black leading-tight',
  };

  // Opacity surface mapping
  const opacityClasses: Record<PromptOpacity, string> = {
    low: 'bg-slate-950/70 backdrop-blur-md border-white/15',
    translucent: 'bg-slate-950/75 backdrop-blur-lg border-white/20',
    medium: 'bg-slate-950/85 backdrop-blur-xl border-white/25',
    high: 'bg-slate-950/95 backdrop-blur-2xl border-white/30',
    solid: 'bg-slate-950/95 backdrop-blur-2xl border-white/30',
  };

  const modeBadgeText = isKidsMode
    ? '🧒 Kids Practice'
    : mode === 'story'
    ? '🦖 Story Mode'
    : mode === 'ai'
    ? '✨ AI Teleprompter'
    : '⚡ Spontaneous Speech';

  return (
    <div className="w-full max-w-xl mx-auto select-none transition-all duration-200">
      <div
        className={`p-4 sm:p-6 rounded-3xl text-white shadow-2xl border transition-all ${
          opacityClasses[currentOpacity] || opacityClasses.medium
        }`}
      >
        {/* Header Metadata Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300">
              {modeBadgeText} · {categoryName}
            </span>
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
            title="Adjust text size and background opacity"
          >
            <Type className="w-3 h-3 text-amber-300" />
            <span>Format</span>
            {showControls ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Topic Title Question */}
        <h2
          className={`text-center text-white tracking-tight break-words font-display ${
            fontClasses[currentFontSize] || fontClasses.md
          }`}
        >
          "{topicName}"
        </h2>

        {/* Educational Story or AI Info */}
        {information && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-slate-200 leading-relaxed font-sans max-h-48 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between gap-1.5 text-amber-300 font-semibold mb-1 text-[11px]">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Speaking Guide & Context:</span>
              </div>
            </div>
            <p className="whitespace-pre-line text-slate-100">{information}</p>
          </div>
        )}

        {/* Formatting Controls Drawer */}
        {showControls && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
            {/* Font Size */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 uppercase font-bold">Text Size</span>
              <div className="flex rounded-lg bg-white/10 p-0.5">
                {(['sm', 'md', 'lg'] as PromptFontSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`flex-1 py-1 text-center rounded capitalize font-bold transition-all cursor-pointer ${
                      currentFontSize === sz ? 'bg-amber-400 text-slate-950 shadow' : 'text-white/70'
                    }`}
                  >
                    {sz === 'sm' ? 'S' : sz === 'md' ? 'M' : 'L'}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/60 uppercase font-bold">Contrast</span>
              <div className="flex rounded-lg bg-white/10 p-0.5">
                {(['low', 'medium', 'high'] as PromptOpacity[]).map((op) => (
                  <button
                    key={op}
                    onClick={() => setOpacity(op)}
                    className={`flex-1 py-1 text-center rounded capitalize font-bold transition-all cursor-pointer ${
                      currentOpacity === op ? 'bg-amber-400 text-slate-950 shadow' : 'text-white/70'
                    }`}
                  >
                    {op === 'low' ? '70%' : op === 'medium' ? '85%' : '95%'}
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
