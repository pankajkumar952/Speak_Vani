import React from 'react';
import { PerformanceMetrics } from '../../types';
import { Clock, MessageSquare, Flame } from 'lucide-react';

interface SpeechStatsProps {
  metrics: PerformanceMetrics;
}

export const SpeechStats: React.FC<SpeechStatsProps> = ({ metrics }) => {
  const minutes = Math.floor(metrics.speakingTimeSeconds / 60);
  const seconds = metrics.speakingTimeSeconds % 60;
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Time Stat */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">Speaking Time</div>
          <div className="text-lg font-bold text-white font-mono">
            {formattedDuration}
          </div>
        </div>
      </div>

      {/* Words Stat */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">Words Spoken</div>
          <div className="text-lg font-bold text-white font-mono">
            {metrics.wordCount} <span className="text-xs font-normal text-slate-400">words</span>
          </div>
        </div>
      </div>

      {/* Filler Words Stat */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">Filler Words</div>
          <div className="text-lg font-bold text-white font-mono">
            {metrics.fillerWordsCount} <span className="text-xs font-normal text-slate-400">words</span>
          </div>
        </div>
      </div>
    </div>
  );
};
