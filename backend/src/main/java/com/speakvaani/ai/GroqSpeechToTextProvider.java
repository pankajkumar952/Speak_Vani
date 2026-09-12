package com.speakvaani.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.speakvaani.dto.SpeechTranscriptionDto;
import com.speakvaani.dto.TranscriptSegmentDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class GroqSpeechToTextProvider implements SpeechToTextProvider {

    private final String apiKey;
    private final String baseUrl;
    private final String model;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GroqSpeechToTextProvider(
        @Value("${app.stt.groq.api-key:}") String apiKey,
        @Value("${app.stt.groq.base-url:https://api.groq.com/openai/v1}") String baseUrl,
        @Value("${app.stt.groq.model:whisper-large-v3-turbo}") String model,
        ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = baseUrl != null && !baseUrl.isBlank() ? baseUrl.trim() : "https://api.groq.com/openai/v1";
        this.model = model != null && !model.isBlank() ? model.trim() : "whisper-large-v3-turbo";
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().baseUrl(this.baseUrl).build();
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public String getProviderName() {
        return "groq-" + model;
    }

    @Override
    public SpeechTranscriptionDto transcribe(Path audioFilePath, String language) {
        if (!isAvailable()) {
            log.warn("Groq STT is not configured: GROQ_API_KEY is missing.");
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Groq API key is not configured. Please set GROQ_API_KEY on the backend.")
                .build();
        }

        if (audioFilePath == null || !Files.exists(audioFilePath)) {
            log.error("Audio recording file not found at: {}", audioFilePath);
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Audio recording file not found on disk.")
                .build();
        }

        try {
            long fileSize = Files.size(audioFilePath);
            if (fileSize == 0) {
                return SpeechTranscriptionDto.builder()
                    .successful(false)
                    .provider(getProviderName())
                    .errorMessage("Recording file is empty (0 bytes).")
                    .build();
            }

            log.info("Sending audio file ({}, {} bytes) to Groq Whisper STT (model: {})...",
                audioFilePath.getFileName(), fileSize, model);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(audioFilePath.toFile()));
            body.add("model", model);
            body.add("response_format", "verbose_json");
            body.add("temperature", "0.0");

            if (language != null && !language.isBlank()) {
                body.add("language", language.toLowerCase().trim());
            }

            String responseBody = restClient.post()
                .uri("/audio/transcriptions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);

            if (responseBody == null || responseBody.isBlank()) {
                return SpeechTranscriptionDto.builder()
                    .successful(false)
                    .provider(getProviderName())
                    .errorMessage("Empty transcription response received from Groq.")
                    .build();
            }

            JsonNode root = objectMapper.readTree(responseBody);
            String transcriptText = root.path("text").asText("");
            String detectedLanguage = root.path("language").asText("english");
            double duration = root.path("duration").asDouble(0.0);

            List<TranscriptSegmentDto> segments = new ArrayList<>();
            JsonNode segmentsNode = root.path("segments");
            if (segmentsNode.isArray()) {
                for (JsonNode seg : segmentsNode) {
                    segments.add(TranscriptSegmentDto.builder()
                        .id(seg.path("id").asInt(0))
                        .start(seg.path("start").asDouble(0.0))
                        .end(seg.path("end").asDouble(0.0))
                        .text(seg.path("text").asText(""))
                        .build());
                }
            }

            log.info("Groq Whisper transcription completed successfully. ({} chars, {} segments, duration: {}s)",
                transcriptText.length(), segments.size(), duration);

            return SpeechTranscriptionDto.builder()
                .text(transcriptText.trim())
                .language(detectedLanguage)
                .durationSeconds(duration > 0 ? duration : null)
                .segments(segments)
                .provider(getProviderName())
                .successful(true)
                .build();

        } catch (HttpClientErrorException.Unauthorized e) {
            log.error("Groq STT authentication failed (401). Invalid GROQ_API_KEY.");
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Invalid GROQ_API_KEY provided.")
                .build();
        } catch (HttpClientErrorException.TooManyRequests e) {
            log.warn("Groq STT rate limit exceeded (429).");
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Groq STT rate limit reached. Please wait a moment before retrying.")
                .build();
        } catch (HttpClientErrorException e) {
            log.error("Groq STT client error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Groq transcription client error: " + e.getMessage())
                .build();
        } catch (HttpServerErrorException e) {
            log.error("Groq STT server error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Groq transcription server error. The service may be temporarily down.")
                .build();
        } catch (Exception e) {
            log.error("Unexpected error during Groq Whisper transcription", e);
            return SpeechTranscriptionDto.builder()
                .successful(false)
                .provider(getProviderName())
                .errorMessage("Failed to transcribe speech: " + e.getMessage())
                .build();
        }
    }
}
