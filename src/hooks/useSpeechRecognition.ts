import { useState, useRef, useCallback, useEffect } from 'react';

// SpeechRecognition type definitions for cross-browser support
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    item(index: number): {
      isFinal: boolean;
      length: number;
      item(index: number): { transcript: string; confidence: number };
      0: { transcript: string; confidence: number };
    };
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string; confidence: number };
    };
  };
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  });

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const isManuallyStoppedRef = useRef<boolean>(false);
  const throttleTimeoutRef = useRef<number | null>(null);
  const latestTranscriptRef = useRef<string>('');

  const flushTranscript = useCallback(() => {
    setTranscript(latestTranscriptRef.current);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition: SpeechRecognitionLike = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      isManuallyStoppedRef.current = false;
      finalTranscriptRef.current = '';
      latestTranscriptRef.current = '';
      setTranscript('');

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + item[0].transcript.trim();
          } else {
            currentInterim += ' ' + item[0].transcript;
          }
        }
        const full = (finalTranscriptRef.current + currentInterim).trim();
        latestTranscriptRef.current = full;

        // Mobile performance optimization: Throttle React state updates to 120ms
        if (!throttleTimeoutRef.current) {
          throttleTimeoutRef.current = window.setTimeout(() => {
            flushTranscript();
            throttleTimeoutRef.current = null;
          }, 120);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event?.error || event);
      };

      recognition.onend = () => {
        // Flush any pending interim transcript
        flushTranscript();
        if (!isManuallyStoppedRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or terminated
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.warn('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  }, [flushTranscript]);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
      throttleTimeoutRef.current = null;
    }
    flushTranscript();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignored
      }
    }
    setIsListening(false);
  }, [flushTranscript]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    latestTranscriptRef.current = '';
    setTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return {
    transcript,
    setTranscript,
    isListening,
    isSupported,
    wordCount,
    startListening,
    stopListening,
    resetTranscript,
  };
}
