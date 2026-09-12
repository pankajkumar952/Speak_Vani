import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDailyChallenges } from '../data/topics';
import { DailyChallengeItem } from '../types';
import { Flame, Clock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const [challenges] = useState<DailyChallengeItem[]>(mockDailyChallenges);

  const todayChallenge = challenges[0];

  const handleStartDailyChallenge = (ch: DailyChallengeItem) => {
    navigate('/practice', {
      state: {
        mode: 'self',
        categoryId: ch.categoryId,
        categoryName: ch.categoryName,
        topicId: ch.id,
        topicName: ch.topicName,
        difficulty: ch.difficulty,
        audience: 'GENERAL',
        timeLimitSeconds: ch.recommendedDurationSeconds,
      },
    });
  };

  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-12 select-none">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-primary)] pb-6">
        <div>
          <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#0d9488] block mb-1">
            01 // DAILY PRACTICE RITUAL
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
            Daily Challenges
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            One featured topic every day. Build consistency and speech confidence.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full editorial-surface shadow-sm">
          <Flame className="w-4 h-4 text-[#0d9488] fill-current" />
          <div className="text-xs">
            <span className="text-[var(--text-secondary)]">Active Streak: </span>
            <span className="font-mono-code font-bold text-[var(--text-primary)]">4 Days</span>
          </div>
        </div>
      </header>

      {/* Today's Featured Challenge Card */}
      {todayChallenge && (
        <section className="p-6 sm:p-8 rounded-3xl editorial-surface space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0d9488] text-white text-xs font-mono-code font-bold uppercase tracking-wider">
                TODAY'S TOPIC
              </span>
              <span className="text-xs font-bold text-[var(--text-secondary)]">{todayChallenge.categoryName}</span>
            </div>
            <span className="text-xs font-mono-code text-[#0d9488] font-bold">
              +1 Day Streak
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] leading-tight">
              "{todayChallenge.topicName}"
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {todayChallenge.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-[var(--text-muted)] pt-3 border-t border-[var(--border-primary)]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>{todayChallenge.recommendedDurationSeconds}s timer</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>{todayChallenge.difficulty}</span>
            </span>
          </div>

          <div>
            <button
              onClick={() => handleStartDailyChallenge(todayChallenge)}
              className="px-7 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>START TODAY'S CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Previous Archive List */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
          <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            PAST CHALLENGES
          </h3>
        </div>

        <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
          {challenges.slice(1).map((ch, idx) => (
            <div
              key={ch.id}
              onClick={() => handleStartDailyChallenge(ch)}
              className="py-4 px-3 flex items-center justify-between group hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono-code text-xs font-bold text-[var(--text-muted)]">
                  {(idx + 2).toString().padStart(2, '0')}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors">
                    {ch.topicName}
                  </h4>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {ch.categoryName} · {ch.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {ch.completed && (
                  <span className="flex items-center gap-1 text-xs font-mono-code text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed {ch.score ? `(${ch.score})` : ''}</span>
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
