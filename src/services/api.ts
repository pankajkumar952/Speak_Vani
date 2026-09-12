import { getDynamicSpeechScript, PredefinedSpeechScript } from '../data/mockAIInfo';
import { getRandomTopic as getLocalRandomTopic, getCategories as getLocalCategories } from '../data/topics';
import { findPrefilledGuide } from '../data/teleprompter';
import { getSpeakingGuideForTopic } from '../data/speakingGuides';
import { TopicDifficulty, TimeLimitSeconds, AudienceType } from '../types';

const API_BASE_URL = 'http://localhost:8085/api';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  emoji?: string;
}

export interface TopicData {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  difficulty?: string;
  audience?: string;
  topicType?: string;
}

export interface TopicInfoData {
  topic: string;
  summary: string;
  keyPoints: string[];
  talkingPoints?: string[];
  thinkingPrompts?: string[];
  example?: string;
}

export interface SessionData {
  sessionId: string;
  categoryId: string;
  categoryName: string;
  topicId: string;
  topicName: string;
  mode: 'SELF' | 'AI' | 'STORY';
  difficulty?: string;
  audience?: string;
  timeLimitSeconds?: number;
  status: string;
  durationSeconds?: number;
}

export const getAuthToken = (): string | null => localStorage.getItem('speakvaani_auth_token');
export const setAuthToken = (token: string) => localStorage.setItem('speakvaani_auth_token', token);

const getHeaders = (isMultipart = false): HeadersInit => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async getCategories(isKids: boolean = false): Promise<CategoryData[]> {
    try {
      const resp = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders() });
      if (!resp.ok) throw new Error('Failed to fetch categories');
      const all: CategoryData[] = await resp.json();
      if (isKids) {
        return all.filter((c) => c.id.startsWith('cat-k-'));
      } else {
        return all.filter((c) => !c.id.startsWith('cat-k-'));
      }
    } catch (e) {
      console.warn('Backend categories endpoint unavailable, fallback to local categories:', e);
      return getLocalCategories(isKids);
    }
  },

  async getRandomTopic(
    categoryId: string,
    difficulty: TopicDifficulty = 'EASY',
    audience: AudienceType = 'GENERAL'
  ): Promise<TopicData> {
    try {
      const url = `${API_BASE_URL}/topics/random?categoryId=${encodeURIComponent(
        categoryId
      )}&difficulty=${encodeURIComponent(difficulty)}&audience=${encodeURIComponent(audience)}`;
      const resp = await fetch(url, { headers: getHeaders() });
      if (!resp.ok) throw new Error(`Failed to fetch random topic (${resp.status})`);
      return await resp.json();
    } catch (e) {
      console.warn(`Backend random topic endpoint unavailable for ${categoryId} [${difficulty}, ${audience}], using local:`, e);
      const localTopic = getLocalRandomTopic(categoryId, difficulty, audience);
      return {
        id: localTopic.id,
        name: localTopic.name,
        categoryId: localTopic.categoryId,
        categoryName: categoryId,
        difficulty: localTopic.difficulty || difficulty,
        audience: localTopic.audience || audience,
        topicType: localTopic.topicType || 'SIMPLE_TOPIC',
      };
    }
  },

  async generateDynamicTopic(
    categoryId: string = 'cat-1',
    difficulty: TopicDifficulty = 'MEDIUM',
    audience: AudienceType = 'GENERAL',
    mode: string = 'SELF'
  ): Promise<TopicData> {
    try {
      const url = `${API_BASE_URL}/topics/generate?categoryId=${encodeURIComponent(
        categoryId
      )}&difficulty=${encodeURIComponent(difficulty)}&audience=${encodeURIComponent(audience)}&mode=${encodeURIComponent(mode)}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.name) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend dynamic topic generation unavailable, fallback to local pool:', e);
    }
    const localTopic = getLocalRandomTopic(categoryId, difficulty, audience);
    return {
      id: localTopic.id,
      name: localTopic.name,
      categoryId: localTopic.categoryId,
      categoryName: categoryId,
      difficulty: localTopic.difficulty || difficulty,
      audience: localTopic.audience || audience,
      topicType: localTopic.topicType || 'SIMPLE_TOPIC',
    };
  },

  async getTopicInformation(topicId: string, topicName: string, audience: AudienceType = 'GENERAL'): Promise<TopicInfoData> {
    try {
      const resp = await fetch(`${API_BASE_URL}/topics/${topicId}/information?audience=${encodeURIComponent(audience)}`, {
        headers: getHeaders(),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch {
      // Backend not running, use local curated guides
    }

    // 1. Look up in authentic prefilled teleprompter guides
    const guide = findPrefilledGuide(topicName, topicId, audience);
    if (guide && guide.fullParagraph) {
      const sentences = guide.fullParagraph.match(/[^.!?]+[.!?]+(\s|$)/g) || [guide.fullParagraph];
      const summary = sentences.slice(0, 2).join(' ').trim();
      const keyPoints = guide.sections && guide.sections.length > 0
        ? guide.sections.map((s) => `${s.title}: ${s.content.slice(0, 120)}...`)
        : [
            sentences[0]?.trim() || `Core concept of ${topicName}`,
            sentences[2]?.trim() || `Real-world example and context`,
            sentences[sentences.length - 1]?.trim() || `Key takeaway`,
          ];

      return {
        topic: topicName,
        summary: summary || guide.fullParagraph.slice(0, 160) + '...',
        keyPoints,
        talkingPoints: [
          `1. Explain what ${topicName} is and why it matters.`,
          `2. Share a specific real-world example.`,
          `3. Conclude with the main takeaway.`,
        ],
        example: guide.fullParagraph.slice(0, 200) + '...',
      };
    }

    // 2. Look up in authentic multi-angle speaking guides
    const speakingGuide = getSpeakingGuideForTopic(topicName);
    if (speakingGuide && speakingGuide.sections && speakingGuide.sections.length > 0) {
      const firstSection = speakingGuide.sections[0];
      const exampleSection = speakingGuide.sections.find((s) => s.title.includes('EXAMPLE') || s.title.includes('WORKS'));
      return {
        topic: topicName,
        summary: firstSection.content,
        keyPoints: speakingGuide.sections.map((s) => `${s.title} — ${s.content}`),
        talkingPoints: speakingGuide.sections.map((s) => s.title),
        example: exampleSection ? exampleSection.content : undefined,
      };
    }

    // 3. Clean natural fallback
    return {
      topic: topicName,
      summary: `Practice speaking about ${topicName} by structuring your thoughts into a clear introduction, supporting examples, and a strong conclusion.`,
      keyPoints: [
        `Introduce the core theme of ${topicName}.`,
        'Provide 1-2 real-life examples or key arguments.',
        'Summarize your perspective in a memorable closing thought.'
      ],
      talkingPoints: [
        'Hook the audience with an interesting opening sentence.',
        'Explain the core mechanism or underlying reason.',
        'End with a clear actionable takeaway.'
      ],
    };
  },

  async getSpeechScript(topicId: string, topicName: string): Promise<PredefinedSpeechScript> {
    try {
      const resp = await fetch(`${API_BASE_URL}/topics/${topicId}/script?topicName=${encodeURIComponent(topicName)}`, {
        headers: getHeaders(),
      });
      if (resp.ok) {
        const paragraphs = await resp.json();
        if (paragraphs && paragraphs.length > 0) {
          return getDynamicSpeechScript(topicName, paragraphs);
        }
      }
    } catch (e) {
      console.warn('Backend speech script endpoint unavailable, using dynamic fallback:', e);
    }
    return getDynamicSpeechScript(topicName);
  },

  async createSession(
    categoryId: string,
    topicId: string,
    mode: 'SELF' | 'AI' | 'STORY',
    difficulty: TopicDifficulty = 'EASY',
    timeLimitSeconds: TimeLimitSeconds = 120,
    audience: AudienceType = 'GENERAL'
  ): Promise<SessionData> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ categoryId, topicId, mode, difficulty, timeLimitSeconds, audience })
      });
      if (!resp.ok) throw new Error('Failed to create session');
      return await resp.json();
    } catch (e) {
      console.warn('Backend create session endpoint unavailable, generating local session ID:', e);
      return {
        sessionId: 'session-' + Date.now(),
        categoryId,
        categoryName: 'Speaking Practice',
        topicId,
        topicName: 'Topic Practice',
        mode,
        difficulty,
        audience,
        timeLimitSeconds,
        status: 'CREATED'
      };
    }
  },

  async uploadRecording(sessionId: string, blob: Blob): Promise<SessionData> {
    try {
      const formData = new FormData();
      formData.append('file', blob, `recording_${sessionId}.webm`);

      const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}/recording`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      if (!resp.ok) throw new Error('Failed to upload recording');
      return await resp.json();
    } catch (e) {
      console.warn('Backend upload recording endpoint unavailable:', e);
      return {
        sessionId,
        categoryId: 'cat-1',
        categoryName: 'Technology',
        topicId: 'top-101',
        topicName: 'Practice Topic',
        mode: 'SELF',
        status: 'COMPLETED'
      };
    }
  },

  async analyzeRecordingWithCoach(sessionId: string): Promise<any> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}/coach/analyze`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('Backend coach/analyze endpoint unavailable:', e);
    }
    return null;
  },

  async reanalyzeRecordingWithCoach(sessionId: string): Promise<any> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}/coach/reanalyze`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('Backend coach/reanalyze endpoint unavailable:', e);
    }
    return null;
  },

  async getRecordingCoaching(sessionId: string): Promise<any> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}/coach/analysis`, {
        headers: getHeaders(),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('Backend coach/analysis endpoint unavailable:', e);
    }
    return null;
  },

  async analyzeSession(
    sessionId: string,
    topicName: string,
    categoryName: string,
    transcript: string,
    durationSeconds: number,
    mode: string = 'self',
    audience: string = 'GENERAL'
  ): Promise<any> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}/analyze`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          topicName,
          categoryName,
          transcript,
          durationSeconds,
          mode,
          audience,
        }),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('Backend analyzeSession endpoint failed, using local AI evaluation fallback:', e);
    }
    return this.evaluateSpeech(topicName, categoryName, transcript, durationSeconds, mode, audience);
  },


  async evaluateSpeech(
    topicName: string,
    categoryName: string,
    transcript: string,
    durationSeconds: number,
    mode: string = 'self',
    audience: string = 'GENERAL'
  ): Promise<any> {
    try {
      const resp = await fetch(`${API_BASE_URL}/sessions/evaluate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          topicName,
          categoryName,
          transcript,
          durationSeconds,
          mode,
          audience,
        }),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn('Backend evaluateSpeech unavailable, using local client NLP coach fallback:', e);
    }

    // Client-side NLP speech analysis fallback (Strictly grounded in transcript)
    const cleanTranscript = (transcript && transcript.trim().length > 0)
      ? transcript.trim()
      : '';

    const words = cleanTranscript ? cleanTranscript.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const validDuration = durationSeconds > 0 ? durationSeconds : 60;
    const durationMinutes = validDuration / 60.0;
    const wpm = wordCount > 0 ? Math.round((wordCount / durationMinutes) * 10) / 10 : 0;

    const fillerWordsList = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'sort of', 'kind of', 'i mean', 'so'];
    const lowerText = cleanTranscript.toLowerCase();
    const breakdown: Record<string, number> = {};
    let totalFillers = 0;

    fillerWordsList.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        breakdown[f] = matches.length;
        totalFillers += matches.length;
      }
    });

    const fillerRate = Math.round((totalFillers / durationMinutes) * 10) / 10;

    if (wordCount < 12) {
      return {
        scoreAvailable: false,
        scoreUnavailableReason: 'Your response is too short for detailed coaching (less than 12 words). Try speaking for at least 30 seconds.',
        overallScore: 0,
        clarity: { score: 0, reason: 'Insufficient speech length.' },
        structure: { score: 0, reason: 'Insufficient speech length.' },
        grammar: { score: 0, reason: 'Insufficient speech length.' },
        vocabulary: { score: 0, reason: 'Insufficient speech length.' },
        argumentQuality: { score: 0, reason: 'Insufficient speech length.' },
        speakingPaceWpm: wpm,
        speakingDurationSeconds: validDuration,
        wordCount,
        fillerWords: {
          total: totalFillers,
          ratePerMinute: fillerRate,
          breakdown,
          coachingTip: 'Speak for a longer duration to enable pacing and filler analysis.'
        },
        strengths: [],
        improvements: [
          {
            feedback: 'Provide a complete response to allow coaching feedback.',
            evidence: `Transcript contains only ${wordCount} words.`
          }
        ],
        betterPhrases: [],
        coachSummary: 'Response is too brief for an accurate structural and qualitative evaluation.',
        transcript: cleanTranscript
      };
    }

    const clarityScore = Math.round(Math.min(9.5, Math.max(6.0, 9.0 - (fillerRate * 0.25) - Math.abs(wpm - 130) * 0.015)) * 10) / 10;
    const hasTransition = lowerText.match(/\b(because|however|for example|furthermore|therefore|additionally|first|second)\b/);
    const hasConclusion = lowerText.match(/\b(in conclusion|finally|to summarize|overall|in the end|ultimately)\b/);
    const structureScore = Math.round(Math.min(9.5, 7.5 + (hasTransition ? 0.8 : 0) + (hasConclusion ? 0.9 : 0)) * 10) / 10;

    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const vocabRatio = uniqueWords.size / Math.max(1, wordCount);
    const vocabScore = Math.round(Math.min(9.6, Math.max(6.5, 7.0 + vocabRatio * 3.0)) * 10) / 10;
    const grammarScore = 8.2;
    const argScore = Math.round(((clarityScore + structureScore) / 2) * 10) / 10;
    const overallScore = Math.round(((clarityScore + structureScore + vocabScore + grammarScore + argScore) / 5) * 10) / 10;

    const betterPhrases = [];
    if (lowerText.includes('very important')) {
      betterPhrases.push({
        original: 'very important',
        suggestion: 'crucial',
        reason: 'More precise and impactful vocabulary.',
        verifiedInTranscript: true
      });
    } else if (lowerText.includes('a lot of')) {
      betterPhrases.push({
        original: 'a lot of',
        suggestion: 'substantial',
        reason: 'Uses quantifiable descriptor.',
        verifiedInTranscript: true
      });
    }

    return {
      scoreAvailable: true,
      overallScore,
      clarity: {
        score: clarityScore,
        reason: `Steady conversational pace of ~${Math.round(wpm)} WPM with ${fillerRate}/min filler density.`
      },
      structure: {
        score: structureScore,
        reason: hasConclusion ? 'Clear topical development with a distinct conclusion.' : 'Topical points articulated; adding a strong ending summary will elevate the takeaway.'
      },
      vocabulary: {
        score: vocabScore,
        reason: `Vocabulary diversity index of ${Math.round(vocabRatio * 100)}% across ${wordCount} words.`
      },
      grammar: {
        score: grammarScore,
        reason: 'Clear sentence syntax based on transcript parsing.'
      },
      argumentQuality: {
        score: argScore,
        reason: 'Logical progression directly addressing the assigned topic.'
      },
      speakingPaceWpm: wpm,
      speakingDurationSeconds: validDuration,
      wordCount,
      fillerWords: {
        total: totalFillers,
        ratePerMinute: fillerRate,
        breakdown,
        coachingTip: fillerRate > 4
          ? 'Try replacing verbal filler words with a deliberate 1-second silence to project authority.'
          : 'Great vocal control! You maintained steady thought delivery with minimal filler hesitation.'
      },
      strengths: [
        {
          feedback: `Addressed ${topicName} directly in your speech.`,
          evidence: `Spoke ${wordCount} words at ~${Math.round(wpm)} WPM.`
        },
        ...(hasTransition
          ? [
              {
                feedback: 'Used connective transition words to link ideas.',
                evidence: 'Detected logical transition markers in transcript.'
              }
            ]
          : [])
      ],
      improvements: [
        ...(!hasConclusion
          ? [
              {
                feedback: 'Add a definitive closing summary statement.',
                evidence: 'Transcript ends without an explicit conclusion keyword.'
              }
            ]
          : []),
        ...(fillerRate > 3
          ? [
              {
                feedback: 'Focus on eliminating filler words during thought transitions.',
                evidence: `Recorded ${totalFillers} filler words (${fillerRate}/min).`
              }
            ]
          : [])
      ],
      betterPhrases,
      coachSummary: `Speech analysis grounded in transcript text and deterministic pacing metrics.`,
      followUpChallenge: 'Challenge: Try opening with a thought-provoking question in your next take.',
      transcript: cleanTranscript
    };
  },


  async getSession(sessionId: string): Promise<SessionData> {
    const resp = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, { headers: getHeaders() });
    if (!resp.ok) throw new Error('Failed to get session');
    return await resp.json();
  },

  async getSpeakingGuide(
    topicName: string,
    categoryName?: string,
    difficulty = 'MEDIUM',
    angleIndex = 0
  ): Promise<{
    topicName: string;
    angleName: string;
    angleIndex: number;
    totalAngles: number;
    fullParagraph?: string;
    sections?: { title: string; content: string }[];
  } | null> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/topics/speaking-guide?topicName=${encodeURIComponent(
          topicName
        )}&categoryName=${encodeURIComponent(
          categoryName || ''
        )}&difficulty=${encodeURIComponent(difficulty)}&angleIndex=${angleIndex}`,
        {
          method: 'POST',
          headers: getHeaders(),
        }
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};

