import { createClient, User, Session } from '@supabase/supabase-js';
import { RealPracticeAttempt } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yqqrujxffagnowkopird.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcXJ1anhmZmFnbm93a29waXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDk1ODUsImV4cCI6MjEwMjk4NTU4NX0.DE5Bmn1ZyAuj9_dnDrk6KUEEtQpe9IuJDfrUCcNHYh4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

/**
 * Upload recorded speech video blob to Supabase Storage
 */
export async function uploadSpeechVideo(
  blob: Blob,
  userId: string,
  attemptId: string
): Promise<string | null> {
  try {
    const fileName = `${userId}/${attemptId}_${Date.now()}.webm`;
    const { data, error } = await supabase.storage
      .from('speech-recordings')
      .upload(fileName, blob, {
        contentType: 'video/webm',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('speech-recordings')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Failed to upload video to Supabase:', err);
    return null;
  }
}

/**
 * Save practice attempt directly to Supabase cloud database
 */
export async function saveAttemptToCloud(
  attempt: RealPracticeAttempt,
  user: User
): Promise<boolean> {
  try {
    const { error } = await supabase.from('practice_attempts').insert({
      user_id: user.id,
      topic_id: attempt.topicId,
      topic_name: attempt.topicName,
      category_name: attempt.categoryName,
      duration_seconds: attempt.durationSeconds,
      word_count: attempt.wordCount,
      words_per_minute: attempt.wordsPerMinute,
      filler_count: attempt.fillerCount,
      filler_rate_per_minute: attempt.fillerRatePerMinute,
      sentence_count: attempt.sentenceCount,
      avg_words_per_sentence: attempt.avgWordsPerSentence,
      transcript: attempt.transcript,
      video_url: attempt.videoUrl,
      created_at: attempt.timestamp,
    });

    if (error) {
      console.warn('Supabase insert attempt error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save attempt to cloud:', err);
    return false;
  }
}

/**
 * Fetch all cloud practice attempts for a user
 */
export async function fetchUserCloudAttempts(userId: string): Promise<RealPracticeAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('practice_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Failed to fetch cloud attempts:', error);
      return [];
    }

    return data.map((d) => ({
      attemptNumber: 1,
      topicId: d.topic_id,
      topicName: d.topic_name,
      categoryName: d.category_name,
      durationSeconds: d.duration_seconds,
      wordCount: d.word_count,
      wordsPerMinute: d.words_per_minute,
      fillerCount: d.filler_count,
      fillerRatePerMinute: d.filler_rate_per_minute,
      fillerBreakdown: {},
      sentenceCount: d.sentence_count,
      avgWordsPerSentence: d.avg_words_per_sentence,
      transcript: d.transcript,
      videoUrl: d.video_url,
      timestamp: d.created_at,
    }));
  } catch (err) {
    console.warn('Error fetching cloud attempts:', err);
    return [];
  }
}
