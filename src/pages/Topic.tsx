import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { getTopicInformation } from '../data/mockAIInfo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PracticeModeType } from '../types';
import { User, Brain, Sparkles, ArrowRight, Video, RotateCcw } from 'lucide-react';

import { api, TopicInfoData } from '../services/api';

export const Topic: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTopic, selectedCategory, selectedMode, setSelectedMode, selectedAudience } = useAppState();

  // If user navigated directly without topic, fallback
  const topicName = selectedTopic ? selectedTopic.name : 'Neural Network';
  const categoryName = selectedCategory ? selectedCategory.name : 'Technology';

  const [currentMode, setCurrentMode] = useState<PracticeModeType>(selectedMode || 'self');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showAiSummary, setShowAiSummary] = useState<boolean>(selectedMode === 'ai');
  const [aiTopicInfo, setAiTopicInfo] = useState<TopicInfoData | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSelectMode = (mode: PracticeModeType) => {
    setCurrentMode(mode);
    setSelectedMode(mode);

    if (mode === 'ai') {
      setAiLoading(true);
      setAiError(null);
      api.getTopicInformation(selectedTopic?.id || 'top-101', topicName, selectedAudience)
        .then((info) => {
          setAiTopicInfo(info);
          setAiLoading(false);
          setShowAiSummary(true);
        })
        .catch((err) => {
          console.warn('Topic information lookup error:', err);
          setAiError('Topic information is temporarily unavailable.');
          setAiLoading(false);
          setShowAiSummary(true);
        });
    } else {
      setShowAiSummary(false);
    }
  };

  const handleStartSpeaking = () => {
    navigate('/practice', {
      state: {
        topicName,
        categoryName,
        mode: currentMode,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header Back Link */}
      <button
        onClick={() => navigate('/spinner')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Spin Another Topic</span>
      </button>

      {/* Main Topic Banner */}
      <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="amber" size="md">
            Today's Topic
          </Badge>
          <Badge variant="violet" size="md">
            {categoryName}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          "{topicName}"
        </h1>
      </Card>

      {/* Mode Choice Selection Section */}
      <div className="space-y-4">
        <h2 className="text-center text-sm font-bold uppercase tracking-wider text-slate-400">
          How do you want to practice?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SELF MODE CHOICE CARD */}
          <div
            onClick={() => handleSelectMode('self')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-3 ${
              currentMode === 'self'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-xl'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-400 font-bold text-base">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>SELF MODE</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Research it yourself. No information will be provided on screen.
            </p>
          </div>

          {/* AI MODE CHOICE CARD */}
          <div
            onClick={() => handleSelectMode('ai')}
            className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-3 ${
              currentMode === 'ai'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-xl'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-300 font-bold text-base">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span>AI MODE</span>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Learn first, then explain. SpeakVaani gives you a quick floating summary.
            </p>
          </div>
        </div>
      </div>

      {/* AI Mode Information Summary Drawer */}
      {currentMode === 'ai' && (
        <Card className="p-6 bg-slate-900 border-indigo-500/40 space-y-4 animate-in fade-in duration-300">
          {aiLoading ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-mono">Preparing your topic information...</p>
            </div>
          ) : aiError ? (
            <div className="py-4 text-center space-y-2 text-emerald-400">
              <p className="text-sm font-semibold">{aiError}</p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI TOPIC BRIEFING · {topicName}</span>
              </div>

              {/* 1. Summary */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-1">SUMMARY</span>
                <p className="text-xs text-slate-200 leading-relaxed border-l-2 border-indigo-500 pl-3">
                  {aiTopicInfo?.summary || `${topicName} is a foundational concept in ${categoryName}.`}
                </p>
              </div>

              {/* 2. Key Points */}
              {aiTopicInfo?.keyPoints && aiTopicInfo.keyPoints.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">KEY POINTS</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {aiTopicInfo.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Talking Points */}
              {aiTopicInfo?.talkingPoints && aiTopicInfo.talkingPoints.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block">TALKING POINTS</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    {aiTopicInfo.talkingPoints.map((tp, i) => (
                      <li key={i}>{tp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. Example */}
              {aiTopicInfo?.example && (
                <div className="space-y-1 pt-1 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">IRL EXAMPLE</span>
                  <p className="text-xs text-slate-300 italic">{aiTopicInfo.example}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Start Speaking CTA Button */}
      <Button
        variant="primary"
        size="lg"
        rightIcon={<Video className="w-5 h-5" />}
        onClick={handleStartSpeaking}
        className="w-full py-4 text-base font-bold bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30"
      >
        Start Speaking On Camera
      </Button>
    </div>
  );
};
