import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, User, Sparkles, Sun, Eye, FlipHorizontal } from 'lucide-react';

export type StudioLightingMode = 'off' | 'studio' | 'warm' | 'dramatic';

interface CameraPreviewProps {
  stream: MediaStream | null;
  isFallback?: boolean;
  isLoading?: boolean;
  error?: string | null;
  recordedVideoUrl?: string | null;
  isRecording?: boolean;
  lightingMode?: StudioLightingMode;
  isBackgroundBlur?: boolean;
  isMirrored?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  stream,
  isFallback = false,
  isLoading = false,
  error = null,
  recordedVideoUrl = null,
  isRecording = false,
  lightingMode: initialLighting = 'off',
  isBackgroundBlur: initialBlur = false,
  isMirrored: initialMirror = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Local state for interactive live studio camera controls
  const [lightingMode, setLightingMode] = useState<StudioLightingMode>(initialLighting);
  const [isBackgroundBlur, setIsBackgroundBlur] = useState<boolean>(initialBlur);
  const [isMirrored, setIsMirrored] = useState<boolean>(initialMirror);

  useEffect(() => {
    if (videoRef.current && stream && !recordedVideoUrl) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, recordedVideoUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[380px] sm:min-h-[420px] bg-slate-950 flex flex-col items-center justify-center text-white p-6 rounded-3xl border border-slate-800">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs sm:text-sm font-medium text-slate-300">Initializing camera feed...</p>
      </div>
    );
  }

  // Previewing recorded video answer
  if (recordedVideoUrl) {
    return (
      <div className="relative w-full h-full min-h-[380px] sm:min-h-[420px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
        <video
          src={recordedVideoUrl}
          controls
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Answer Preview</span>
        </div>
      </div>
    );
  }

  // Filter styling mapping
  const getFilterClass = () => {
    let classes = '';
    if (lightingMode === 'studio') classes += ' camera-filter-studio';
    else if (lightingMode === 'warm') classes += ' camera-filter-warm';
    else if (lightingMode === 'dramatic') classes += ' camera-filter-dramatic';

    if (isBackgroundBlur) classes += ' camera-blur-bg';
    return classes;
  };

  // Real WebRTC Stream Viewport
  if (stream && !isFallback) {
    return (
      <div className="relative w-full h-full min-h-[380px] sm:min-h-[420px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-all duration-300 transform-gpu ${
            isMirrored ? '-scale-x-100' : 'scale-x-100'
          } ${getFilterClass()}`}
          style={{
            transform: `${isMirrored ? 'scaleX(-1)' : 'scaleX(1)'} translate3d(0, 0, 0)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />

        {/* Live Audio Visualizer Pulse Ring Overlay when Recording */}
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none border-3 sm:border-4 border-emerald-500/60 rounded-3xl animate-pulse" />
        )}

        {/* Floating Studio Controls HUD (Positioned bottom-right away from header and timer) */}
        <div className="absolute bottom-24 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-1 sm:gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 sm:py-1.5 rounded-2xl border border-white/15 shadow-xl text-xs text-white select-none">
          {/* Lighting Mode Switcher */}
          <button
            onClick={() => {
              const modes: StudioLightingMode[] = ['off', 'studio', 'warm', 'dramatic'];
              const nextIdx = (modes.indexOf(lightingMode) + 1) % modes.length;
              setLightingMode(modes[nextIdx]);
            }}
            className={`px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono-code font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              lightingMode !== 'off'
                ? 'bg-indigo-600/60 text-indigo-200 border border-indigo-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Studio Lighting Enhancement"
          >
            <Sun className="w-3 h-3 text-amber-300" />
            <span className="capitalize">{lightingMode === 'off' ? 'Lighting' : lightingMode}</span>
          </button>

          {/* Background Blur Toggle */}
          <button
            onClick={() => setIsBackgroundBlur(!isBackgroundBlur)}
            className={`p-1.5 rounded-xl text-[10px] sm:text-[11px] transition-all cursor-pointer ${
              isBackgroundBlur
                ? 'bg-cyan-600/60 text-cyan-200 border border-cyan-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title={isBackgroundBlur ? 'Background Blur Active' : 'Enable Studio Background Vignette'}
          >
            <Eye className="w-3 h-3" />
          </button>

          {/* Mirror Camera Flip Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-1.5 rounded-xl text-[10px] sm:text-[11px] transition-all cursor-pointer ${
              isMirrored
                ? 'bg-white/20 text-white border border-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Flip Mirror Horizontal Mode"
          >
            <FlipHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Fallback Mock Camera Preview Viewport
  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[420px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col items-center justify-center text-white p-6">
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-800/90 border-2 border-indigo-500/40 flex items-center justify-center shadow-xl overflow-hidden">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-3 border-emerald-500 animate-ping opacity-75" />
          )}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <CameraOff className="w-3.5 h-3.5" />
            <span>Mock Camera Mode Active</span>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-slate-100">Camera Viewfinder Ready</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            {error || 'No live hardware camera detected. UI practice and recording flow is simulated seamlessly.'}
          </p>
        </div>
      </div>
    </div>
  );
};
