import React from 'react';
import { Feedback } from '../../types';
import { CheckCircle2, ArrowRightCircle } from 'lucide-react';

interface StrengthsWeaknessesProps {
  feedback: Feedback;
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ feedback }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths Card */}
      <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40">
        <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Key Strengths</span>
        </div>
        <ul className="space-y-2">
          {feedback.strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas to Improve Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
        <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400 font-semibold text-sm">
          <ArrowRightCircle className="w-4 h-4" />
          <span>Areas to Improve</span>
        </div>
        <ul className="space-y-2">
          {feedback.improvements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="text-amber-500 mt-0.5">→</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
