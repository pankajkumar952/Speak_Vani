import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { TopicReel } from '../components/spinner/TopicReel';
import { Topic, TimeLimitSeconds, TopicDifficulty } from '../types';
import { getCategories, getAudienceLabel, getTopicsByFormat } from '../data/topics';
import { api } from '../services/api';
import { Mic, ArrowRight, Sparkle, FileText, ChevronDown, Check } from 'lucide-react';

const timeOptions: { label: string; seconds: TimeLimitSeconds }[] = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
];

export const Spinner: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCategory,
    selectedTopic,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTimeLimit,
    setSelectedTimeLimit,
    isKidsMode,
    selectedAudience,
  } = useAppState();

  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(selectedCategory?.id);
  const [activeCategoryName, setActiveCategoryName] = useState<string>(selectedCategory?.name || 'Technology & AI');
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'WORD' | 'PHRASE' | 'SENTENCE'>('ALL');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(selectedTopic || null);

  // Browse Questions Modal state
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [browseDifficulty, setBrowseDifficulty] = useState<'ALL' | TopicDifficulty>('ALL');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = getCategories(isKidsMode);

  // Compute filtered questions list for browse modal
  const filteredBrowseTopics = useMemo(() => {
    const pool = getTopicsByFormat(
      activeCategoryId,
      browseDifficulty === 'ALL' ? undefined : browseDifficulty,
      selectedAudience,
      selectedFormat
    );

    if (!searchQuery.trim()) return pool;
    const q = searchQuery.toLowerCase().trim();
    return pool.filter(
      (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
  }, [activeCategoryId, browseDifficulty, selectedAudience, selectedFormat, searchQuery]);


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync category name when activeCategoryId changes
  useEffect(() => {
    if (activeCategoryId) {
      const match = categories.find((c) => c.id === activeCategoryId);
      if (match) setActiveCategoryName(match.name);
    } else {
      setActiveCategoryName('All Domains');
    }
  }, [activeCategoryId, categories]);

  const handleTopicSelected = (winner: Topic) => {
    setCurrentTopic(winner);
    setSelectedTopic(winner);
  };

  const handleGenerateAiTopic = async () => {
    if (isSpinning || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const catId = activeCategoryId || selectedCategory.id || 'cat-1';
      const result = await api.generateDynamicTopic(
        catId,
        selectedDifficulty,
        selectedAudience,
        'SELF'
      );
      const generated: Topic = {
        id: result.id,
        name: result.name,
        categoryId: result.categoryId,
        difficulty: selectedDifficulty,
        audience: selectedAudience,
      };
      setCurrentTopic(generated);
      setSelectedTopic(generated);
    } catch (e) {
      console.warn('AI generation error, fallback:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleStartPractice = (mode: 'self' | 'ai' = 'self') => {
    const finalTopic = currentTopic || selectedTopic;
    const finalTopicName = finalTopic ? finalTopic.name : 'How to Think Fast and Speak Clearly';
    const finalTopicId = finalTopic ? finalTopic.id : 'top-spin';
    const finalCatId = finalTopic ? finalTopic.categoryId : (activeCategoryId || selectedCategory.id);

    navigate('/practice', {
      state: {
        topicName: finalTopicName,
        categoryName: activeCategoryName,
        categoryId: finalCatId,
        topicId: finalTopicId,
        mode,
        difficulty: selectedDifficulty,
        timeLimitSeconds: selectedTimeLimit,
        audience: selectedAudience,
      },
    });
  };

  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 text-center select-none space-y-6">
      {/* Top Header Plate */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full editorial-subtle text-xs font-mono-code font-bold">
          <span>{isKidsMode ? '🧒' : '⚙️'}</span>
          <span className="text-[var(--text-secondary)]">{getAudienceLabel(selectedAudience)}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-[#0d9488] uppercase">{selectedDifficulty}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[var(--text-primary)]">
          PROMPT ROULETTE
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Roll the roulette wheel for an instant impromptu topic or browse 500+ curated questions.
        </p>
      </div>

      {/* Topic Format & Difficulty Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
        {/* Topic Format Selector: ALL / 1-WORD / PHRASE / QUESTION */}
        <div className="flex items-center justify-center gap-1 p-1 rounded-full editorial-subtle text-xs font-mono-code">
          {(
            [
              { id: 'ALL', label: 'ALL' },
              { id: 'WORD', label: '1-WORD' },
              { id: 'PHRASE', label: 'PHRASE' },
              { id: 'SENTENCE', label: 'QUESTION' },
            ] as { id: 'ALL' | 'WORD' | 'PHRASE' | 'SENTENCE'; label: string }[]
          ).map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-[#0d9488] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Difficulty Selector: EASY / MEDIUM / HARD */}
        <div className="flex items-center justify-center gap-1 p-1 rounded-full editorial-subtle text-xs font-mono-code">
          {(
            [
              { id: 'EASY', label: '🟢 EASY' },
              { id: 'MEDIUM', label: '🟡 MEDIUM' },
              { id: 'HARD', label: '🔴 HARD' },
            ] as { id: TopicDifficulty; label: string }[]
          ).map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff.id
                  ? diff.id === 'EASY'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : diff.id === 'MEDIUM'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unique Category Dropdown Selector */}
      <div className="relative w-full max-w-xs mx-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
          className="w-full px-4 py-2.5 rounded-2xl editorial-surface border border-[var(--border-primary)] hover:border-[#0d9488]/60 shadow-sm flex items-center justify-between text-xs font-mono-code transition-all cursor-pointer group"
          aria-expanded={isCategoryDropdownOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-sm">
              {activeCategoryId
                ? categories.find((c) => c.id === activeCategoryId)?.emoji || '💡'
                : '🌐'}
            </span>
            <div className="text-left truncate">
              <div className="text-[10px] text-[var(--text-muted)] font-extrabold uppercase tracking-wider">
                {activeCategoryId
                  ? `CH ${String(categories.findIndex((c) => c.id === activeCategoryId) + 1).padStart(2, '0')} // DOMAIN`
                  : 'ALL DOMAINS'}
              </div>
              <div className="font-bold text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors truncate">
                {activeCategoryName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[var(--text-muted)] group-hover:text-[#0d9488] transition-colors">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isCategoryDropdownOpen ? 'rotate-180 text-[#0d9488]' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Panel */}
        {isCategoryDropdownOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-2xl z-50 max-h-72 overflow-y-auto space-y-1 backdrop-blur-md"
            role="listbox"
          >
            {/* Option: All Domains */}
            <button
              type="button"
              onClick={() => {
                setActiveCategoryId(undefined);
                setIsCategoryDropdownOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-mono-code flex items-center justify-between transition-all cursor-pointer ${
                activeCategoryId === undefined
                  ? 'bg-[#0d9488] text-white shadow-sm font-bold'
                  : 'hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🌐</span>
                <div>
                  <div className="font-bold">All Domains</div>
                  <div className={`text-[10px] ${activeCategoryId === undefined ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                    500+ Mixed Prompts
                  </div>
                </div>
              </div>
              {activeCategoryId === undefined && <Check className="w-4 h-4 text-white shrink-0" />}
            </button>

            {/* Individual Categories */}
            {categories.map((c, idx) => {
              const isActive = activeCategoryId === c.id;
              const channelNumber = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(c.id);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-mono-code flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0d9488] text-white shadow-sm font-bold'
                      : 'hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm shrink-0">{c.emoji || '💡'}</span>
                    <div className="truncate text-left">
                      <div className="font-bold truncate">{c.name}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                        CH {channelNumber} · {c.topicsCount || 52} topics
                      </div>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* The Mechanical Vertical Topic Reel Component */}
      <TopicReel
        categoryId={activeCategoryId}
        categoryName={activeCategoryName}
        difficulty={selectedDifficulty}
        audience={selectedAudience}
        topicFormat={selectedFormat}
        selectedTopic={currentTopic}
        onTopicSelected={handleTopicSelected}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
      />

      {/* ================= ACTION CONTROLS BAR ================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* 1. Direct Impromptu Take */}
        <button
          onClick={() => handleStartPractice('self')}
          disabled={isSpinning || isGeneratingAi}
          className="px-7 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-display font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Mic className="w-4 h-4" />
          <span>START SPEAKING</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* 2. Dedicated Teleprompter Mode */}
        <button
          onClick={() => handleStartPractice('ai')}
          disabled={isSpinning || isGeneratingAi}
          className="px-5 py-3 rounded-full editorial-subtle text-xs font-display font-bold text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Speak with guided Teleprompter cues"
        >
          <FileText className="w-3.5 h-3.5 text-[#0d9488]" />
          <span>TELEPROMPTER</span>
        </button>

        {/* 3. Prominent Unlimited AI Generation Button */}
        <button
          onClick={handleGenerateAiTopic}
          disabled={isSpinning || isGeneratingAi}
          className="px-5 py-3 rounded-full bg-[#0d9488] text-white text-xs font-display font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <Sparkle className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAi ? 'GENERATING...' : '✦ GENERATE WITH AI'}</span>
        </button>
      </div>

      {/* Duration Selector & Browse Question Button */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono-code pt-2">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] font-bold">TIMER:</span>
          <div className="flex items-center p-0.5 rounded-full editorial-subtle">
            {timeOptions.map((opt) => (
              <button
                key={opt.seconds}
                onClick={() => setSelectedTimeLimit(opt.seconds)}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  selectedTimeLimit === opt.seconds
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Question Browser Trigger */}
        <button
          onClick={() => setIsBrowseModalOpen(true)}
          className="px-4 py-1.5 rounded-full editorial-surface border border-[var(--border-primary)] hover:border-[#0d9488] text-[var(--text-primary)] hover:text-[#0d9488] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>🔍</span>
          <span>BROWSE ALL QUESTIONS</span>
        </button>
      </div>

      {/* ================= QUESTION BROWSER MODAL ================= */}
      {isBrowseModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setIsBrowseModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-2xl p-5 sm:p-6 space-y-4 text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-display font-black text-[var(--text-primary)]">
                  Select a Question to Practice
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono-code">
                  Pick any curated question or prompt directly
                </p>
              </div>
              <button
                onClick={() => setIsBrowseModalOpen(false)}
                className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, or keywords..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#0d9488]"
              />

              {/* Difficulty Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono-code">
                {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setBrowseDifficulty(diff)}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      browseDifficulty === diff
                        ? diff === 'EASY'
                          ? 'bg-emerald-600 text-white'
                          : diff === 'MEDIUM'
                          ? 'bg-amber-600 text-white'
                          : diff === 'HARD'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0d9488] text-white'
                        : 'editorial-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {diff === 'EASY'
                      ? '🟢 EASY'
                      : diff === 'MEDIUM'
                      ? '🟡 MEDIUM'
                      : diff === 'HARD'
                      ? '🔴 HARD'
                      : 'ALL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[50vh] pr-1">
              {filteredBrowseTopics.length === 0 ? (
                <div className="text-center py-10 text-xs text-[var(--text-muted)] font-mono-code">
                  No matching topics found. Try a different search keyword or difficulty filter.
                </div>
              ) : (
                filteredBrowseTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => {
                      handleTopicSelected(topic);
                      setIsBrowseModalOpen(false);
                    }}
                    className="p-3.5 rounded-2xl editorial-surface border border-[var(--border-primary)] hover:border-[#0d9488] transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono-code ${
                            topic.difficulty === 'EASY'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : topic.difficulty === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}
                        >
                          {topic.difficulty}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono-code">
                          {topic.id}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[#0d9488] transition-colors leading-relaxed">
                        {topic.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-[11px] font-bold group-hover:bg-[#0d9488] group-hover:text-white transition-all shrink-0 cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
