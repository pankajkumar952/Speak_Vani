import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, TopicDifficulty, AudienceType, TopicFormat } from '../../types';
import { getTopicsByFormat, getRandomTopicWithDeduplication } from '../../data/topics';
import { playMechanicalReelTick, playMechanicalLockClick } from '../../utils/sound';
import { Dices } from 'lucide-react';

interface TopicReelProps {
  categoryId?: string;
  categoryName?: string;
  difficulty?: TopicDifficulty;
  audience?: AudienceType;
  topicFormat?: TopicFormat;
  selectedTopic?: Topic | null;
  onTopicSelected?: (topic: Topic) => void;
  isSpinning?: boolean;
  setIsSpinning?: (spinning: boolean) => void;
}

const ITEM_HEIGHT = 155; // Height of the single hero slot in pixels
const SPIN_DURATION_MS = 2900; // Physical spin duration

export const TopicReel: React.FC<TopicReelProps> = ({
  categoryId,
  categoryName = 'Technology & AI',
  difficulty = 'MEDIUM',
  audience = 'GENERAL',
  topicFormat = 'ALL',
  selectedTopic,
  onTopicSelected,
  isSpinning: externalIsSpinning,
  setIsSpinning: externalSetIsSpinning,
}) => {
  const [internalIsSpinning, setInternalIsSpinning] = useState<boolean>(false);
  const isSpinning = externalIsSpinning ?? internalIsSpinning;
  const setIsSpinning = externalSetIsSpinning ?? setInternalIsSpinning;

  // Active pool of valid topics matching all filters
  const topicPool = useRef<Topic[]>([]);
  const [, setCurrentDisplayTopic] = useState<Topic | null>(selectedTopic || null);

  // Virtual reel indices
  const [centerIndex, setCenterIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0 to 1 smooth offset

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startOffsetRef = useRef<number>(0);
  const targetOffsetRef = useRef<number>(0);
  const lastTickItemRef = useRef<number>(0);
  const winnerRef = useRef<Topic | null>(null);

  // Load and refresh valid topic pool whenever filters change
  useEffect(() => {
    const valid = getTopicsByFormat(categoryId, difficulty, audience, topicFormat);
    topicPool.current = valid.length > 0 ? valid : getTopicsByFormat(undefined, difficulty, audience, topicFormat);

    if (topicPool.current.length > 0) {
      if (selectedTopic) {
        const foundIdx = topicPool.current.findIndex(
          (t) => t.id === selectedTopic.id || t.name === selectedTopic.name
        );
        setCenterIndex(foundIdx >= 0 ? foundIdx : 0);
        setCurrentDisplayTopic(selectedTopic);
      } else {
        setCenterIndex(0);
        setCurrentDisplayTopic(topicPool.current[0]);
      }
    }
  }, [categoryId, difficulty, audience, topicFormat, selectedTopic]);

  /**
   * Custom physical easing curve:
   * Fast acceleration -> High speed sustained velocity -> Long inertia decay -> Magnetic snap
   */
  const getPhysicsProgress = (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    if (t < 0.15) {
      const p = t / 0.15;
      return 0.1 * (p * p * p);
    } else if (t < 0.55) {
      const p = (t - 0.15) / 0.4;
      return 0.1 + p * 0.6;
    } else {
      const p = (t - 0.55) / 0.45;
      const decay = 1 - Math.pow(1 - p, 3.5);
      return 0.7 + decay * 0.3;
    }
  };

  // Track recently spun topic IDs to prevent immediate repeats
  const recentSpinIds = useRef<string[]>([]);

  /**
   * Trigger the physical reel spin with guaranteed unique next topic
   */
  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    const pool = topicPool.current;
    if (!pool || pool.length === 0) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Filter out the current topic and recently spun topics
    const currentName = pool[centerIndex % pool.length]?.name;
    let available = pool.filter(
      (t) => t.name !== currentName && !recentSpinIds.current.includes(t.id)
    );

    // If available pool was exhausted, clear history and exclude only current topic
    if (available.length === 0) {
      recentSpinIds.current = [];
      available = pool.filter((t) => t.name !== currentName);
    }

    if (available.length === 0) {
      available = pool;
    }

    // Truly random selection from available candidates
    const randomPick = available[Math.floor(Math.random() * available.length)];
    const winnerIdx = pool.findIndex((t) => t.id === randomPick.id || t.name === randomPick.name);
    const resolvedWinnerIdx = winnerIdx >= 0 ? winnerIdx : 0;
    const winner = pool[resolvedWinnerIdx];
    winnerRef.current = winner;

    // Record in recent history
    recentSpinIds.current.push(winner.id);
    if (recentSpinIds.current.length > 20) {
      recentSpinIds.current.shift();
    }

    // Reduced motion fast path
    if (isReducedMotion) {
      setCenterIndex(resolvedWinnerIdx);
      setCurrentDisplayTopic(winner);
      onTopicSelected?.(winner);
      playMechanicalLockClick();
      return;
    }

    setIsSpinning(true);

    const cycles = 3;
    const poolLen = pool.length;
    const currentModulo = centerIndex % poolLen;
    let deltaItems = (resolvedWinnerIdx - currentModulo + poolLen) % poolLen;
    if (deltaItems === 0) deltaItems = poolLen;
    const totalItemsToTravel = cycles * Math.max(poolLen, 10) + deltaItems;

    startOffsetRef.current = centerIndex;
    targetOffsetRef.current = centerIndex + totalItemsToTravel;
    lastTickItemRef.current = Math.floor(centerIndex);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(1, elapsed / SPIN_DURATION_MS);

      const progress = getPhysicsProgress(t);
      const currentFloatIndex = startOffsetRef.current + (targetOffsetRef.current - startOffsetRef.current) * progress;

      const integerPart = Math.floor(currentFloatIndex);
      const subOffset = currentFloatIndex - integerPart;

      setCenterIndex(integerPart % poolLen);
      setScrollProgress(subOffset);

      // Velocity-scaled mechanical ticks
      if (integerPart !== lastTickItemRef.current) {
        const velocityRatio = Math.max(0.2, (1 - Math.abs(t - 0.35) * 1.6));
        playMechanicalReelTick(velocityRatio);
        lastTickItemRef.current = integerPart;
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Physical snap settle complete
        setCenterIndex(resolvedWinnerIdx);
        setScrollProgress(0);
        setCurrentDisplayTopic(winner);
        setIsSpinning(false);
        playMechanicalLockClick();
        onTopicSelected?.(winner);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, centerIndex, onTopicSelected, setIsSpinning]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const pool = topicPool.current;
  const poolLen = Math.max(1, pool.length);

  const getCyclicTopic = (offset: number): Topic => {
    if (pool.length === 0) {
      return {
        id: 'fallback',
        name: 'Select or Spin for an impromptu speaking topic.',
        categoryId: 'cat-1',
      };
    }
    const idx = ((((centerIndex + offset) % poolLen) + poolLen) % poolLen);
    return pool[idx];
  };

  // Active topic & incoming topic during rolling
  const topicCenter = getCyclicTopic(0);
  const topicNext = getCyclicTopic(1);

  // Dynamic typography sizing based on length to guarantee maximum visibility & zero overflow
  const getHeroTextClass = (text: string) => {
    if (text.length > 75) return 'text-sm sm:text-base md:text-lg font-black leading-snug';
    if (text.length > 45) return 'text-base sm:text-lg md:text-xl font-black leading-snug';
    return 'text-lg sm:text-xl md:text-2xl font-black leading-snug';
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none space-y-6">
      {/* ================= REEL HOUSING ENCLOSURE ================= */}
      <div className="relative w-full rounded-3xl p-3.5 sm:p-6 editorial-surface shadow-lg border-2 border-[var(--border-primary)] transition-all">
        {/* Top Header Plate on the Physical Housing */}
        <div className="flex items-center justify-between px-3 pb-3 border-b border-[var(--border-primary)]/80 text-xs font-mono-code font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse" />
            <span className="text-[var(--text-primary)] uppercase tracking-wider font-extrabold">
              {categoryName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0d9488]/15 text-[#0d9488] font-extrabold text-[10px] uppercase">
              {difficulty}
            </span>
            <span className="text-[var(--text-muted)] text-[10px] font-bold">
              {poolLen} TOPICS
            </span>
          </div>
        </div>

        {/* Clean Single-Slot Focused Mechanical Frame (Only the Tick Box Stage) */}
        <div
          className="relative w-full h-[155px] sm:h-[165px] my-3.5 rounded-2xl overflow-hidden bg-[var(--bg-primary)] border-2 border-[#0d9488] shadow-[inset_0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center"
          role="region"
          aria-label="Mechanical Topic Reel"
        >
          {/* Subtle Corner Brackets for Precision Industrial Feel */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#0d9488] pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#0d9488] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#0d9488] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#0d9488] pointer-events-none" />

          {/* Left & Right Mechanical Tick Indicators */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-[#0d9488]" />
            <div className="w-1.5 h-10 rounded-full bg-[#0d9488]" />
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-[#0d9488]" />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-[#0d9488]" />
            <div className="w-1.5 h-10 rounded-full bg-[#0d9488]" />
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-[#0d9488]" />
          </div>

          {/* Single Focused Slot Track (Smooth Flip/Roll Inside Frame) */}
          <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden px-8 sm:px-14">
            {/* Active Topic in Frame */}
            <div
              className="absolute inset-0 flex items-center justify-center text-center px-8 sm:px-14 transition-transform will-change-transform"
              style={{
                transform: `translateY(${-scrollProgress * ITEM_HEIGHT}px)`,
                opacity: 1 - scrollProgress * 0.7,
              }}
            >
              <h2
                className={`${getHeroTextClass(
                  topicCenter.name
                )} font-display tracking-tight text-[var(--text-primary)] max-w-xl break-words line-clamp-3`}
              >
                "{topicCenter.name}"
              </h2>
            </div>

            {/* Next Incoming Topic in Frame during Spin */}
            {isSpinning && (
              <div
                className="absolute inset-0 flex items-center justify-center text-center px-8 sm:px-14 transition-transform will-change-transform"
                style={{
                  transform: `translateY(${(1 - scrollProgress) * ITEM_HEIGHT}px)`,
                  opacity: scrollProgress,
                }}
              >
                <h2
                  className={`${getHeroTextClass(
                    topicNext.name
                  )} font-display tracking-tight text-[var(--text-primary)] max-w-xl break-words line-clamp-3`}
                >
                  "{topicNext.name}"
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Housing Latch Plate */}
        <div className="flex items-center justify-between px-3 pt-2 text-[10px] font-mono-code text-[var(--text-muted)] font-bold">
          <span>MECHANICAL ROLLER // VER 2.0</span>
          <span>PRESS ROLL TO SHUFFLE</span>
        </div>
      </div>

      {/* Primary Spin Trigger Action Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full max-w-md py-4 px-8 rounded-2xl font-display font-extrabold text-lg sm:text-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer ${
          isSpinning
            ? 'bg-[#0d9488]/60 text-white cursor-not-allowed scale-[0.98]'
            : 'bg-[#0d9488] hover:bg-[#0b6b62] active:scale-[0.98] text-white hover:shadow-xl'
        }`}
        aria-live="polite"
      >
        <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'ROLLING NEW PROMPT...' : '🎲 ROLL NEW PROMPT'}</span>
      </button>
    </div>
  );
};
