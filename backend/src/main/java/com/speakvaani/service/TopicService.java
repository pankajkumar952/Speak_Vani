package com.speakvaani.service;

import com.speakvaani.ai.OllamaClient;
import com.speakvaani.dto.TopicDto;
import com.speakvaani.dto.TopicInformationDto;
import com.speakvaani.entity.Category;
import com.speakvaani.entity.Topic;
import com.speakvaani.entity.Topic.Audience;
import com.speakvaani.entity.Topic.TopicDifficulty;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.CategoryRepository;
import com.speakvaani.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final CategoryRepository categoryRepository;
    private final OllamaClient ollamaClient;

    private Category resolveCategory(String categoryIdOrName) {
        if (categoryIdOrName == null || categoryIdOrName.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CATEGORY_REQUIRED", "categoryId parameter is required");
        }

        // 1. Direct ID lookup
        var byId = categoryRepository.findById(categoryIdOrName);
        if (byId.isPresent()) return byId.get();

        // 2. Slug or name lookup
        String normalized = categoryIdOrName.toLowerCase()
            .replace("cat_k_", "")
            .replace("cat-k-", "")
            .replace("cat_", "")
            .replace("cat-", "");

        for (Category c : categoryRepository.findAll()) {
            String cNorm = c.getName().toLowerCase().replace(" & ", "_").replace(" ", "_");
            if (cNorm.contains(normalized) || normalized.contains(cNorm) || c.getId().equalsIgnoreCase(categoryIdOrName)) {
                return c;
            }
        }

        throw new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found: " + categoryIdOrName);
    }

    private Audience parseAudience(String audienceStr) {
        if (audienceStr == null || audienceStr.isBlank()) {
            return Audience.GENERAL;
        }
        try {
            return Audience.valueOf(audienceStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown audience '{}', defaulting to GENERAL", audienceStr);
            return Audience.GENERAL;
        }
    }

    private TopicDifficulty parseDifficulty(String difficultyStr) {
        if (difficultyStr == null || difficultyStr.isBlank()) {
            return TopicDifficulty.EASY;
        }
        try {
            return TopicDifficulty.valueOf(difficultyStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DIFFICULTY", "difficulty must be EASY, MEDIUM, or HARD");
        }
    }

    public List<TopicDto> getTopicsByCategory(String categoryId) {
        return getTopicsByCategory(categoryId, null, null);
    }


    public List<TopicDto> getTopicsByCategory(String categoryId, String difficultyStr, String audienceStr) {

        Category category = resolveCategory(categoryId);
        Audience audience = parseAudience(audienceStr);

        List<Topic> list;
        if (difficultyStr != null && !difficultyStr.isBlank()) {
            TopicDifficulty difficulty = parseDifficulty(difficultyStr);
            list = topicRepository.findByCategoryIdAndDifficultyAndAudience(category.getId(), difficulty, audience);
        } else {
            list = topicRepository.findByCategoryIdAndAudience(category.getId(), audience);
        }

        return list.stream()
            .map(top -> new TopicDto(
                top.getId(),
                top.getName(),
                category.getId(),
                category.getName(),
                top.getDifficulty().name(),
                top.getAudience().name(),
                top.getTopicType().name()
            ))
            .toList();
    }

    public TopicDto getRandomTopic(String categoryId, String difficultyStr, String audienceStr) {
        Category category = resolveCategory(categoryId);
        TopicDifficulty difficulty = parseDifficulty(difficultyStr);
        Audience audience = parseAudience(audienceStr);

        List<Topic> candidateTopics = topicRepository.findByCategoryIdAndDifficultyAndAudience(
            category.getId(),
            difficulty,
            audience
        );

        if (candidateTopics.isEmpty()) {
            // Fallback within same category and audience
            candidateTopics = topicRepository.findByCategoryIdAndAudience(category.getId(), audience);
        }

        if (candidateTopics.isEmpty()) {
            // Fallback within audience across categories if necessary
            candidateTopics = topicRepository.findByAudienceAndDifficulty(audience, difficulty);
        }

        if (candidateTopics.isEmpty()) {
            log.warn("No topics found for category: {} ({}) with difficulty: {} and audience: {}",
                category.getName(), category.getId(), difficulty, audience);
            throw new ApiException(HttpStatus.NOT_FOUND, "TOPIC_NOT_FOUND", "No topics are available for this category, difficulty, and audience.");
        }

        int randomIndex = ThreadLocalRandom.current().nextInt(candidateTopics.size());
        Topic selectedTopic = candidateTopics.get(randomIndex);

        return new TopicDto(
            selectedTopic.getId(),
            selectedTopic.getName(),
            selectedTopic.getCategory().getId(),
            selectedTopic.getCategory().getName(),
            selectedTopic.getDifficulty().name(),
            selectedTopic.getAudience().name(),
            selectedTopic.getTopicType().name()
        );
    }

    private final java.util.Map<String, TopicInformationDto> topicInfoCache = new java.util.concurrent.ConcurrentHashMap<>();

    public TopicInformationDto getTopicInformation(String topicId, String audienceStr) {
        Topic topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "TOPIC_NOT_FOUND", "Topic not found: " + topicId));

        Audience audience = parseAudience(audienceStr != null ? audienceStr : topic.getAudience().name());

        String cacheKey = topic.getId() + "_" + audience.name();
        return topicInfoCache.computeIfAbsent(cacheKey, k -> {
            if (audience != Audience.GENERAL) {
                return ollamaClient.generateKidsTopicInformation(topic.getName(), topic.getCategory().getName(), audience.name());
            } else {
                return ollamaClient.generateTopicInformation(topic.getName(), topic.getCategory().getName());
            }
        });
    }

    public TopicDto generateDynamicTopic(String categoryId, String difficultyStr, String audienceStr, String modeStr) {
        Category category = resolveCategory(categoryId);
        TopicDifficulty difficulty = parseDifficulty(difficultyStr);
        Audience audience = parseAudience(audienceStr);

        try {
            if (ollamaClient.isAvailable()) {
                String aiTopic = ollamaClient.generateDynamicTopic(category.getName(), difficulty.name(), audience.name(), modeStr);
                if (aiTopic != null && !aiTopic.isBlank()) {
                    log.info("Successfully generated dynamic topic via Ollama: '{}'", aiTopic);
                    return new TopicDto(
                        "top-ai-" + System.currentTimeMillis(),
                        aiTopic,
                        category.getId(),
                        category.getName(),
                        difficulty.name(),
                        audience.name(),
                        "DYNAMIC_AI"
                    );
                }
            }
        } catch (Exception e) {
            log.warn("Ollama dynamic generation failed, falling back to local pool: {}", e.getMessage());
        }

        // Fallback to random topic from local database / repository
        return getRandomTopic(categoryId, difficultyStr, audienceStr);
    }

    public List<String> getSpeechScript(String topicId, String topicNameOverride) {
        String topicName = topicNameOverride;
        if ((topicName == null || topicName.isBlank()) && topicId != null) {
            topicName = topicRepository.findById(topicId)
                .map(Topic::getName)
                .orElse("Neural Network");
        }
        if (topicName == null || topicName.isBlank()) {
            topicName = "Neural Network";
        }
        return ollamaClient.generateSpeechScript(topicName);
    }

    public com.speakvaani.dto.TopicSpeakingGuideDto generateSpeakingGuide(String topicName, String categoryName, String difficulty, int angleIndex) {
        if (topicName == null || topicName.isBlank()) {
            topicName = "General Topic";
        }
        return ollamaClient.generateSpeakingGuide(topicName, categoryName, difficulty, angleIndex);
    }
}

