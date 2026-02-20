package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for a single analysis history entry (list view).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisHistoryItem {

    private Long id;
    private Double matchPercentage;
    private Double resumeScore;
    private LocalDateTime createdAt;
}
