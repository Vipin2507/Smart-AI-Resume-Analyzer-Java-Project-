package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for resume analysis result.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    private Long analysisId;
    private Double matchPercentage;
    private Double resumeScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
    private Double readabilityScore;   // Bonus: readability
    private Boolean atsCompatible;     // Bonus: ATS compatibility hint
}
