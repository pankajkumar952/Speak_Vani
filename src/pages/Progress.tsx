import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RealPracticeAttempt } from '../types';
import { Mic, Flame, ArrowRight, Dices, Lock, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase, fetchUserCloudAttempts } from '../services/supabaseClient';
import { AuthModal } from '../components/auth/AuthModal';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface OverallProgress {
  totalSessions: number;
  totalSecondsSpoken: number;
  totalWordsSpoken: number;
  streak: number;
  lastSessionDate: string;
  topicsPracticed: string[];
  recentAttempts: RealPracticeAttempt[];
}

export const Progress: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [progress, setProgress] = useState<OverallProgress | null>(null);

  useEffect(() => {
    // 1. Check user auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setLoadingAuth(false);

      if (user) {
        loadUserProgress(user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      setLoadingAuth(false);
      if (user) {
        loadUserProgress(user.id);
      } else {
        setProgress(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProgress = (userId: string) => {
    // Load local progress fallback
    const statsKey = 'speakvaani_user_overall_progress';
    const raw = localStorage.getItem(statsKey);
    let initialStats: OverallProgress | null = null;
    if (raw) {
      try {
        initialStats = JSON.parse(raw);
        setProgress(initialStats);
      } catch (_e) {
        // Ignored
      }
    }

    // Fetch cloud attempts and sync
    fetchUserCloudAttempts(userId).then((cloudAttempts) => {
      if (cloudAttempts && cloudAttempts.length > 0) {
        setProgress((prev) => {
          const totalSec = cloudAttempts.reduce((acc, curr) => acc + curr.durationSeconds, 0);
          const totalWrd = cloudAttempts.reduce((acc, curr) => acc + curr.wordCount, 0);
          const uniqueTopics = Array.from(new Set(cloudAttempts.map((a) => a.topicName)));
          return {
            totalSessions: Math.max(prev?.totalSessions || 0, cloudAttempts.length),
            totalSecondsSpoken: Math.max(prev?.totalSecondsSpoken || 0, totalSec),
            totalWordsSpoken: Math.max(prev?.totalWordsSpoken || 0, totalWrd),
            streak: prev?.streak || 1,
            lastSessionDate: prev?.lastSessionDate || new Date().toISOString().split('T')[0],
            topicsPracticed: uniqueTopics,
            recentAttempts: cloudAttempts.slice(0, 10),
          };
        });
      }
    });
  };

  const formatHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // 1. Loading State
  if (loadingAuth) {
    return (
      <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[#0d9488]/20 mx-auto flex items-center justify-center text-[#0d9488]">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <p className="text-xs font-mono-code text-[var(--text-muted)] uppercase tracking-wider">
            Loading your speech analytics...
          </p>
        </div>
      </div>
    );
  }

  // 2. Gated State: Unauthenticated Users
  if (!currentUser) {
    return (
      <div className="pt-16 pb-24 max-w-3xl mx-auto px-4 sm:px-6 select-none animate-fade-in space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-2xl text-center space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#14b8a6]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Badge */}
          <div className="relative z-10 inline-flex p-4 rounded-2xl bg-[#14b8a6]/15 text-[#14b8a6] shadow-inner border border-[#14b8a6]/30">
            <Lock className="w-8 h-8" />
          </div>

          {/* Headline & Subtitle */}
          <div className="relative z-10 space-y-3 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-4xl font-display font-black text-[var(--text-primary)] tracking-tight">
              Unlock Your Speech Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Progress tracking is a member feature. Sign in to your SpeakVaani account to record speech attempts, monitor your Words-Per-Minute growth, and build daily practice streaks.
            </p>
          </div>

          {/* Feature Showcase Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] space-y-1.5">
              <div className="text-[#14b8a6] flex items-center gap-1.5 text-xs font-bold font-mono-code">
                <TrendingUp className="w-4 h-4" />
                <span>WPM & Fluency</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                Analyze your speech speed, sentence rhythm, and filler reduction over time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] space-y-1.5">
              <div className="text-[#14b8a6] flex items-center gap-1.5 text-xs font-bold font-mono-code">
                <Flame className="w-4 h-4" />
                <span>Daily Streaks</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                Build vocal muscle memory with consecutive daily practice milestones.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] space-y-1.5">
              <div className="text-[#14b8a6] flex items-center gap-1.5 text-xs font-bold font-mono-code">
                <ShieldCheck className="w-4 h-4" />
                <span>Cloud History</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                All recordings and transcripts synced seamlessly across your devices.
              </p>
            </div>
          </div>

          {/* Sign In CTA */}
          <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#14b8a6] hover:bg-[#0d7d72] active:scale-[0.98] text-white font-display font-black text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Access Progress</span>
            </button>
            <button
              onClick={() => navigate('/spinner')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl editorial-subtle text-[var(--text-primary)] hover:text-[#14b8a6] font-display font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Practice as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cloud Authentication Modal */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // 3. Authenticated State: Full Progress View
  const totalSessions = progress?.totalSessions || 0;
  const totalSeconds = progress?.totalSecondsSpoken || 0;
  const topicsCount = progress?.topicsPracticed ? progress.topicsPracticed.length : 0;
  const streak = progress?.streak || 0;
  const recentAttempts: RealPracticeAttempt[] = progress?.recentAttempts || [];

  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-10 select-none animate-fade-in">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full editorial-subtle text-xs font-mono-code text-[#14b8a6] font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CLOUD SYNC ACTIVE</span>
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-[var(--text-primary)]">
            Speech Analytics & Progress
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Logged in as <span className="font-mono-code text-[var(--text-primary)]">{currentUser.email}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/spinner')}
          className="px-4 py-2 rounded-2xl bg-[#14b8a6] hover:bg-[#0d7d72] text-white text-xs font-display font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Spin New Topic</span>
        </button>
      </header>

      {/* Overview Stat Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-1.5">
          <div className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider">
            Total Sessions
          </div>
          <div className="text-3xl font-display font-black text-[var(--text-primary)]">
            {totalSessions}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Speeches delivered</div>
        </div>

        {/* Spoken Time */}
        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-1.5">
          <div className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider">
            Time on Mic
          </div>
          <div className="text-3xl font-display font-black text-[var(--text-primary)]">
            {formatHoursMinutes(totalSeconds)}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Active vocal practice</div>
        </div>

        {/* Unique Topics */}
        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-1.5">
          <div className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider">
            Topics Explored
          </div>
          <div className="text-3xl font-display font-black text-[var(--text-primary)]">
            {topicsCount}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">Distinct domain prompts</div>
        </div>

        {/* Active Streak */}
        <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[#14b8a6]/30 bg-[#14b8a6]/5 space-y-1.5">
          <div className="text-[10px] font-mono-code text-[#14b8a6] uppercase tracking-wider flex items-center gap-1 font-bold">
            <Flame className="w-3.5 h-3.5 fill-[#14b8a6]" />
            <span>Daily Streak</span>
          </div>
          <div className="text-3xl font-display font-black text-[#14b8a6]">{streak} Days</div>
          <div className="text-[11px] text-[var(--text-secondary)]">Keep the fire burning</div>
        </div>
      </section>

      {/* Recent Practice History */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
          Recent Speech Attempts
        </h2>

        {recentAttempts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center space-y-3">
            <p className="text-xs text-[var(--text-muted)]">No recorded speeches yet.</p>
            <button
              onClick={() => navigate('/spinner')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14b8a6] text-white text-xs font-bold font-display"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Deliver Your First Speech</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAttempts.map((att, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--text-secondary)]/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code uppercase bg-[#14b8a6]/15 text-[#14b8a6] font-bold">
                      {att.categoryName || 'General'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono-code">
                      {new Date(att.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold text-[var(--text-primary)]">
                    {att.topicName}
                  </h3>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono-code">
                  <div className="text-center sm:text-right">
                    <div className="text-[var(--text-muted)] text-[10px] uppercase">WPM</div>
                    <div className="font-bold text-[var(--text-primary)] text-sm">{att.wordsPerMinute}</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-[var(--text-muted)] text-[10px] uppercase">Duration</div>
                    <div className="font-bold text-[var(--text-primary)] text-sm">{att.durationSeconds}s</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-[var(--text-muted)] text-[10px] uppercase">Fillers</div>
                    <div className="font-bold text-emerald-400 text-sm">{att.fillerCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
