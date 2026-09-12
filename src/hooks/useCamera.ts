import { useState, useEffect, useRef, useCallback } from 'react';

export interface CameraState {
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  permissionDenied: boolean;
  isFallback: boolean;
  hasCamera: boolean;
  hasMic: boolean;
}

export function useCamera(enableVideo = true, enableAudio = true) {
  const [state, setState] = useState<CameraState>({
    stream: null,
    isLoading: true,
    error: null,
    permissionDenied: false,
    isFallback: false,
    hasCamera: true,
    hasMic: true,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState({
        stream: null,
        isLoading: false,
        error: 'Browser media devices API is not supported in this environment.',
        permissionDenied: true,
        isFallback: true,
        hasCamera: false,
        hasMic: false,
      });
      return;
    }

    // Adaptive mobile constraint optimization to prevent GPU/CPU thermal throttling
    const isMobile =
      typeof navigator !== 'undefined' &&
      (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));

    const videoConstraints: MediaTrackConstraints = isMobile
      ? {
          facingMode: 'user',
          width: { ideal: 720, max: 1280 },
          height: { ideal: 720, max: 720 },
          frameRate: { ideal: 30, max: 30 },
        }
      : {
          facingMode: 'user',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 30 },
        };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: enableVideo ? videoConstraints : false,
        audio: enableAudio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      });

      setState({
        stream,
        isLoading: false,
        error: null,
        permissionDenied: false,
        isFallback: false,
        hasCamera: enableVideo,
        hasMic: enableAudio,
      });
    } catch (err: any) {
      console.warn('Camera/Mic permission or device error:', err);
      let errorMsg = 'Could not access camera or microphone.';
      let permissionDenied = false;

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera and microphone access was denied. Please allow permissions in your browser settings to record.';
        permissionDenied = true;
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera or microphone hardware device was detected on your device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Your camera or microphone is already in use by another application.';
      }

      setState({
        stream: null,
        isLoading: false,
        error: errorMsg,
        permissionDenied,
        isFallback: true, // Seamless fallback to high-fidelity simulated camera
        hasCamera: false,
        hasMic: false,
      });
    }
  }, [enableVideo, enableAudio]);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
      setState((prev) => ({ ...prev, stream: null }));
    }
  }, [state.stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
  };
}
