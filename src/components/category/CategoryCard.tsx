import React from 'react';
import { Category } from '../../types';
import {
  Cpu,
  Dumbbell,
  Gem,
  Compass,
  Trophy,
  Gamepad2,
  Atom,
  Briefcase,
  GraduationCap,
  Film,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onSelect: (category: Category) => void;
  className?: string;
  isFeatured?: boolean;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  Dumbbell,
  Gem,
  Compass,
  Trophy,
  Gamepad2,
  Atom,
  TrendingUp: Briefcase,
  GraduationCap,
  Film,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
  className = '',
  isFeatured = false,
}) => {
  const IconComponent = iconMap[category.iconName] || Cpu;

  return (
    <button
      onClick={() => onSelect(category)}
      className={`category-card rounded-xl p-5 flex flex-col justify-between text-left group cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="icon-container w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#c0c1ff]/40">
          <IconComponent className="w-5 h-5 text-slate-300 group-hover:text-[#c0c1ff] transition-colors" />
        </div>
        {isFeatured && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#c0c1ff] bg-[#c0c1ff]/10 px-2 py-0.5 rounded">
            Featured
          </span>
        )}
      </div>

      <div>
        <h3 className={`font-bold text-slate-100 mb-1 group-hover:text-[#c0c1ff] transition-colors ${isFeatured ? 'text-2xl' : 'text-base'}`}>
          {category.name}
        </h3>
        <p className="text-xs text-[#c7c4d7] line-clamp-2">
          {category.description}
        </p>
      </div>
    </button>
  );
};
