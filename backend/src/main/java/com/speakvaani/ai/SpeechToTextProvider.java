package com.speakvaani.ai;

import com.speakvaani.dto.SpeechTranscriptionDto;

import java.nio.file.Path;

public interface SpeechToTextProvider {
    /**
     * Transcribe the given audio/video file (e.g. WebM) into text.
     *
     * @param audioFilePath Absolute or relative path to the recorded media file.
     * @param language Optional ISO language code (e.g. "en"), can be null.
     * @return Transcribed text, duration, language, and segments.
     */
    SpeechTranscriptionDto transcribe(Path audioFilePath, String language);

    /**
     * Returns true if the STT provider is configured with necessary credentials and available.
     */
    boolean isAvailable();

    /**
     * Name identifier of the STT provider (e.g. "groq", "mock").
     */
    String getProviderName();
}
