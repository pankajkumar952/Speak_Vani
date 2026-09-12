import React, { useState, useEffect, useRef } from 'react';
import { PredefinedSpeechScript } from '../../data/mockAIInfo';
import { ChevronUp, ChevronDown, Clock, Sparkles } from 'lucide-react';

interface TeleprompterProps {
  script: PredefinedSpeechScript;
  isRecording: boolean;
  recordingTime: number;
}

export const SpotifyLyricsTeleprompter: React.FC<TeleprompterProps> = ({
  script,
  isRecording,
  recordingTime,
}) => {
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);
  const [paraSecondsLeft, setParaSecondsLeft] = useState<number>(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeParaRef = useRef<HTMLDivElement>(null);

  const PARAGRAPH_DURATION = 30; // 30 seconds per paragraph

  // 30-Second Paragraph Auto-Jump Timer logic
  useEffect(() => {
    if (isRecording && recordingTime > 0) {
      // Calculate which paragraph should be active based on 30-second intervals
      const targetIndex = Math.min(
        script.paragraphs.length - 1,
        Math.floor(recordingTime / PARAGRAPH_DURATION)
      );

      const secondsElapsedInCurrentPara = recordingTime % PARAGRAPH_DURATION;
      const secondsRemaining = PARAGRAPH_DURATION - secondsElapsedInCurrentPara;

      setParaSecondsLeft(secondsRemaining);

      if (targetIndex !== activeParaIndex) {
        setActiveParaIndex(targetIndex);
      }
    } else {
      setParaSecondsLeft(30);
    }
  }, [isRecording, recordingTime, script.paragraphs.length, activeParaIndex]);

  // Smooth scroll active paragraph into center viewport
  useEffect(() => {
    if (activeParaRef.current && containerRef.current) {
      activeParaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeParaIndex]);

  return (
    <div className="w-full max-w-3xl mx-auto h-[calc(100vh-170px)] mt-10 flex flex-col pointer-events-auto select-none">
      {/* Teleprompter Glass Card */}
      <div className="w-full h-full bg-black/65 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 flex flex-col justify-between border border-white/15 shadow-2xl overflow-hidden relative">
        {/* Top Header Bar (Word 'Spotify' removed completely) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0d9488] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TELEPROMPTER MODE · {script.topicName}</span>
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal leading-tight mt-0.5">
              {script.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveParaIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeParaIndex === 0}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
              title="Previous Paragraph"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setActiveParaIndex((prev) => Math.min(script.paragraphs.length - 1, prev + 1))
              }
              disabled={activeParaIndex === script.paragraphs.length - 1}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
              title="Next Paragraph"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Paragraphs Scroll Viewport */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto custom-scrollbar space-y-6 py-6 px-2 scroll-smooth"
        >
          {script.paragraphs.map((paragraph, idx) => {
            const isActive = idx === activeParaIndex;
            return (
              <div
                key={idx}
                ref={isActive ? activeParaRef : null}
                onClick={() => setActiveParaIndex(idx)}
                className={`transition-all duration-300 cursor-pointer py-3 ${
                  isActive
                    ? 'font-sans text-xl sm:text-2xl font-bold text-white opacity-100 scale-100 tracking-tight leading-relaxed drop-shadow-xl border-l-4 border-l-[#0d9488] pl-5 bg-white/5 rounded-r-2xl p-4'
                    : 'font-sans text-lg sm:text-xl font-normal text-white/35 opacity-40 hover:opacity-75 pl-5 hover:translate-x-1'
                }`}
              >
                {paragraph}
              </div>
            );
          })}
        </div>

        {/* Bottom 30-Second Auto-Jump Paragraph Timer Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0d9488]/20 border border-[#0d9488]/40 rounded-full text-[#0d9488] font-bold">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>
                {isRecording
                  ? `Jumping to next in ${paraSecondsLeft}s`
                  : '30s per paragraph timer'}
              </span>
            </div>
            <span className="font-semibold text-slate-300">
              Paragraph {activeParaIndex + 1} of {script.paragraphs.length}
            </span>
          </div>

          <span className="italic text-slate-400">Click any paragraph to jump</span>
        </div>
      </div>
    </div>
  );
};
