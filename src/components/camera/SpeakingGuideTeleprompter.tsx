import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getHybridTeleprompterGuide,
  generateContinuousFallback,
  TeleprompterGuideResult,
} from '../../services/teleprompterService';
import { TopicDifficulty, AudienceType } from '../../types';
import {
  Play,
  Pause,
  MoveVertical,
  Sparkles,
  Minus,
  Plus,
  RefreshCw,
  BookOpen,
  Mic,
} from 'lucide-react';

interface SpeakingGuideTeleprompterProps {
  topicName: string;
  topicId?: string;
  categoryId?: string;
  categoryName?: string;
  difficulty?: TopicDifficulty;
  audience?: AudienceType;
  isRecording: boolean;
  recordingTime: number;
  liveSpeechDetected?: boolean;
}

type PositionPreset = 'top-center' | 'center' | 'bottom-center';
type FontSizePreset = 'sm' | 'md' | 'lg';
type ScrollMode = '0.5x' | '1x' | '1.5x' | '2x' | 'voice';

export const SpeakingGuideTeleprompter: React.FC<SpeakingGuideTeleprompterProps> = ({
  topicName,
  topicId,
  categoryId,
  categoryName,
  difficulty = 'MEDIUM',
  audience = 'GENERAL',
  isRecording,
  recordingTime: _recordingTime,
  liveSpeechDetected = false,
}) => {
  const [currentAngleIdx, setCurrentAngleIdx] = useState<number>(0);
  const [guide, setGuide] = useState<TeleprompterGuideResult>(() =>
    generateContinuousFallback(topicName, categoryName, difficulty, 0)
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [scrollMode, setScrollMode] = useState<ScrollMode>('1x');
  const [opacity, setOpacity] = useState<number>(75);
  const [fontSize, setFontSize] = useState<FontSizePreset>('md');
  const [position, setPosition] = useState<PositionPreset>('top-center');

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // 4-Stage Hybrid Resolution
  useEffect(() => {
    let isMounted = true;

    const initialFast = generateContinuousFallback(topicName, categoryName, difficulty, currentAngleIdx);
    setGuide(initialFast);

    getHybridTeleprompterGuide(
      topicName,
      topicId,
      categoryName,
      difficulty,
      audience,
      currentAngleIdx
    ).then((resolved) => {
      if (isMounted && resolved) {
        setGuide(resolved);
        setCurrentAngleIdx(resolved.angleIndex);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [topicName, topicId, categoryId, categoryName, difficulty, audience, currentAngleIdx]);

  const handleCycleAngle = useCallback(() => {
    const nextIdx = (currentAngleIdx + 1) % (guide.totalAngles || 3);
    setCurrentAngleIdx(nextIdx);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentAngleIdx, guide.totalAngles]);

  // Butter-smooth 60fps/120fps requestAnimationFrame scrolling (zero layout thrashing on mobile)
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimeRef.current = null;

    if (!isRecording || !isPlaying) return;

    let multiplier = 1;
    if (scrollMode === '0.5x') multiplier = 0.5;
    else if (scrollMode === '1x') multiplier = 1;
    else if (scrollMode === '1.5x') multiplier = 1.5;
    else if (scrollMode === '2x') multiplier = 2;
    else if (scrollMode === 'voice') {
      multiplier = liveSpeechDetected ? 1.4 : 0.2;
    }

    const pixelsPerSecond = multiplier * 24; // 24px per second baseline

    const scrollLoop = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (containerRef.current && delta > 0 && delta < 0.2) {
        containerRef.current.scrollTop += delta * pixelsPerSecond;
      }

      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPlaying, scrollMode, liveSpeechDetected]);

  const fontClasses: Record<FontSizePreset, string> = {
    sm: 'text-xs leading-relaxed tracking-normal',
    md: 'text-sm sm:text-base leading-relaxed sm:leading-loose tracking-wide font-medium',
    lg: 'text-base sm:text-lg leading-loose tracking-wide font-semibold',
  };

  const positionClasses: Record<PositionPreset, string> = {
    'top-center': 'top-16 left-1/2 -translate-x-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-center': 'bottom-28 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-40 w-[92vw] sm:w-[520px] md:w-[580px] pointer-events-auto select-none transition-all duration-300 transform-gpu`}
      role="region"
      aria-label="Continuous Speaking Guide Teleprompter"
    >
      <div
        className="rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: `rgba(12, 12, 18, ${opacity / 100})`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Top Header Plate */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/15 shrink-0 text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono-code uppercase tracking-wider font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-white bg-clip-text text-transparent">
                SMART TELEPROMPTER
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono-code font-bold text-white/80 flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5 text-indigo-400" />
              <span>{guide.wordCount} WORDS</span>
            </span>

            <button
              onClick={handleCycleAngle}
              className="px-2 py-0.5 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-[10px] font-mono-code font-extrabold text-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
              title="Switch to a completely different factual angle"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>ANGLE {guide.angleIndex + 1}/{guide.totalAngles || 3}</span>
            </button>

            <button
              onClick={() =>
                setPosition((prev) =>
                  prev === 'top-center'
                    ? 'center'
                    : prev === 'center'
                    ? 'bottom-center'
                    : 'top-center'
                )
              }
              className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[10px] font-mono-code font-bold text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Cycle Teleprompter Position"
            >
              <MoveVertical className="w-2.5 h-2.5 text-cyan-400" />
              <span className="uppercase">{position.replace('-center', '')}</span>
            </button>
          </div>
        </div>

        {/* Perspective Label Subheader */}
        <div className="pb-1.5 text-[10px] font-mono-code text-indigo-400 uppercase font-bold tracking-wider truncate flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{guide.angleName}</span>
        </div>

        {/* Center Scrollable Continuous Paragraph */}
        <div
          ref={containerRef}
          className="max-h-[200px] sm:max-h-[260px] overflow-y-auto custom-scrollbar pr-2 py-1 text-white relative will-change-scroll"
        >
          <div className="sticky top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent pointer-events-none opacity-60" />

          <p
            className={`font-display break-words font-normal text-white text-justify ${fontClasses[fontSize]}`}
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {guide.fullParagraph}
          </p>
        </div>

        {/* Minimal Control Footer Bar */}
        <div className="pt-2.5 mt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white shrink-0 font-mono-code flex-wrap gap-1">
          {/* Opacity Control */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-white/60 uppercase font-bold">OPACITY</span>
            <button
              onClick={() => setOpacity((prev) => Math.max(35, prev - 15))}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Decrease Opacity"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <span className="w-7 text-center font-bold text-white text-[10px]">{opacity}%</span>
            <button
              onClick={() => setOpacity((prev) => Math.min(95, prev + 15))}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Increase Opacity"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg">
            {(['sm', 'md', 'lg'] as FontSizePreset[]).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold transition-all cursor-pointer ${
                  fontSize === sz
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Speed & Voice Cadence Presets */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer text-[10px]"
              title={isPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
            >
              {isPlaying ? <Pause className="w-2.5 h-2.5 text-indigo-400" /> : <Play className="w-2.5 h-2.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg">
              {(['0.5x', '1x', '1.5x', '2x', 'voice'] as ScrollMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setScrollMode(mode)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-0.5 ${
                    scrollMode === mode
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                  title={mode === 'voice' ? 'Voice Cadence Auto-Scroll' : `Scroll speed ${mode}`}
                >
                  {mode === 'voice' && <Mic className="w-2 h-2 text-cyan-300" />}
                  <span>{mode === 'voice' ? 'VOICE' : mode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
