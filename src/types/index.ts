export type PracticeModeType =
  | 'self'
  | 'ai'
  | 'story'
  | 'guided'
  | 'rapid_fire'
  | 'opposite_opinion'
  | 'real_situation'
  | 'interview';

export type AudienceType = 'GENERAL' | 'KIDS_5_7' | 'KIDS_8_10' | 'KIDS_11_13';

export type TopicDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type TimeLimitSeconds = 30 | 60 | 90 | 120 | 180 | 300;
export type TopicFormat = 'ALL' | 'WORD' | 'PHRASE' | 'SENTENCE';

export type PromptPosition = 'top' | 'middle' | 'bottom' | 'center';
export type PromptFontSize = 'sm' | 'base' | 'lg' | 'xl' | 'md';
export type PromptOpacity = 'solid' | 'medium' | 'translucent' | 'low' | 'high';
export type TopicType =
  | 'SIMPLE_TOPIC'
  | 'STATEMENT'
  | 'SITUATION'
  | 'KIDS_CREATIVE'
  | 'CREATIVE_PROMPT'
  | 'REAL_SITUATION'
  | 'INTERVIEW'
  | 'OPPOSITE_OPINION'
  | 'RAPID_FIRE';

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  topicsCount: number;
  color: string;
  emoji?: string;
  audience?: AudienceType;
}

export interface Topic {
  id: string;
  name: string;
  categoryId: string;
  difficulty?: TopicDifficulty;
  audience?: AudienceType;
  topicType?: TopicType;
  stancePrompt?: string;
  questions?: string[];
  contextScenario?: string;
}

export interface RealPracticeAttempt {
  attemptNumber: number;
  topicId: string;
  topicName: string;
  categoryName: string;
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  fillerCount: number;
  fillerRatePerMinute: number;
  fillerBreakdown: Record<string, number>;
  sentenceCount: number;
  avgWordsPerSentence: number;
  transcript: string;
  videoUrl?: string;
  timestamp: string;
}

export interface AttemptDelta {
  durationDeltaSec: number;
  wordCountDelta: number;
  wpmDelta: number;
  fillerCountDelta: number;
  fillerPercentageReduction: number;
  summaryHighlights: string[];
}

export interface DailyChallengeItem {
  id: string;
  date: string;
  topicName: string;
  categoryId: string;
  categoryName: string;
  difficulty: TopicDifficulty;
  recommendedDurationSeconds: TimeLimitSeconds;
  completed: boolean;
  score?: number;
  description: string;
}

export interface PerformanceMetrics {
  overallScore: number;
  fluency: number;
  relevance: number;
  structure: number;
  vocabulary: number;
  speakingTimeSeconds: number;
  wordCount: number;
  fillerWordsCount: number;
}

export interface Feedback {
  strengths: string[];
  improvements: string[];
}

