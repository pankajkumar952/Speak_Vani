import React, { useState, useRef, useEffect } from 'react';
import { getCategories } from '../../data/topics';
import { Category } from '../../types';
import { ChevronDown } from 'lucide-react';

interface CategoryDropdownProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const emojiMap: Record<string, string> = {
  cat_tech: '🤖',
  cat_fitness: '🦾',
  cat_luxury: '💎',
  cat_travel: '✈️',
  cat_sports: '⚽',
  cat_gaming: '🎮',
  cat_science: '🔬',
  cat_business: '💼',
  cat_education: '🎓',
  cat_entertainment: '🍿',
};

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = getCategories();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (e: React.MouseEvent, category: Category) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50 pointer-events-auto" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="unprompted-btn-outline unprompted-pill-button inline-flex items-center gap-2 text-sm font-semibold text-[#f7f4eb] hover:border-white/40 cursor-pointer select-none active:scale-95"
      >
        <span className="text-[#0d9488]">✦</span>
        <span>{emojiMap[selectedCategory.id] || '✦'}</span>
        <span>{selectedCategory.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0d9488]' : ''}`} />
      </button>

      {/* Floating Category Menu Panel */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 unprompted-panel rounded-2xl p-2 shadow-2xl z-50 border border-white/20">
          <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-1">
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCategory.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={(e) => handleSelect(e, cat)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#0d9488]/20 text-[#fffdf9] border border-[#0d9488]/40'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-base">{emojiMap[cat.id] || '✦'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-bold">{cat.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
