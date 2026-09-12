package com.speakvaani.ai;

import com.speakvaani.dto.SpeechTranscriptionDto;
import com.speakvaani.dto.TranscriptSegmentDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.List;

@Component
@Slf4j
public class MockSpeechToTextProvider implements SpeechToTextProvider {

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public String getProviderName() {
        return "mock-stt";
    }

    @Override
    public SpeechTranscriptionDto transcribe(Path audioFilePath, String language) {
        log.info("Executing MockSpeechToTextProvider for file: {}", audioFilePath);

        String sampleTranscript = "Good afternoon everyone. Today I would like to talk about the impact of artificial intelligence in education. "
            + "Um, basically, AI allows students to receive personalized learning paths tailored to their unique pace. "
            + "However, like, human teachers provide empathy, emotional support, and mentorship that algorithms cannot replicate. "
            + "In conclusion, I believe the future lies in human-AI synergy rather than complete replacement.";

        return SpeechTranscriptionDto.builder()
            .text(sampleTranscript)
            .language("english")
            .durationSeconds(45.0)
            .segments(List.of(
                new TranscriptSegmentDto(0, 0.0, 8.5, "Good afternoon everyone. Today I would like to talk about the impact of artificial intelligence in education."),
                new TranscriptSegmentDto(1, 8.5, 22.0, "Um, basically, AI allows students to receive personalized learning paths tailored to their unique pace."),
                new TranscriptSegmentDto(2, 22.0, 35.0, "However, like, human teachers provide empathy, emotional support, and mentorship that algorithms cannot replicate."),
                new TranscriptSegmentDto(3, 35.0, 45.0, "In conclusion, I believe the future lies in human-AI synergy rather than complete replacement.")
            ))
            .provider(getProviderName())
            .successful(true)
            .build();
    }
}
