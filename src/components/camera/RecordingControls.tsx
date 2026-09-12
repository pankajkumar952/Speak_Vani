import React from 'react';
import { RecordingStatus } from '../../hooks/useRecorder';
import { Mic, MicOff, Square, RotateCcw, Check, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

interface RecordingControlsProps {
  status: RecordingStatus;
  formattedTime: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRetake: () => void;
  onFinish: () => void;
  isSubmitting?: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  status,
  formattedTime,
  isMuted,
  onToggleMute,
  onStartRecording,
  onStopRecording,
  onRetake,
  onFinish,
  isSubmitting = false,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-4 z-30">
      {/* Live Recording Timer */}
      {status === 'recording' && (
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 backdrop-blur-md shadow-lg animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-sm font-bold tracking-wider">{formattedTime}</span>
          <span className="text-xs uppercase tracking-wider font-semibold">Recording</span>
        </div>
      )}

      {/* Main Controls Bar */}
      <div className="flex items-center justify-center gap-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        {status === 'recorded' ? (
          /* Review State Actions */
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={onRetake}
              className="text-white border-white/20 hover:bg-white/10"
            >
              RETAKE
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={onFinish}
              isLoading={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 font-bold tracking-wider"
            >
              FINISH
            </Button>
          </div>
        ) : (
          /* Live Recording Controls State */
          <>
            {/* Mic Toggle Button */}
            <button
              onClick={onToggleMute}
              disabled={status === 'countdown'}
              className={`p-3.5 rounded-xl transition-all ${
                isMuted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Record / Stop Main Button */}
            {status === 'recording' ? (
              <button
                onClick={onStopRecording}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wider shadow-lg shadow-emerald-600/40 border border-emerald-400/40 transition-all transform active:scale-95"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>STOP RECORDING</span>
              </button>
            ) : (
              <button
                onClick={onStartRecording}
                disabled={status === 'countdown'}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider shadow-lg shadow-indigo-600/40 border border-indigo-400/40 transition-all transform active:scale-95 disabled:opacity-50"
              >
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span>RECORD</span>
              </button>
            )}

            {/* Camera Settings Button */}
            <button
              className="p-3.5 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/10 transition-colors"
              title="Camera Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
