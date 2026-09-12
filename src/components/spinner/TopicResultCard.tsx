import React from 'react';
import { Topic, PracticeModeType } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { User, Sparkles, ArrowRight, Brain } from 'lucide-react';

interface TopicResultCardProps {
  topic: Topic;
  categoryName: string;
  onChooseMode: (mode: PracticeModeType) => void;
}

export const TopicResultCard: React.FC<TopicResultCardProps> = ({
  topic,
  categoryName,
  onChooseMode,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 sm:p-8 bg-slate-900 border-indigo-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="amber" size="md">
              Selected Topic
            </Badge>
            <Badge variant="violet" size="md">
              {categoryName}
            </Badge>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
            "{topic.name}"
          </h2>
        </div>

        <div className="pt-2 pb-2 border-t border-slate-800 space-y-4">
          <p className="text-sm font-semibold text-slate-300">
            How do you want to practice?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SELF MODE BUTTON */}
            <button
              onClick={() => onChooseMode('self')}
              className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500 text-left space-y-2 transition-all hover:scale-[1.02] shadow-lg group"
            >
              <div className="flex items-center justify-between text-indigo-400 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>SELF MODE</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Research it yourself. No information will be provided on screen.
              </p>
            </button>

            {/* AI MODE BUTTON */}
            <button
              onClick={() => onChooseMode('ai')}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/50 hover:border-indigo-400 text-left space-y-2 transition-all hover:scale-[1.02] shadow-xl group"
            >
              <div className="flex items-center justify-between text-indigo-300 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>AI MODE</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed">
                Learn first, then explain. SpeakVaani gives you a quick floating summary.
              </p>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
