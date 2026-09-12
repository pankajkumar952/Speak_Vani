import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories as getLocalCategories, searchTopics, getRandomTopicWithDeduplication, getAudienceLabel } from '../data/topics';
import { useAppState } from '../context/AppStateContext';
import { Category, TopicDifficulty, Topic } from '../types';
import {
  ArrowRight,
  Search,
  Dices,
  Mic,
  FileText,
  X,
  Filter,
} from 'lucide-react';

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedTopic, isKidsMode, selectedAudience, selectedDifficulty, setSelectedDifficulty } = useAppState();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDifficulty, setActiveDifficulty] = useState<TopicDifficulty | 'ALL'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | 'ALL'>('ALL');

  const categories = useMemo(() => getLocalCategories(isKidsMode), [isKidsMode]);

  // Instant local search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && selectedCategoryFilter === 'ALL' && activeDifficulty === 'ALL') {
      return [];
    }
    const diff = activeDifficulty === 'ALL' ? undefined : activeDifficulty;
    const catId = selectedCategoryFilter === 'ALL' ? undefined : selectedCategoryFilter;
    return searchTopics(searchQuery, catId, diff, selectedAudience);
  }, [searchQuery, activeDifficulty, selectedCategoryFilter, selectedAudience]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    navigate('/spinner');
  };

  const handleRandomTopic = () => {
    const diff = activeDifficulty === 'ALL' ? selectedDifficulty : activeDifficulty;
    const catId = selectedCategoryFilter === 'ALL' ? undefined : selectedCategoryFilter;
    const result = getRandomTopicWithDeduplication(catId, diff, selectedAudience);
    setSelectedTopic(result.topic);
    navigate('/practice', {
      state: {
        topicName: result.topic.name,
        categoryId: result.topic.categoryId,
        topicId: result.topic.id,
        difficulty: result.topic.difficulty,
        audience: selectedAudience,
        mode: 'self',
      },
    });
  };

  const handleLaunchPractice = (topic: Topic, mode: 'self' | 'ai' = 'self') => {
    setSelectedTopic(topic);
    navigate('/practice', {
      state: {
        topicName: topic.name,
        categoryId: topic.categoryId,
        topicId: topic.id,
        difficulty: topic.difficulty,
        audience: selectedAudience,
        mode,
      },
    });
  };

  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-10 select-none">
      {/* Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full editorial-subtle text-xs font-mono-code font-bold">
          <span>{isKidsMode ? '🧒' : '📚'}</span>
          <span className="text-[var(--text-secondary)]">{getAudienceLabel(selectedAudience)}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-[#0d9488] uppercase">50+ TOPICS / CATEGORY</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)]">
          {isKidsMode ? 'CHOOSE YOUR ADVENTURE' : 'TOPIC LIBRARY'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Explore curated speech topics across diverse domains or search 500+ questions instantly.
        </p>
      </header>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="p-4 sm:p-6 rounded-2xl editorial-surface space-y-4 shadow-sm border border-[var(--border-primary)]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics by keyword (AI, ethics, rules, space)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs font-medium border border-[var(--border-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Random Topic Fast Action */}
          <button
            onClick={handleRandomTopic}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-display font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Dices className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Random Topic</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-primary)] text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>DIFFICULTY:</span>
            </span>
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeDifficulty === lvl
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'editorial-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {searchQuery && (
            <span className="text-[var(--text-muted)] font-bold">
              {searchResults.length} topics matched
            </span>
          )}
        </div>
      </div>

      {/* ================= SEARCH RESULTS (IF ACTIVE) ================= */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-2">
            <span className="font-mono-code text-xs font-bold uppercase text-[var(--text-muted)]">
              SEARCH RESULTS ({searchResults.length})
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 space-y-2 editorial-surface rounded-2xl p-6">
              <p className="text-sm font-bold text-[var(--text-primary)]">No matching topics found.</p>
              <p className="text-xs text-[var(--text-secondary)]">Try searching for a different keyword or clearing difficulty filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
              {searchResults.map((topic) => (
                <div
                  key={topic.id}
                  className="py-4 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full editorial-subtle font-mono-code text-[10px] font-bold text-[#0d9488]">
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      "{topic.name}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleLaunchPractice(topic, 'self')}
                      className="px-4 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-90 shadow-sm"
                    >
                      <Mic className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                    <button
                      onClick={() => handleLaunchPractice(topic, 'ai')}
                      className="px-3 py-1.5 rounded-full editorial-subtle text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-[#0d9488]" />
                      <span>Teleprompter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= HIGH-END TACTILE DOMAIN CARDS GRID ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, idx) => {
            const numStr = (idx + 1).toString().padStart(2, '0');
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="group relative rounded-3xl p-5 bg-[var(--surface-primary)] border border-[var(--border-primary)] hover:border-[#0d9488]/60 hover:shadow-xl hover:shadow-[#0d9488]/5 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Top Plate: Domain Index and Topic Counter */}
                <div className="flex items-center justify-between font-mono-code text-[10px] text-[var(--text-muted)] font-extrabold">
                  <span className="px-2 py-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                    DOMAIN {numStr}
                  </span>
                  <span className="text-[#0d9488] tracking-wider uppercase">
                    {cat.topicsCount} TOPICS
                  </span>
                </div>

                {/* Middle Content */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 group-hover:border-[#0d9488]/40 transition-all shadow-sm">
                    {cat.emoji || '💡'}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-display font-black tracking-tight text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-3 border-t border-[var(--border-primary)]/80 flex items-center justify-between text-xs font-mono-code font-bold text-[var(--text-muted)] group-hover:text-[#0d9488] transition-colors">
                  <span>LAUNCH REEL</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#0d9488]" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
