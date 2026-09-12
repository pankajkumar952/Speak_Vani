import React from 'react';
import { PerformanceMetrics } from '../../types';

interface MetricsBreakdownProps {
  metrics: PerformanceMetrics;
}

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({ metrics }) => {
  const items = [
    { label: 'Fluency', score: metrics.fluency, color: 'bg-indigo-600' },
    { label: 'Relevance', score: metrics.relevance, color: 'bg-indigo-600' },
    { label: 'Structure', score: metrics.structure, color: 'bg-emerald-600' },
    { label: 'Vocabulary', score: metrics.vocabulary, color: 'bg-blue-600' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
        Skill Breakdown
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="text-slate-900 dark:text-white font-mono">{item.score} / 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
