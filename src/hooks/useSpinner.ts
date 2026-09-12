import { useState, useRef, useCallback, useEffect } from 'react';
import { Topic, TopicDifficulty, AudienceType } from '../types';
import { getSampleWheelTopics, getTopicsByCategory, getRandomTopicWithDeduplication } from '../data/topics';
import { playTickSound, playWinnerSound } from '../utils/sound';

export interface SpinnerState {
  isSpinning: boolean;
  rotationAngle: number; // degrees
  candidateTopics: Topic[];
  winnerTopic: Topic | null;
  shufflingTopicName: string;
  selectedIndex: number | null;
  isPoolReset: boolean;
}

export function useSpinner(
  categoryId?: string,
  difficulty: TopicDifficulty = 'EASY',
  audience: AudienceType = 'GENERAL'
) {
  const sessionUsedIdsRef = useRef<Set<string>>(new Set());

  const [state, setState] = useState<SpinnerState>(() => {
    const candidates = getSampleWheelTopics(categoryId, difficulty, audience, 10);
    return {
      isSpinning: false,
      rotationAngle: 0,
      candidateTopics: candidates,
      winnerTopic: null,
      shufflingTopicName: candidates[0]?.name || (audience === 'GENERAL' ? 'How to Think Fast and Speak Clearly' : 'What is your favorite animal?'),
      selectedIndex: null,
      isPoolReset: false,
    };
  });

  const animFrameRef = useRef<number | null>(null);
  const shuffleIntervalRef = useRef<number | null>(null);

  // Immediately reset candidate topics and state when category, difficulty, or audience changes
  useEffect(() => {
    const candidates = getSampleWheelTopics(categoryId, difficulty, audience, 10);
    setState((prev) => ({
      ...prev,
      candidateTopics: candidates,
      shufflingTopicName: candidates[0]?.name || (audience === 'GENERAL' ? 'How to Think Fast and Speak Clearly' : 'What is your favorite animal?'),
      winnerTopic: null,
      selectedIndex: null,
      isPoolReset: false,
    }));
  }, [categoryId, difficulty, audience]);

  const spin = useCallback(
    (onComplete?: (winner: Topic) => void) => {
      if (state.isSpinning) return;

      const categoryTopics = getTopicsByCategory(categoryId, difficulty, audience);

      // Instant prefetched deduplicated topic pick (Zero AI network delay)
      const { topic: chosenTopic, isPoolReset } = getRandomTopicWithDeduplication(
        categoryId,
        difficulty,
        audience,
        sessionUsedIdsRef.current
      );

      if (isPoolReset) {
        sessionUsedIdsRef.current.clear();
      }
      sessionUsedIdsRef.current.add(chosenTopic.id);

      let candidates = [...state.candidateTopics];
      let winIndex = candidates.findIndex((t) => t.id === chosenTopic.id || t.name === chosenTopic.name);

      if (winIndex === -1) {
        winIndex = Math.floor(Math.random() * Math.max(1, candidates.length));
        if (candidates.length === 0) {
          candidates = [chosenTopic];
          winIndex = 0;
        } else {
          candidates[winIndex] = chosenTopic;
        }
      }

      const totalSlices = Math.max(1, candidates.length);
      const sliceAngle = 360 / totalSlices;

      const targetSliceCenter = winIndex * sliceAngle + sliceAngle / 2;
      const desiredFinalAngle = (360 - targetSliceCenter + 270) % 360;

      const extraSpins = 4 * 360;
      const currentMod = state.rotationAngle % 360;
      const targetRotation = state.rotationAngle + extraSpins + (desiredFinalAngle - currentMod + 360) % 360;

      const startTime = performance.now();
      const duration = 2200; // Snappy 2.2-second deceleration
      const startAngle = state.rotationAngle;

      // Rapid word shuffling effect strictly using selected category/audience topics
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = window.setInterval(() => {
        const randomCandidate = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
        if (randomCandidate) {
          playTickSound();
          setState((prev) => ({
            ...prev,
            shufflingTopicName: randomCandidate.name,
          }));
        }
      }, 75);

      setState((prev) => ({
        ...prev,
        isSpinning: true,
        candidateTopics: candidates,
        winnerTopic: null,
        selectedIndex: null,
        isPoolReset,
      }));

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Cubic ease-out deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetRotation - startAngle) * easeOut;

        if (progress < 1) {
          setState((prev) => ({ ...prev, rotationAngle: currentAngle }));
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          if (shuffleIntervalRef.current) {
            clearInterval(shuffleIntervalRef.current);
            shuffleIntervalRef.current = null;
          }

          playWinnerSound();
          setState((prev) => ({
            ...prev,
            isSpinning: false,
            rotationAngle: targetRotation,
            winnerTopic: chosenTopic,
            shufflingTopicName: chosenTopic.name,
            selectedIndex: winIndex,
          }));

          if (onComplete) {
            onComplete(chosenTopic);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [categoryId, difficulty, audience, state.candidateTopics, state.isSpinning, state.rotationAngle]
  );

  return {
    ...state,
    spin,
  };
}
