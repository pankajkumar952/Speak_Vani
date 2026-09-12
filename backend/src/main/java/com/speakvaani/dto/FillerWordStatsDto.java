package com.speakvaani.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FillerWordStatsDto {
    private int total;
    private double ratePerMinute;
    private Map<String, Integer> words;
    private String feedback;
}
