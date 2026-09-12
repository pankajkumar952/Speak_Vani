import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { api, TopicInfoData } from '../services/api';
import { getPredefinedSpeechScript } from '../data/mockAIInfo';
import { guidedFrameworkSteps } from '../data/topics';
import { CameraPreview } from '../components/camera/CameraPreview';
import { CountdownOverlay } from '../components/camera/CountdownOverlay';
import { SpeakingGuideTeleprompter } from '../components/camera/SpeakingGuideTeleprompter';
import { FloatingTopic } from '../components/camera/FloatingTopic';
import { useCamera } from '../hooks/useCamera';
import { useRecorder } from '../hooks/useRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { TopicDifficulty, TimeLimitSeconds, AudienceType, PracticeModeType } from '../types';
import {
  Mic,
  MicOff,
  Square,
  Pause,
  Play,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  Scale,
  Zap,
  Briefcase,
  Users,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedTopic,
    selectedCategory,
    selectedMode,
    selectedDifficulty,
    selectedTimeLimit,
    isKidsMode,
    selectedAudience,
    soundEnabled,
  } = useAppState();

  const state = location.state || {};
  const topicName = state.topicName || (selectedTopic ? selectedTopic.name : 'How to Think Fast and Speak Clearly');
  const categoryName = state.categoryName || (selectedCategory ? selectedCategory.name : 'Speaking Practice');
  const categoryId = state.categoryId || selectedCategory?.id || 'cat-1';
  const topicId = state.topicId || selectedTopic?.id || 'top-101';
  const currentMode: PracticeModeType = state.mode || selectedMode || 'self';
  const currentDifficulty: TopicDifficulty = state.difficulty || selectedDifficulty || 'EASY';
  const currentAudience: AudienceType = state.audience || selectedAudience || (isKidsMode ? 'KIDS_5_7' : 'GENERAL');
  const timeLimitSeconds: TimeLimitSeconds = state.timeLimitSeconds || selectedTimeLimit || (isKidsMode ? 60 : 120);

  // Retrieve special prompts if attached
  const stancePrompt: string = state.stancePrompt || (selectedTopic as any)?.stancePrompt || 'Defend why this concept creates disproportionate long-term leverage.';
  const contextScenario: string = state.contextScenario || (selectedTopic as any)?.contextScenario || 'You are addressing key stakeholders. Deliver your point clearly and confidently.';
  const interviewQuestions: string[] = state.questions || (selectedTopic as any)?.questions || [
    'What is your primary thesis on this topic?',
    'What key challenge or roadblock did you encounter?',
    'What measurable outcome or takeaway did you achieve?',
  ];

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [kidsAiInfo, setKidsAiInfo] = useState<TopicInfoData | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState<boolean>(false);

  // Guided Mode Step State (1: Def/Hook -> 2: Example -> 3: Opinion -> 4: Conclusion)
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);

  // Interview Question Index
  const [interviewIndex, setInterviewIndex] = useState<number>(0);

  // Rapid Fire Active Question Index
  const [rapidFireIndex, setRapidFireIndex] = useState<number>(0);
  const rapidFireQuestions = [
    `Take a firm stand on this topic in 5 seconds.`,
    'Explain your core reason or driving logic in 10 seconds.',
    'Give one concrete real-life example or final takeaway in 15 seconds.',
  ];

  // Speech Recognition Hook for real-time live transcript
  const {
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    wordCount,
  } = useSpeechRecognition();


  useEffect(() => {
    let isMounted = true;

    if (currentAudience !== 'GENERAL' || currentMode === 'story') {
      api.getTopicInformation(topicId, topicName, currentAudience).then((info) => {
        if (isMounted && info) {
          setKidsAiInfo(info);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [topicName, topicId, currentAudience, currentMode]);

  // WebRTC Camera Hook
  const { stream, isFallback, isLoading, error } = useCamera(true, true);

  // MediaRecorder API Recording Hook
  const {
    status,
    countdown,
    recordingTime,
    remainingSeconds,
    formattedRemainingTime,
    formattedElapsedTime,
    isMuted,
    isTimeUp,
    recordedVideoUrl,
    recordedBlob,
    toggleMute,
    startRecordingFlow,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  } = useRecorder({
    stream,
    isFallback,
    timeLimitSeconds,
    onTimeUp: () => {
      stopListening();
    },
  });

  // Trigger speech recognition sync with recording status
  useEffect(() => {
    if (status === 'recording') {
      startListening();
    } else if (status === 'paused' || status === 'recorded' || status === 'idle') {
      stopListening();
    }
  }, [status, startListening, stopListening]);

  // Rapid fire automatic step progression based on elapsed seconds
  useEffect(() => {
    if (currentMode === 'rapid_fire' && status === 'recording') {
      if (recordingTime >= 20) {
        setRapidFireIndex(2);
      } else if (recordingTime >= 8) {
        setRapidFireIndex(1);
      } else {
        setRapidFireIndex(0);
      }
    }
  }, [currentMode, status, recordingTime]);

  const handleFinishSession = async () => {
    setIsSubmitting(true);
    stopListening();

    try {
      // 1. Create practice session in backend
      const session = await api.createSession(
        categoryId,
        topicId,
        (currentMode === 'ai' ? 'AI' : currentMode === 'story' ? 'STORY' : 'SELF') as any,
        currentDifficulty,
        timeLimitSeconds,
        currentAudience
      );

      // 2. Upload recording blob
      if (recordedBlob) {
        try {
          await api.uploadRecording(session.sessionId, recordedBlob);
        } catch (uploadErr) {
          console.warn('Recording upload warning:', uploadErr);
        }
      }

      setIsSubmitting(false);
      navigate('/result', {
        state: {
          sessionId: session.sessionId,
          recordedVideoUrl,
          topicName,
          categoryName,
          mode: currentMode,
          difficulty: currentDifficulty,
          audience: currentAudience,
          timeLimitSeconds,
          durationSeconds: recordingTime > 0 ? recordingTime : timeLimitSeconds,
          transcript,
          wordCount,
          attemptNumber: state.attemptNumber || 1,
        },
      });
    } catch (err) {
      console.error('Session completion error:', err);
      setIsSubmitting(false);
      navigate('/result', {
        state: {
          recordedVideoUrl,
          topicName,
          categoryName,
          mode: currentMode,
          difficulty: currentDifficulty,
          audience: currentAudience,
          timeLimitSeconds,
          durationSeconds: recordingTime > 0 ? recordingTime : timeLimitSeconds,
          transcript,
          wordCount,
          attemptNumber: state.attemptNumber || 1,
        },
      });
    }
  };

  const handleRetake = () => {
    resetRecording();
    resetTranscript();
    setGuidedStepIndex(0);
    setInterviewIndex(0);
    setRapidFireIndex(0);
  };

  // Timer urgency color states
  const isUrgent = remainingSeconds <= 10;
  const isFinalSeconds = remainingSeconds <= 5;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070a] text-[#f7f4eb] h-screen w-screen overflow-hidden flex flex-col justify-between select-none">
      {/* Background Camera Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-auto">
        <CameraPreview
          stream={stream}
          isFallback={isFallback}
          isLoading={isLoading}
          error={error}
          isRecording={status === 'recording'}
          recordedVideoUrl={recordedVideoUrl}
        />
        {/* Subtle dark gradient overlay to ensure 100% foreground contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80 pointer-events-none" />
      </div>

      {/* ================= 1. TOP HEADER (INDEPENDENT LAYER) ================= */}
      <header className="relative z-20 w-full pt-4 px-4 sm:px-8 flex items-center justify-between pointer-events-auto">
        {/* Left: Exit & Mode Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(isKidsMode ? '/kids/age' : '/')}
            className="px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            title="Exit Practice"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/15 text-xs font-bold shadow-lg">
            <span>{isKidsMode ? '🧒' : '⚡'}</span>
            <span className="text-slate-200 uppercase tracking-wider">
              {currentMode.replace('_', ' ')} · {categoryName}
            </span>
          </div>
        </div>

        {/* Right: Teleprompter Toggle & Challenge Time Target */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTeleprompter(!showTeleprompter)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono-code transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              showTeleprompter
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-indigo-500/25 border border-indigo-400/40'
                : 'bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-slate-300 hover:text-white'
            }`}
            title="Toggle Smart Voice-Aware Teleprompter"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teleprompter</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/15 text-xs font-bold text-slate-300 shadow-lg">
            <Clock className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{timeLimitSeconds < 60 ? `${timeLimitSeconds}s challenge` : `${timeLimitSeconds / 60}m challenge`}</span>
          </div>
        </div>
      </header>

      {/* Floating Smart Teleprompter Overlay */}
      {showTeleprompter && (
        <SpeakingGuideTeleprompter
          topicName={topicName}
          topicId={topicId}
          categoryId={categoryId}
          categoryName={categoryName}
          difficulty={currentDifficulty}
          audience={currentAudience}
          isRecording={status === 'recording'}
          recordingTime={recordingTime}
          liveSpeechDetected={transcript.length > 0}
        />
      )}

      {/* ================= 2. MAIN CENTER STAGE (FLEX FLOW: TOPIC → TIMER) ================= */}
      <main className="relative z-20 flex-1 w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center gap-4 sm:gap-6 pointer-events-auto my-auto">
        {/* ================= REGION A: DEDICATED TOPIC AREA ================= */}
        <div className="w-full flex justify-center">
          {currentMode === 'guided' ? (
            /* Guided Mode Step Card */
            <div className="w-full p-4 sm:p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-[#0d9488]/40 shadow-2xl space-y-3 text-center">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#0d9488]/20 border border-[#0d9488]/50 text-[#0d9488] font-black text-[10px] uppercase tracking-wider">
                  STEP {guidedStepIndex + 1} OF 4
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{topicName}</span>
                <div className="flex items-center gap-1">
                  {guidedFrameworkSteps.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setGuidedStepIndex(i)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        i === guidedStepIndex ? 'bg-[#0d9488] scale-125' : i < guidedStepIndex ? 'bg-emerald-400' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1 py-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {guidedFrameworkSteps[guidedStepIndex].label}: {guidedFrameworkSteps[guidedStepIndex].subLabel}
                </h4>
                <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  💡 {guidedFrameworkSteps[guidedStepIndex].hint}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <button
                  onClick={() => setGuidedStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={guidedStepIndex === 0}
                  className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  onClick={() => setGuidedStepIndex((prev) => Math.min(3, prev + 1))}
                  disabled={guidedStepIndex === 3}
                  className="px-3 py-1 rounded-full bg-[#0d9488] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : currentMode === 'rapid_fire' ? (
            /* Rapid Fire Card */
            <div className="w-full p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-amber-500/50 shadow-2xl space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-[10px] uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                <span>RAPID FIRE · PROMPT {rapidFireIndex + 1} OF 3</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                {rapidFireQuestions[rapidFireIndex]}
              </h3>
            </div>
          ) : currentMode === 'opposite_opinion' ? (
            /* Opposite Stance Card */
            <div className="w-full p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest border-b border-white/10 pb-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>DEFEND THE COUNTER-STANCE</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">"{topicName}"</h3>
              <p className="text-xs text-slate-200 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl leading-relaxed">
                🎯 <strong>Goal:</strong> {stancePrompt}
              </p>
            </div>
          ) : currentMode === 'real_situation' ? (
            /* Real Situation Card */
            <div className="w-full p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-amber-500/40 shadow-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest border-b border-white/10 pb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>PRACTICAL SCENARIO</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">"{topicName}"</h3>
              <p className="text-xs text-slate-200 bg-white/5 border border-white/10 p-2.5 rounded-xl leading-relaxed">
                🏢 <strong>Context:</strong> {contextScenario}
              </p>
            </div>
          ) : currentMode === 'interview' ? (
            /* Interview Question Card */
            <div className="w-full p-5 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-blue-500/40 shadow-2xl space-y-2 text-center">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-[10px] uppercase tracking-widest">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>QUESTION {interviewIndex + 1} OF {interviewQuestions.length}</span>
                </div>
                {interviewIndex < interviewQuestions.length - 1 && (
                  <button
                    onClick={() => setInterviewIndex((prev) => prev + 1)}
                    className="text-[11px] font-bold text-blue-300 hover:text-white flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                "{interviewQuestions[interviewIndex] || topicName}"
              </h3>
            </div>
          ) : currentMode === 'ai' ? (
            /* Real Speaking Guide Teleprompter */
            <SpeakingGuideTeleprompter
              topicName={topicName}
              topicId={topicId}
              categoryId={categoryId}
              categoryName={categoryName}
              difficulty={currentDifficulty}
              audience={currentAudience}
              isRecording={status === 'recording'}
              recordingTime={recordingTime}
            />
          ) : (
            /* Standard Floating Topic (Self / Kids Story) */
            <FloatingTopic
              topicName={topicName}
              categoryName={categoryName}
              mode={currentMode}
              information={kidsAiInfo?.summary}
              isKidsMode={isKidsMode}
            />
          )}
        </div>

        {/* ================= REGION B: DEDICATED TIMER & COUNTDOWN AREA (NEVER OVERLAPS TOPIC) ================= */}
        <div className="w-full flex flex-col items-center justify-center min-h-[110px] transition-all">
          {/* Phase 1: Countdown 3-2-1-GO (Clean & Restrained) */}
          {status === 'countdown' && (
            <CountdownOverlay
              count={countdown}
              isKidsMode={currentAudience !== 'GENERAL'}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Phase 2: Live Recording Timer */}
          {status === 'recording' && (
            <div
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-full border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in ${
                isFinalSeconds
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 scale-105 animate-pulse'
                  : isUrgent
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                  : 'bg-slate-950/90 border-white/20 text-white'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
                  {formattedRemainingTime}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                ● RECORDING
              </span>
            </div>
          )}

          {/* Phase 3: Paused State */}
          {status === 'paused' && (
            <div className="flex flex-col items-center gap-1 px-6 py-3 rounded-full bg-amber-950/90 border border-amber-500/60 text-amber-300 backdrop-blur-xl shadow-2xl animate-in fade-in">
              <div className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                <span className="font-mono text-xl sm:text-2xl font-black tabular-nums">
                  {formattedRemainingTime}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
                RECORDING PAUSED
              </span>
            </div>
          )}

          {/* Phase 4: Time's Up / Finished State */}
          {status === 'recorded' && (
            <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-950/90 border border-emerald-500/40 text-center shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{isTimeUp ? "TIME'S UP · GREAT JOB!" : "RECORDING COMPLETED!"}</span>
              </div>
              <p className="text-xs text-slate-300">
                Duration: <strong>{formattedElapsedTime}</strong> · Ready for verified speech feedback.
              </p>
            </div>
          )}

          {/* Phase 0: Ready Idle State */}
          {status === 'idle' && (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Press Start to begin your speech
              </span>
            </div>
          )}
        </div>
      </main>

      {/* ================= 3. BOTTOM CONTROL BAR (INDEPENDENT LAYER) ================= */}
      <footer className="relative z-30 w-full pb-6 px-4 flex items-center justify-center pointer-events-auto">
        <div className="flex items-center gap-3 p-2 rounded-full bg-slate-950/90 backdrop-blur-xl border border-white/20 shadow-2xl">
          {status === 'recorded' ? (
            /* Post-Recording Action Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                onClick={handleFinishSession}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0d9488] via-[#10b981] to-[#6366f1] text-white text-xs font-display font-black uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer disabled:opacity-70"
              >
                <span>{isSubmitting ? 'ANALYZING...' : 'FINISH & GET COACHING'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Active Recording Controls */
            <div className="flex items-center gap-2">
              {/* Mic Mute / Unmute */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 text-white hover:bg-white/15'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                aria-label={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Pause / Resume */}
              {status === 'recording' && (
                <button
                  onClick={pauseRecording}
                  className="p-3 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                  title="Pause Recording"
                  aria-label="Pause Recording"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}

              {status === 'paused' && (
                <button
                  onClick={resumeRecording}
                  className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  title="Resume Recording"
                  aria-label="Resume Recording"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              {/* Main Action: START / STOP */}
              {status === 'recording' || status === 'paused' ? (
                <button
                  onClick={stopRecording}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Stop Recording"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>FINISH</span>
                </button>
              ) : (
                <button
                  onClick={startRecordingFlow}
                  disabled={status === 'countdown'}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#0d9488] via-[#10b981] to-[#6366f1] text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer disabled:opacity-60"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span>START SPEAKING</span>
                </button>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
