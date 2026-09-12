import { RealPracticeAttempt } from '../types';

const PROGRESS_KEY = 'speakvaani_user_overall_progress';
const TOPIC_ATTEMPTS_PREFIX = 'speakvaani_topic_attempts_';

/**
 * Retrieves all stored practice attempts across all topics and overall progress.
 */
export function getStoredHistory(): RealPracticeAttempt[] {
  try {
    const attemptsMap = new Map<string, RealPracticeAttempt>();

    // 1. Check overall progress recent attempts
    const rawProgress = localStorage.getItem(PROGRESS_KEY);
    if (rawProgress) {
      try {
        const progress = JSON.parse(rawProgress);
        if (Array.isArray(progress?.recentAttempts)) {
          progress.recentAttempts.forEach((att: RealPracticeAttempt) => {
            const key = `${att.topicName}_${att.attemptNumber}_${att.timestamp}`;
            attemptsMap.set(key, att);
          });
        }
      } catch (e) {
        console.warn('Failed to parse overall progress history', e);
      }
    }

    // 2. Scan localStorage for topic attempt keys
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(TOPIC_ATTEMPTS_PREFIX)) {
        try {
          const item = localStorage.getItem(storageKey);
          if (item) {
            const attempts: RealPracticeAttempt[] = JSON.parse(item);
            if (Array.isArray(attempts)) {
              attempts.forEach((att) => {
                const key = `${att.topicName}_${att.attemptNumber}_${att.timestamp}`;
                attemptsMap.set(key, att);
              });
            }
          }
        } catch (e) {
          console.warn(`Failed to parse attempts for key ${storageKey}`, e);
        }
      }
    }

    // Convert map values to array and sort by timestamp descending
    const allAttempts = Array.from(attemptsMap.values());
    allAttempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allAttempts;
  } catch (error) {
    console.error('Error fetching stored practice history:', error);
    return [];
  }
}

/**
 * Saves a new practice attempt to local storage.
 */
export function saveStoredAttempt(attempt: RealPracticeAttempt): void {
  try {
    const topicKey = `${TOPIC_ATTEMPTS_PREFIX}${attempt.topicName.replace(/\s+/g, '_')}`;
    const rawStored = localStorage.getItem(topicKey);
    let attempts: RealPracticeAttempt[] = [];

    if (rawStored) {
      try {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed)) {
          attempts = parsed;
        }
      } catch {
        attempts = [];
      }
    }

    attempts.push(attempt);
    localStorage.setItem(topicKey, JSON.stringify(attempts));
  } catch (error) {
    console.error('Error saving practice attempt:', error);
  }
}

/**
 * Clears all stored practice attempts from local storage.
 */
export function clearStoredHistory(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(TOPIC_ATTEMPTS_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing practice history:', error);
  }
}
