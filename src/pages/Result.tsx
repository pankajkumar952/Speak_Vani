import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { RealPracticeAttempt, AttemptDelta } from '../types';
import { calculateRealSpeechMetrics, comparePracticeAttempts } from '../utils/speechMetrics';
import { supabase, saveAttemptToCloud } from '../services/supabaseClient';
import {
  RotateCcw,
  Download,
  CheckCircle2,
  TrendingUp,
  Clock,
  Dices,
  FileText,
  Zap,
  Sparkles,
} from 'lucide-react';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTopic, selectedCategory, selectedMode, isKidsMode } = useAppState();

  const state = location.state || {};
  const topicName: string = state.topicName || (selectedTopic ? selectedTopic.name : 'Speaking Challenge');
  const categoryName: string = state.categoryName || (selectedCategory ? selectedCategory.name : 'General');
  const rawMode: string = state.mode || selectedMode || 'self';
  const isKids = isKidsMode || (state.audience && state.audience !== 'GENERAL');
  const durationSeconds: number = Math.max(1, state.durationSeconds || 45);
  const recordedVideoUrl: string | null = state.recordedVideoUrl || null;
  const rawTranscript: string = state.transcript || '';
  const currentAttemptNumber: number = state.attemptNumber || 1;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Deterministic metrics calculation from real spoken transcript & duration
  const [currentAttempt, setCurrentAttempt] = useState<RealPracticeAttempt>(() => {
    const metrics = calculateRealSpeechMetrics(rawTranscript, durationSeconds);
    return {
      attemptNumber: currentAttemptNumber,
      topicId: state.topicId || 'topic-' + topicName.toLowerCase().replace(/\s+/g, '-'),
      topicName,
      categoryName,
      durationSeconds,
      wordCount: metrics.wordCount,
      wordsPerMinute: metrics.wordsPerMinute,
      fillerCount: metrics.fillerCount,
      fillerRatePerMinute: metrics.fillerRatePerMinute,
      fillerBreakdown: metrics.fillerBreakdown,
      sentenceCount: metrics.sentenceCount,
      avgWordsPerSentence: metrics.avgWordsPerSentence,
      transcript: rawTranscript,
      videoUrl: recordedVideoUrl || undefined,
      timestamp: new Date().toISOString(),
    };
  });

  const [previousAttempt, setPreviousAttempt] = useState<RealPracticeAttempt | null>(null);
  const [attemptDelta, setAttemptDelta] = useState<AttemptDelta | null>(null);

  useEffect(() => {
    const metrics = calculateRealSpeechMetrics(rawTranscript, durationSeconds);
    const attempt: RealPracticeAttempt = {
      attemptNumber: currentAttemptNumber,
      topicId: state.topicId || 'topic-' + topicName.toLowerCase().replace(/\s+/g, '-'),
      topicName,
      categoryName,
      durationSeconds,
      wordCount: metrics.wordCount,
      wordsPerMinute: metrics.wordsPerMinute,
      fillerCount: metrics.fillerCount,
      fillerRatePerMinute: metrics.fillerRatePerMinute,
      fillerBreakdown: metrics.fillerBreakdown,
      sentenceCount: metrics.sentenceCount,
      avgWordsPerSentence: metrics.avgWordsPerSentence,
      transcript: rawTranscript,
      videoUrl: recordedVideoUrl || undefined,
      timestamp: new Date().toISOString(),
    };

    setCurrentAttempt(attempt);

    // Save and compare attempts in LocalStorage
    const topicKey = `speakvaani_topic_attempts_${topicName.replace(/\s+/g, '_')}`;
    const rawStored = localStorage.getItem(topicKey);

    if (rawStored) {
      try {
        const storedAttempts: RealPracticeAttempt[] = JSON.parse(rawStored);
        if (Array.isArray(storedAttempts) && storedAttempts.length > 0) {
          const lastAtt = storedAttempts[storedAttempts.length - 1];
          if (lastAtt.attemptNumber < currentAttemptNumber) {
            setPreviousAttempt(lastAtt);
            const delta = comparePracticeAttempts(lastAtt, attempt);
            setAttemptDelta(delta);
          }
        }
        storedAttempts.push(attempt);
        localStorage.setItem(topicKey, JSON.stringify(storedAttempts));
      } catch (_e) {
        localStorage.setItem(topicKey, JSON.stringify([attempt]));
      }
    } else {
      localStorage.setItem(topicKey, JSON.stringify([attempt]));
    }

    // Record session in user overall progress
    recordUserProgress(attempt);

    // Sync to Supabase Cloud if user is signed in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        saveAttemptToCloud(attempt, user);
      }
    });
  }, [topicName, durationSeconds, rawTranscript, currentAttemptNumber]);

  const recordUserProgress = (att: RealPracticeAttempt) => {
    try {
      const statsKey = 'speakvaani_user_overall_progress';
      const raw = localStorage.getItem(statsKey);
      const existing = raw
        ? JSON.parse(raw)
        : {
            totalSessions: 0,
            totalSecondsSpoken: 0,
            totalWordsSpoken: 0,
            streak: 1,
            lastSessionDate: new Date().toISOString().split('T')[0],
            topicsPracticed: [],
            recentAttempts: [],
          };

      const today = new Date().toISOString().split('T')[0];
      let newStreak = existing.streak || 1;
      if (existing.lastSessionDate && existing.lastSessionDate !== today) {
        const lastDate = new Date(existing.lastSessionDate);
        const diffDays = Math.round(
          (new Date(today).getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
        );
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }

      existing.totalSessions += 1;
      existing.totalSecondsSpoken += att.durationSeconds;
      existing.totalWordsSpoken += att.wordCount;
      existing.streak = newStreak;
      existing.lastSessionDate = today;

      const topicsSet = new Set(existing.topicsPracticed || []);
      topicsSet.add(att.topicName);
      existing.topicsPracticed = Array.from(topicsSet);

      const recents: RealPracticeAttempt[] = existing.recentAttempts || [];
      recents.unshift(att);
      existing.recentAttempts = recents.slice(0, 20);

      localStorage.setItem(statsKey, JSON.stringify(existing));
    } catch (_e) {
      // Ignored
    }
  };

  const formatDuration = (secs: number) => {
    const total = Math.round(secs);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = `speakvaani_${topicName.toLowerCase().replace(/\s+/g, '_')}_attempt${currentAttemptNumber}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTryThisTopicAgain = () => {
    navigate('/practice', {
      state: {
        ...state,
        topicName,
        categoryName,
        mode: rawMode,
        attemptNumber: currentAttemptNumber + 1,
      },
    });
  };

  const handleNewTopic = () => {
    navigate('/spinner');
  };

  // ================= KIDS MODE CELEBRATION RESULT =================
  if (isKids) {
    return (
      <div className="pt-12 pb-24 max-w-3xl mx-auto px-4 sm:px-6 space-y-8 select-none text-center">
        <div className="p-8 sm:p-10 rounded-3xl editorial-surface space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300 font-mono-code font-bold text-xs uppercase">
            <span>🧒 KIDS PRACTICE · AGE {state.audience ? state.audience.replace('KIDS_', '').replace('_', '–') : '5–10'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)]">
            AWESOME JOB! 🌟
          </h1>

          <p className="text-base text-[var(--text-secondary)] font-medium">
            You practiced speaking about: <br />
            <strong className="text-[var(--text-primary)] text-lg">"{topicName}"</strong>
          </p>

          {/* Video Player */}
          {recordedVideoUrl && (
            <div className="rounded-2xl overflow-hidden bg-black max-w-lg mx-auto shadow-md border border-[var(--border-primary)]">
              <video
                ref={videoRef}
                src={recordedVideoUrl}
                controls
                playsInline
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Kids Speaking Time Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl editorial-subtle">
            <Clock className="w-5 h-5 text-[#0d9488]" />
            <span className="text-xs font-bold text-[var(--text-secondary)]">You Spoke For:</span>
            <span className="font-mono-code font-black text-xl text-[var(--text-primary)]">
              {formatDuration(currentAttempt.durationSeconds)}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Tip: Try adding one more exciting detail or funny story in your next take!
          </p>

          {/* Kids Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleTryThisTopicAgain}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY AGAIN (TAKE #{currentAttemptNumber + 1})</span>
            </button>

            <button
              onClick={handleNewTopic}
              className="w-full sm:w-auto px-6 py-3 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Dices className="w-4 h-4 text-[#0d9488]" />
              <span>New Adventure Topic</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= GENERAL / PROFESSIONAL PRACTICE RESULT =================
  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-10 select-none">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#0d9488]">
              PRACTICE RESULT
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-xs font-bold text-[var(--text-secondary)]">{categoryName}</span>
            {currentAttemptNumber > 1 && (
              <span className="px-2 py-0.5 rounded-full editorial-subtle font-mono-code text-[10px] font-bold text-[#0d9488]">
                ATTEMPT #{currentAttemptNumber}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-[var(--text-primary)]">
            "{topicName}"
          </h1>
        </div>

        {/* Primary Header Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTryThisTopicAgain}
            className="px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRY AGAIN (#{currentAttemptNumber + 1})</span>
          </button>
        </div>
      </header>

      {/* ================= 1. VIDEO RECORDING PLAYBACK ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>01 // YOUR RECORDING</span>
          </h2>
          <span className="font-mono-code text-xs font-bold text-[var(--text-secondary)]">
            Duration: {formatDuration(currentAttempt.durationSeconds)}
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden editorial-surface shadow-sm">
          {recordedVideoUrl ? (
            <div>
              <video
                ref={videoRef}
                src={recordedVideoUrl}
                controls
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
              <div className="p-4 flex items-center justify-between border-t border-[var(--border-primary)]">
                <span className="text-xs font-mono-code text-[var(--text-secondary)]">
                  Take #{currentAttemptNumber} recorded at {new Date(currentAttempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .webm</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[var(--text-secondary)] text-xs flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 text-[var(--text-muted)]" />
              <span>Audio/Video playback recorded locally in browser.</span>
            </div>
          )}
        </div>
      </section>

      {/* ================= 2. DETERMINISTIC SPEECH METRICS ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-2">
          <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>02 // SPEECH METRICS (DETERMINISTIC)</span>
          </h2>
          <span className="font-mono-code text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            VERIFIED DATA
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl editorial-surface space-y-1">
            <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] block">
              DURATION
            </span>
            <div className="font-mono-code text-2xl font-black text-[var(--text-primary)]">
              {formatDuration(currentAttempt.durationSeconds)}
            </div>
          </div>

          <div className="p-4 rounded-2xl editorial-surface space-y-1">
            <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] block">
              WORDS SPOKEN
            </span>
            <div className="font-mono-code text-2xl font-black text-[var(--text-primary)]">
              {currentAttempt.wordCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl editorial-surface space-y-1">
            <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] block">
              SPEAKING PACE
            </span>
            <div className="font-mono-code text-2xl font-black text-[var(--text-primary)] flex items-baseline gap-1">
              <span>{currentAttempt.wordsPerMinute}</span>
              <span className="text-xs text-[var(--text-secondary)] font-normal">WPM</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] block font-mono-code">
              Optimal: 120–150
            </span>
          </div>

          <div className="p-4 rounded-2xl editorial-surface space-y-1">
            <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] block">
              FILLER WORDS
            </span>
            <div className="font-mono-code text-2xl font-black text-[var(--text-primary)] flex items-baseline gap-1">
              <span>{currentAttempt.fillerCount}</span>
              <span className="text-xs text-[var(--text-secondary)] font-normal">
                ({currentAttempt.fillerRatePerMinute}/m)
              </span>
            </div>
          </div>
        </div>

        {/* Filler Word Breakdown Pills */}
        {Object.keys(currentAttempt.fillerBreakdown).length > 0 ? (
          <div className="p-4 rounded-2xl editorial-subtle space-y-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] block">
              Detected Filler Occurrences:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentAttempt.fillerBreakdown).map(([w, cnt]) => (
                <span
                  key={w}
                  className="px-2.5 py-1 rounded-full editorial-surface border text-xs font-mono-code font-bold text-[var(--text-primary)] flex items-center gap-1.5"
                >
                  <span>"{w}"</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#0d9488]/15 text-[10px] text-[#0d9488] font-black">
                    {cnt}x
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl editorial-subtle flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero filler words detected in speech transcript!</span>
          </div>
        )}
      </section>

      {/* ================= 3. ATTEMPT PROGRESSION & COMPARISON ================= */}
      {previousAttempt && (
        <section className="p-6 sm:p-8 rounded-3xl editorial-surface space-y-6 shadow-sm border-2 border-[#0d9488]/30">
          <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0d9488]" />
              <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                Attempt #{previousAttempt.attemptNumber} vs Attempt #{currentAttempt.attemptNumber} Progression
              </h3>
            </div>
            <span className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0d9488]/10 text-[#0d9488]">
              EMPIRICAL DELTAS
            </span>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl editorial-subtle">
              <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Duration
              </span>
              <div className="font-mono-code text-sm sm:text-base font-black text-[var(--text-primary)] mt-1">
                {formatDuration(previousAttempt.durationSeconds)} →{' '}
                <span className="text-[#0d9488]">{formatDuration(currentAttempt.durationSeconds)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl editorial-subtle">
              <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Words Spoken
              </span>
              <div className="font-mono-code text-sm sm:text-base font-black text-[var(--text-primary)] mt-1">
                {previousAttempt.wordCount} →{' '}
                <span className="text-[#0d9488]">{currentAttempt.wordCount}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl editorial-subtle">
              <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Speaking Pace
              </span>
              <div className="font-mono-code text-sm sm:text-base font-black text-[var(--text-primary)] mt-1">
                {previousAttempt.wordsPerMinute} →{' '}
                <span className="text-[#0d9488]">{currentAttempt.wordsPerMinute} WPM</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl editorial-subtle">
              <span className="font-mono-code text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Filler Words
              </span>
              <div className="font-mono-code text-sm sm:text-base font-black text-[var(--text-primary)] mt-1">
                {previousAttempt.fillerCount} →{' '}
                <span className="text-[#0d9488]">{currentAttempt.fillerCount}</span>
              </div>
            </div>
          </div>

          {/* Objective Code-Calculated Delta Highlights */}
          {attemptDelta && attemptDelta.summaryHighlights.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[var(--border-primary)]">
              <span className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                OBJECTIVE TAKEAWAYS
              </span>
              <div className="space-y-1.5">
                {attemptDelta.summaryHighlights.map((hl, idx) => (
                  <div key={idx} className="text-xs font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ================= 4. SPOKEN TRANSCRIPT ================= */}
      {currentAttempt.transcript ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-2">
            <h2 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>03 // SPOKEN TRANSCRIPT</span>
            </h2>
            <span className="font-mono-code text-xs text-[var(--text-muted)]">
              {currentAttempt.wordCount} words
            </span>
          </div>

          <div className="p-6 rounded-3xl editorial-surface shadow-sm">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-mono-code whitespace-pre-wrap">
              {currentAttempt.transcript}
            </p>
          </div>
        </section>
      ) : null}

      {/* ================= 5. PRACTICE ACTIONS FOOTER ================= */}
      <div className="pt-6 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={handleTryThisTopicAgain}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY THIS TOPIC AGAIN (#{currentAttemptNumber + 1})</span>
        </button>

        <button
          onClick={handleNewTopic}
          className="w-full sm:w-auto px-6 py-3 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Dices className="w-4 h-4 text-[#0d9488]" />
          <span>Spin New Topic</span>
        </button>
      </div>
    </div>
  );
};
