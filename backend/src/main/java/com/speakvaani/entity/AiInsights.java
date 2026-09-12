package com.speakvaani.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "ai_insights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsights {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Id
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private PracticeSession session;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengthsJson;

    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknessesJson;

    @Column(name = "suggestions", columnDefinition = "TEXT")
    private String suggestionsJson;

    @Column(name = "improved_answer", columnDefinition = "TEXT")
    private String improvedAnswer;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    public String[] getStrengths() {
        return jsonToArray(strengthsJson);
    }

    public void setStrengths(String[] strengths) {
        this.strengthsJson = arrayToJson(strengths);
    }

    public String[] getWeaknesses() {
        return jsonToArray(weaknessesJson);
    }

    public void setWeaknesses(String[] weaknesses) {
        this.weaknessesJson = arrayToJson(weaknesses);
    }

    public String[] getSuggestions() {
        return jsonToArray(suggestionsJson);
    }

    public void setSuggestions(String[] suggestions) {
        this.suggestionsJson = arrayToJson(suggestions);
    }

    private static String arrayToJson(String[] array) {
        if (array == null || array.length == 0) return "[]";
        try {
            return MAPPER.writeValueAsString(Arrays.asList(array));
        } catch (Exception e) {
            return "[]";
        }
    }

    private static String[] jsonToArray(String json) {
        if (json == null || json.isBlank()) return new String[0];
        try {
            List<String> list = MAPPER.readValue(json, new TypeReference<List<String>>() {});
            return list.toArray(new String[0]);
        } catch (Exception e) {
            return new String[0];
        }
    }
}
