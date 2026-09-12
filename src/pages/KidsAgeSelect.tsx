import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { AudienceType } from '../types';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface AgeGroupOption {
  audience: AudienceType;
  num: string;
  title: string;
  ageLabel: string;
  durationLabel: string;
  emoji: string;
  tagline: string;
  highlights: string[];
}

const ageGroups: AgeGroupOption[] = [
  {
    audience: 'KIDS_5_7',
    num: '01',
    title: 'Little Explorers',
    ageLabel: '5 – 7 Years Old',
    durationLabel: '30s timer',
    emoji: '🦁',
    tagline: 'Favorite animals, magic wishes, bedtime rockets, and fun toys!',
    highlights: ['Favorite Animals & Pets', 'Flying & Magic Superpowers', 'Delicious Ice Cream & Snacks', 'Short & Sweet 30s Takes'],
  },
  {
    audience: 'KIDS_8_10',
    num: '02',
    title: 'Curious Builders',
    ageLabel: '8 – 10 Years Old',
    durationLabel: '30–60s timer',
    emoji: '🚀',
    tagline: 'Helpful robots, space exploration, school ideas, and magical inventions!',
    highlights: ['Inventing Helpful Robots', 'Space & Planet Missions', 'Best Friends & Recess Games', 'Cool Inventions & Gadgets'],
  },
  {
    audience: 'KIDS_11_13',
    num: '03',
    title: 'Future Leaders',
    ageLabel: '11 – 13 Years Old',
    durationLabel: '60–90s timer',
    emoji: '⚡',
    tagline: 'Social media, technology, student leadership, esports, and big dreams!',
    highlights: ['AI Tools & Modern Tech', 'Social Media & Student Life', 'Leadership & Team Sports', 'Friendly Debates & Big Ideas'],
  },
];

export const KidsAgeSelect: React.FC = () => {
  const navigate = useNavigate();
  const { switchToKidsMode, switchToNormalMode } = useAppState();

  const handleSelectAgeGroup = (audience: AudienceType) => {
    switchToKidsMode(audience);
    navigate('/categories');
  };

  return (
    <div className="pt-12 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-12 select-none">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300 font-mono-code font-bold text-xs uppercase">
          <span>🧒 SPEAKVAANI KIDS PORTAL</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
          CHOOSE AGE GROUP
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          We tailor fun topics, exciting ideas, and speaking lengths perfectly matched to your age!
        </p>
      </header>

      {/* 3 Age Group Editorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ageGroups.map((group) => (
          <button
            key={group.audience}
            onClick={() => handleSelectAgeGroup(group.audience)}
            className="p-6 sm:p-7 rounded-3xl editorial-surface hover:border-[#0d9488] text-left group cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 shadow-sm hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#0d9488]">
                  {group.num}
                </span>
                <span className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full editorial-subtle text-[var(--text-secondary)]">
                  {group.durationLabel}
                </span>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl block mb-2">{group.emoji}</span>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors">
                  {group.title}
                </h3>
                <span className="font-mono-code text-xs font-bold text-amber-600 dark:text-amber-300 block mt-0.5">
                  {group.ageLabel}
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                  {group.tagline}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--border-primary)]">
                {group.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                    <Sparkles className="w-3 h-3 text-[#0d9488] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full pt-3 border-t border-[var(--border-primary)] flex items-center justify-between font-bold text-xs text-[var(--text-primary)]">
              <span>EXPLORE TOPICS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#0d9488]" />
            </div>
          </button>
        ))}
      </div>

      {/* Back to General Mode button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            switchToNormalMode();
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch back to General Mode</span>
        </button>
      </div>
    </div>
  );
};
