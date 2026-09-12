import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingStatus = 'idle' | 'countdown' | 'recording' | 'paused' | 'recorded' | 'error';

export interface UseRecorderOptions {
  stream: MediaStream | null;
  isFallback?: boolean;
  timeLimitSeconds?: number;
  onTimeUp?: () => void;
}

export function useRecorder({
  stream,
  isFallback = false,
  timeLimitSeconds = 120,
  onTimeUp,
}: UseRecorderOptions) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Mute / Unmute live audio track
  const toggleMute = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    } else {
      setIsMuted((prev) => !prev);
    }
  }, [stream]);

  const getOptimalMimeType = () => {
    const candidates = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm',
      'video/mp4',
    ];
    for (const candidate of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(candidate)) {
        return candidate;
      }
    }
    return 'video/webm';
  };

  const stopRecording = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
      }
    }

    setStatus('recorded');
  }, []);

  const startActualRecording = useCallback(() => {
    chunksRef.current = [];
    setRecordingTime(0);
    setIsTimeUp(false);
    setRecordedBlob(null);
    setStatus('recording');

    // Timer interval with automatic time-up check
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => {
        const next = prev + 1;
        if (next >= timeLimitSeconds) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setIsTimeUp(true);
          stopRecording();
          if (onTimeUp) onTimeUp();
        }
        return next;
      });
    }, 1000);

    // If real media stream available
    if (stream && !isFallback && typeof MediaRecorder !== 'undefined') {
      try {
        const mimeType = getOptimalMimeType();
        const isMobile =
          typeof navigator !== 'undefined' &&
          (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));

        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: isMobile ? 1200000 : 2500000, // 1.2Mbps on mobile for silky smooth encoding
          audioBitsPerSecond: 96000,
        });

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          setRecordedBlob(blob);
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
        };

        // Record in 1s slices to minimize memory pressure
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('MediaRecorder error, falling back to simulated recorder', err);
      }
    }
  }, [stream, isFallback, timeLimitSeconds, stopRecording, onTimeUp]);

  // Start 3-2-1 countdown before recording starts
  const startRecordingFlow = useCallback(() => {
    setStatus('countdown');
    setIsTimeUp(false);
    setCountdown(3);

    let count = 3;
    const tick = () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        timerRef.current = window.setTimeout(tick, 800);
      } else if (count === 0) {
        setCountdown(0);
        timerRef.current = window.setTimeout(() => {
          setCountdown(null);
          startActualRecording();
        }, 600);
      }
    };
    timerRef.current = window.setTimeout(tick, 800);
  }, [startActualRecording]);

  const pauseRecording = useCallback(() => {
    if (status !== 'recording') return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.pause();
      } catch (err) {
        console.warn('Error pausing MediaRecorder:', err);
      }
    }

    setStatus('paused');
  }, [status]);

  const resumeRecording = useCallback(() => {
    if (status !== 'paused') return;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      try {
        mediaRecorderRef.current.resume();
      } catch (err) {
        console.warn('Error resuming MediaRecorder:', err);
      }
    }

    setStatus('recording');

    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => {
        const next = prev + 1;
        if (next >= timeLimitSeconds) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setIsTimeUp(true);
          stopRecording();
          if (onTimeUp) onTimeUp();
        }
        return next;
      });
    }, 1000);
  }, [status, timeLimitSeconds, stopRecording, onTimeUp]);

  const resetRecording = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    chunksRef.current = [];
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    setRecordingTime(0);
    setIsTimeUp(false);
    setCountdown(null);
    setStatus('idle');
  }, [recordedVideoUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [recordedVideoUrl]);

  const remainingSeconds = Math.max(0, timeLimitSeconds - recordingTime);
  const formattedRemainingTime = `${Math.floor(remainingSeconds / 60)}:${
    remainingSeconds % 60 < 10 ? '0' : ''
  }${remainingSeconds % 60}`;

  const formattedElapsedTime = `${Math.floor(recordingTime / 60)}:${
    recordingTime % 60 < 10 ? '0' : ''
  }${recordingTime % 60}`;

  return {
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
  };
}
