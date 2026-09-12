import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { DotMatrixWaveform } from '../components/ui/DotMatrixWaveform';
import { api } from '../services/api';
import {
  Mic,
  Dices,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';
import { getRandomTopicWithDeduplication } from '../data/topics';
import { supabase } from '../services/supabaseClient';
import { AuthModal } from '../components/auth/AuthModal';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const {
    setSelectedTopic,
    setSelectedCategory,
    isKidsMode,
    selectedAudience,
    switchToNormalMode,
  } = useAppState();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [spinTopicPreview, setSpinTopicPreview] = useState<string>(
    'Should artificial intelligence replace traditional classroom teachers?'
  );

  const handleStartPractice = () => {
    navigate('/practice');
  };

  const handleSpinTopic = () => {
    const result = getRandomTopicWithDeduplication(undefined, 'MEDIUM', selectedAudience);
    const random = result.topic;
    setSpinTopicPreview(random.name);
    setSelectedTopic(random);
    setSelectedCategory({
      id: random.categoryId,
      name: 'Impromptu Selection',
      description: 'Selected via instant spinner',
      iconName: 'Dices',
      topicsCount: 1,
      color: '#0d9488',
    });
  };

  const practiceTracks = [
    {
      num: '01',
      title: 'Quick Speak',
      tagline: 'Impromptu speaking on random verified prompts.',
      mode: 'self',
      badge: 'POPULAR',
    },
    {
      num: '02',
      title: 'Guided Steps',
      tagline: 'Framework delivery (Hook → Example → Takeaway).',
      mode: 'guided',
      badge: 'STRUCTURE',
    },
    {
      num: '03',
      title: 'Interview Simulator',
      tagline: 'Timed behavioral and situational interview questions.',
      mode: 'interview',
      badge: 'CAREER',
    },
    {
      num: '04',
      title: 'Real Situations',
      tagline: 'Handle critical conversations, meetings, and negotiations.',
      mode: 'real_situation',
      badge: 'SCENARIO',
    },
    {
      num: '05',
      title: 'Opposite Opinion',
      tagline: 'Defend unfamiliar viewpoints to build mental agility.',
      mode: 'opposite_opinion',
      badge: 'AGILITY',
    },
    {
      num: '06',
      title: 'Rapid Fire',
      tagline: 'High-pressure 5s, 10s, and 15s instant articulation.',
      mode: 'rapid_fire',
      badge: 'SPEED',
    },
  ];

  return (
    <div className="pt-12 sm:pt-16 pb-24 max-w-5xl mx-auto px-4 sm:px-6 space-y-20 select-none">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="text-center space-y-8 pt-6 sm:pt-10">
        {/* Low-profile top metadata pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full editorial-subtle text-xs font-mono-code font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
          <span className="text-[var(--text-secondary)] tracking-wide">
            SPEECH PRACTICE PLATFORM · {isKidsMode ? 'KIDS MODE' : 'GENERAL EDITION'}
          </span>
        </div>

        {/* Oversized Editorial Typography Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-[var(--text-primary)] leading-[0.95] uppercase">
            SPEAK. THINK. <br />
            <span className="text-[#0d9488]">IMPROVE.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed font-medium">
          Practice spontaneous speaking, presentation delivery, and impromptu communication through short repeatable challenges.
        </p>

        {/* Signature Dot-Matrix Waveform Component */}
        <div className="py-2">
          <DotMatrixWaveform />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartPractice}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Mic className="w-4 h-4" />
            <span>START SPEAKING</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/spinner')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-[#0d9488]" />
            <span>SPIN FOR A TOPIC</span>
          </button>

          {!currentUser ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-[#14b8a6] font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIGN IN / JOIN</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--surface-secondary)] text-[var(--text-primary)] font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>MY PROFILE</span>
            </button>
          )}
        </div>
      </section>

      {/* ================= 2. NUMBERED HOW IT WORKS ================= */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
          <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            01 // THE PRACTICE FRAMEWORK
          </span>
          <span className="font-mono-code text-xs text-[var(--text-muted)]">
            4 STEPS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Choose or Spin', desc: 'Pick a category or spin for an unexpected speaking prompt.' },
            { num: '02', title: 'Speak & Record', desc: 'Deliver your take using your camera and live pacing timer.' },
            { num: '03', title: 'Review Real Metrics', desc: 'Inspect duration, words, WPM, and exact filler occurrences.' },
            { num: '04', title: 'Try Again & Improve', desc: 'Record another take and compare metrics side-by-side.' },
          ].map((step) => (
            <div key={step.num} className="space-y-2 border-l border-[var(--border-primary)] pl-4">
              <span className="font-mono-code text-xs font-bold text-[#0d9488]">
                {step.num}
              </span>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. NUMBERED EDITORIAL PRACTICE TRACKS ================= */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
          <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            02 // PRACTICE TRACKS
          </span>
          <span className="font-mono-code text-xs text-[var(--text-muted)]">
            6 MODES
          </span>
        </div>

        <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
          {practiceTracks.map((track) => (
            <div
              key={track.num}
              onClick={() => {
                navigate('/practice', { state: { mode: track.mode } });
              }}
              className="py-4 px-3 sm:px-4 flex items-center justify-between group hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="font-mono-code text-xs font-bold text-[var(--text-muted)] group-hover:text-[#0d9488] transition-colors">
                  {track.num}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors">
                      {track.title}
                    </h3>
                    <span className="px-2 py-0.2 rounded-full editorial-subtle font-mono-code text-[10px] font-bold text-[var(--text-secondary)]">
                      {track.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-md">
                    {track.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <span className="hidden sm:inline">Start Track</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. INSTANT SPINNER PREVIEW ================= */}
      <section className="p-6 sm:p-8 rounded-2xl editorial-surface space-y-6 shadow-sm border border-[var(--border-primary)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dices className="w-4 h-4 text-[#0d9488]" />
            <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              03 // TOPIC ROULETTE
            </span>
          </div>
          <button
            onClick={handleSpinTopic}
            className="px-3.5 py-1 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Spin Again</span>
          </button>
        </div>

        <div className="space-y-2">
          <span className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
            SELECTED PROMPT
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] leading-snug">
            "{spinTopicPreview}"
          </h2>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              navigate('/practice', {
                state: {
                  topicName: spinTopicPreview,
                  mode: 'self',
                },
              });
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>PRACTICE THIS TOPIC</span>
          </button>

          <button
            onClick={() => {
              navigate('/practice', {
                state: {
                  topicName: spinTopicPreview,
                  mode: 'ai',
                },
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full editorial-subtle text-xs font-display font-bold text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>TELEPROMPTER</span>
          </button>

          <button
            onClick={async () => {
              try {
                const res = await api.generateDynamicTopic('cat-1', 'MEDIUM', selectedAudience);
                setSpinTopicPreview(res.name);
                setSelectedTopic({
                  id: res.id,
                  name: res.name,
                  categoryId: res.categoryId,
                  difficulty: 'MEDIUM',
                  audience: selectedAudience,
                });
              } catch (_e) {
                handleSpinTopic();
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0d9488] text-white font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>✦ GENERATE WITH AI</span>
          </button>

          <button
            onClick={() => navigate('/spinner')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Topic Wheel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ================= 5. FOOTER CTA ================= */}
      <section className="pt-8 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)]">
          READY TO ELEVATE YOUR DELIVERY?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          No signups or credentials required to get started. Choose a topic and practice your first take immediately.
        </p>
        <div className="pt-2">
          <button
            onClick={handleStartPractice}
            className="px-8 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            START YOUR FIRST TAKE
          </button>
        </div>
      </section>

      {/* Cloud Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};
