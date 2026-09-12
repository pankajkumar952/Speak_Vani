import { RealPracticeAttempt, AttemptDelta } from '../types';

export const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'actually',
  'basically',
  'you know',
  'sort of',
  'kind of',
  'i mean',
  'so',
];

/**
 * Deterministically compute speech metrics from transcript text and measured recording duration.
 */
export function calculateRealSpeechMetrics(
  transcript: string,
  durationSeconds: number
): {
  wordCount: number;
  sentenceCount: number;
  wordsPerMinute: number;
  fillerCount: number;
  fillerRatePerMinute: number;
  fillerBreakdown: Record<string, number>;
  avgWordsPerSentence: number;
} {
  const cleanTranscript = (transcript || '').trim();
  const validDuration = Math.max(1, durationSeconds);
  const durationMinutes = validDuration / 60.0;

  if (!cleanTranscript) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      wordsPerMinute: 0,
      fillerCount: 0,
      fillerRatePerMinute: 0,
      fillerBreakdown: {},
      avgWordsPerSentence: 0,
    };
  }

  // 1. Word Count
  const words = cleanTranscript.split(/\s+/).filter((w) => w.replace(/[^a-zA-Z0-9]/g, '').length > 0);
  const wordCount = words.length;

  // 2. Sentence Count
  const rawSentences = cleanTranscript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, rawSentences.length);

  // 3. Speaking Pace (WPM)
  const wordsPerMinute = wordCount > 0 ? Math.round(wordCount / durationMinutes) : 0;

  // 4. Average words per sentence
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  // 5. Filler word detection with contextual filtering
  const lower = cleanTranscript.toLowerCase();
  const fillerBreakdown: Record<string, number> = {};
  let fillerCount = 0;

  // Multi-word fillers
  const multiWordFillers = ['you know', 'sort of', 'kind of', 'i mean'];
  let workingText = lower;
  for (const mw of multiWordFillers) {
    const regex = new RegExp(`\\b${mw}\\b`, 'g');
    const matches = workingText.match(regex);
    if (matches && matches.length > 0) {
      fillerBreakdown[mw] = matches.length;
      fillerCount += matches.length;
      workingText = workingText.replace(regex, '___');
    }
  }

  // Single word fillers
  const singleFillers = ['um', 'uh', 'actually', 'basically'];
  for (const sw of singleFillers) {
    const regex = new RegExp(`\\b${sw}\\b`, 'g');
    const matches = workingText.match(regex);
    if (matches && matches.length > 0) {
      fillerBreakdown[sw] = matches.length;
      fillerCount += matches.length;
    }
  }

  // Contextual "like" (filter out "I like", "would like", "looks like", "sound like")
  const likeMatches = workingText.match(/\b(like)\b/g);
  if (likeMatches) {
    let contextualLikes = 0;
    const likeRegex = /\b(like)\b/g;
    let match: RegExpExecArray | null;
    while ((match = likeRegex.exec(workingText)) !== null) {
      const idx = match.index;
      const prefix = workingText.substring(Math.max(0, idx - 15), idx).trim();
      const isLegit =
        prefix.endsWith('i') ||
        prefix.endsWith('would') ||
        prefix.endsWith('to') ||
        prefix.endsWith('we') ||
        prefix.endsWith('they') ||
        prefix.endsWith('looks') ||
        prefix.endsWith('look') ||
        prefix.endsWith('feel');

      if (!isLegit) {
        contextualLikes++;
      }
    }
    if (contextualLikes > 0) {
      fillerBreakdown['like'] = contextualLikes;
      fillerCount += contextualLikes;
    }
  }

  const fillerRatePerMinute = Math.round((fillerCount / durationMinutes) * 10) / 10;

  return {
    wordCount,
    sentenceCount,
    wordsPerMinute,
    fillerCount,
    fillerRatePerMinute,
    fillerBreakdown,
    avgWordsPerSentence,
  };
}

/**
 * Compare two attempts deterministically and produce objective delta highlights.
 */
export function comparePracticeAttempts(
  attempt1: RealPracticeAttempt,
  attempt2: RealPracticeAttempt
): AttemptDelta {
  const durationDeltaSec = attempt2.durationSeconds - attempt1.durationSeconds;
  const wordCountDelta = attempt2.wordCount - attempt1.wordCount;
  const wpmDelta = attempt2.wordsPerMinute - attempt1.wordsPerMinute;
  const fillerCountDelta = attempt2.fillerCount - attempt1.fillerCount;

  let fillerPercentageReduction = 0;
  if (attempt1.fillerCount > 0) {
    fillerPercentageReduction = Math.round(
      ((attempt1.fillerCount - attempt2.fillerCount) / attempt1.fillerCount) * 100
    );
  }

  const summaryHighlights: string[] = [];

  // 1. Fillers comparison
  if (attempt2.fillerCount < attempt1.fillerCount) {
    summaryHighlights.push(
      `✓ Filler words reduced from ${attempt1.fillerCount} to ${attempt2.fillerCount} (${Math.abs(
        fillerPercentageReduction
      )}% reduction).`
    );
  } else if (attempt2.fillerCount === 0 && attempt1.fillerCount === 0) {
    summaryHighlights.push('✓ Maintained 100% clean delivery with zero filler words.');
  }

  // 2. Duration comparison
  if (durationDeltaSec > 3) {
    summaryHighlights.push(
      `✓ Spoke for ${durationDeltaSec}s longer (${attempt1.durationSeconds}s → ${attempt2.durationSeconds}s), demonstrating expanded elaboration.`
    );
  } else if (Math.abs(durationDeltaSec) <= 3) {
    summaryHighlights.push(
      `✓ Highly consistent speaking duration (${attempt2.durationSeconds}s vs ${attempt1.durationSeconds}s).`
    );
  }

  // 3. Word count comparison
  if (wordCountDelta > 5) {
    summaryHighlights.push(
      `✓ Articulated +${wordCountDelta} more words (${attempt1.wordCount} → ${attempt2.wordCount} words).`
    );
  }

  // 4. Pacing comparison
  const optMin = 120;
  const optMax = 150;
  const att1Dist = Math.min(Math.abs(attempt1.wordsPerMinute - optMin), Math.abs(attempt1.wordsPerMinute - optMax));
  const att2Dist = Math.min(Math.abs(attempt2.wordsPerMinute - optMin), Math.abs(attempt2.wordsPerMinute - optMax));

  if (att2Dist < att1Dist && attempt2.wordsPerMinute >= optMin && attempt2.wordsPerMinute <= optMax) {
    summaryHighlights.push(
      `✓ Speaking pace aligned to conversational optimal range (${attempt2.wordsPerMinute} WPM).`
    );
  }

  return {
    durationDeltaSec,
    wordCountDelta,
    wpmDelta,
    fillerCountDelta,
    fillerPercentageReduction,
    summaryHighlights,
  };
}
