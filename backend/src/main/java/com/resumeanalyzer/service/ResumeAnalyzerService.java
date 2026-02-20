package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.model.Analysis;
import com.resumeanalyzer.model.User;
import com.resumeanalyzer.repository.AnalysisRepository;
import com.resumeanalyzer.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Core analysis engine: extract text, skills, match %, resume score, suggestions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalyzerService {

    private final TextExtractor textExtractor;
    private final TextCleaner textCleaner;
    private final SkillDataset skillDataset;
    private final CosineSimilarity cosineSimilarity;
    private final AnalysisRepository analysisRepository;

    private static final double SKILL_WEIGHT = 0.6;
    private static final double COSINE_WEIGHT = 0.4;
    private static final int MIN_RESUME_WORDS = 100;

    // Keywords for resume score components
    private static final Set<String> EXPERIENCE_KEYWORDS = Set.of(
            "experience", "worked", "years", "responsible", "led", "managed", "developed", "engineer", "developer"
    );
    private static final Set<String> PROJECT_KEYWORDS = Set.of(
            "project", "projects", "built", "implemented", "designed", "portfolio"
    );
    private static final Set<String> EDUCATION_KEYWORDS = Set.of(
            "education", "degree", "bachelor", "master", "university", "college", "bsc", "msc", "btech", "mtech"
    );
    private static final Set<String> CERTIFICATION_KEYWORDS = Set.of(
            "certification", "certified", "certificate", "aws", "azure", "google", "oracle"
    );

    /**
     * Analyze resume file against job description and persist result.
     */
    @Transactional
    public AnalysisResponse analyze(MultipartFile resume, String jobDescription, User user) throws IOException {
        if (resume == null || resume.isEmpty()) {
            throw new com.resumeanalyzer.exception.InvalidFileException("Resume file is required");
        }

        String contentType = textExtractor.detectContentType(resume.getInputStream());
        String resumeText = textExtractor.extractText(resume.getInputStream(), contentType);
        return analyzeText(resumeText, jobDescription, user);
    }

    /**
     * Analyze raw resume text (e.g. for re-analysis from history).
     */
    @Transactional
    public AnalysisResponse analyzeText(String resumeText, String jobDescription, User user) {
        String cleanedResume = textCleaner.clean(resumeText);
        String cleanedJob = textCleaner.clean(jobDescription);

        Set<String> jobSkills = extractSkills(cleanedJob);
        Set<String> resumeSkills = extractSkills(cleanedResume);
        Set<String> matchedSkills = new HashSet<>(resumeSkills);
        matchedSkills.retainAll(jobSkills);
        Set<String> missingSkills = new HashSet<>(jobSkills);
        missingSkills.removeAll(resumeSkills);

        double skillMatchRaw = jobSkills.isEmpty() ? 1.0 : (double) matchedSkills.size() / jobSkills.size();
        double skillMatchPercent = skillMatchRaw * 100;

        double cosine = cosineSimilarity.similarity(resumeText, jobDescription);
        double cosinePercent = cosine * 100;

        double finalMatchPercent = (SKILL_WEIGHT * skillMatchPercent) + (COSINE_WEIGHT * cosinePercent);
        finalMatchPercent = Math.round(finalMatchPercent * 10) / 10.0;

        double resumeScore = computeResumeScore(resumeText, cleanedResume, matchedSkills, jobSkills);
        resumeScore = Math.round(resumeScore * 10) / 10.0;

        double readabilityScore = computeReadabilityScore(resumeText);
        boolean atsCompatible = isAtsFriendly(resumeText);

        List<String> suggestions = buildSuggestions(
                resumeText, cleanedResume, matchedSkills, missingSkills, jobSkills
        );

        Analysis analysis = Analysis.builder()
                .user(user)
                .jobDescription(jobDescription)
                .resumeText(resumeText)
                .matchPercentage(finalMatchPercent)
                .resumeScore(resumeScore)
                .build();
        analysis = analysisRepository.save(analysis);

        return AnalysisResponse.builder()
                .analysisId(analysis.getId())
                .matchPercentage(finalMatchPercent)
                .resumeScore(resumeScore)
                .matchedSkills(new ArrayList<>(matchedSkills))
                .missingSkills(new ArrayList<>(missingSkills))
                .suggestions(suggestions)
                .readabilityScore(readabilityScore)
                .atsCompatible(atsCompatible)
                .build();
    }

    private Set<String> extractSkills(String cleanedText) {
        String lower = cleanedText.toLowerCase();
        return skillDataset.getKnownSkills().stream()
                .filter(skill -> lower.contains(skill))
                .collect(Collectors.toSet());
    }

    /**
     * Weighted score: skill match 40%, experience 20%, projects 15%, education 15%, certifications 10%.
     * Returns value in [0, 10].
     */
    private double computeResumeScore(String rawResume, String cleanedResume, Set<String> matchedSkills, Set<String> jobSkills) {
        double skillScore = jobSkills.isEmpty() ? 1.0 : (double) matchedSkills.size() / jobSkills.size();
        String lower = rawResume.toLowerCase();

        double experienceScore = EXPERIENCE_KEYWORDS.stream().anyMatch(lower::contains) ? 1.0 : 0.3;
        double projectScore = PROJECT_KEYWORDS.stream().anyMatch(lower::contains) ? 1.0 : 0.2;
        double educationScore = EDUCATION_KEYWORDS.stream().anyMatch(lower::contains) ? 1.0 : 0.2;
        double certScore = CERTIFICATION_KEYWORDS.stream().anyMatch(lower::contains) ? 1.0 : 0.3;

        double total = (0.40 * skillScore) + (0.20 * experienceScore) + (0.15 * projectScore)
                + (0.15 * educationScore) + (0.10 * certScore);
        return total * 10;
    }

    private double computeReadabilityScore(String text) {
        if (text == null || text.isBlank()) return 0;
        String[] sentences = text.split("[.!?]+");
        if (sentences.length == 0) return 0;
        int totalWords = 0;
        for (String s : sentences) {
            totalWords += s.trim().split("\\s+").length;
        }
        double avgWordsPerSentence = (double) totalWords / sentences.length;
        double score = 100;
        if (avgWordsPerSentence > 25) score -= (avgWordsPerSentence - 25);
        if (avgWordsPerSentence < 10) score -= (10 - avgWordsPerSentence) * 2;
        return Math.max(0, Math.min(100, Math.round(score * 10) / 10.0));
    }

    private boolean isAtsFriendly(String text) {
        if (text == null || text.isBlank()) return false;
        String lower = text.toLowerCase();
        boolean hasSections = lower.contains("experience") || lower.contains("education") || lower.contains("skills");
        boolean notTooShort = text.length() >= 200;
        boolean hasBullets = text.contains("•") || text.contains("-") || text.contains("*");
        return hasSections && notTooShort && hasBullets;
    }

    private List<String> buildSuggestions(String rawResume, String cleanedResume,
                                          Set<String> matchedSkills, Set<String> missingSkills,
                                          Set<String> jobSkills) {
        List<String> suggestions = new ArrayList<>();

        if (missingSkills.size() > 3) {
            List<String> topMissing = missingSkills.stream().limit(5).collect(Collectors.toList());
            suggestions.add("Add key technical skills: " + String.join(", ", topMissing));
        }

        String lower = rawResume.toLowerCase();
        if (PROJECT_KEYWORDS.stream().noneMatch(lower::contains)) {
            suggestions.add("Add a Projects section to showcase relevant work.");
        }
        if (!rawResume.matches(".*\\d+%.*|.*\\d+x.*|.*\\$\\d+.*|.*\\d+\\+.*")) {
            suggestions.add("Add quantified achievements (metrics, percentages, impact) to strengthen your experience.");
        }
        int wordCount = cleanedResume.split("\\s+").length;
        if (wordCount < MIN_RESUME_WORDS) {
            suggestions.add("Expand your resume with more detailed experience and responsibilities.");
        }
        if (EXPERIENCE_KEYWORDS.stream().noneMatch(lower::contains)) {
            suggestions.add("Clearly label your work experience section.");
        }

        if (suggestions.isEmpty()) {
            suggestions.add("Your resume looks strong. Consider tailoring keywords for each application.");
        }
        return suggestions;
    }

    public Optional<AnalysisResponse> getAnalysisById(Long id, Long userId) {
        return analysisRepository.findByIdAndUserId(id, userId)
                .map(this::toResponse);
    }

    public List<com.resumeanalyzer.dto.AnalysisHistoryItem> getHistory(Long userId, int page, int size) {
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(userId, org.springframework.data.domain.PageRequest.of(page, size))
                .stream()
                .map(a -> com.resumeanalyzer.dto.AnalysisHistoryItem.builder()
                        .id(a.getId())
                        .matchPercentage(a.getMatchPercentage())
                        .resumeScore(a.getResumeScore())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteAnalysis(Long id, Long userId) {
        Analysis a = analysisRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new com.resumeanalyzer.exception.ResourceNotFoundException("Analysis", id));
        analysisRepository.delete(a);
    }

    private AnalysisResponse toResponse(Analysis a) {
        String cleanedResume = textCleaner.clean(a.getResumeText());
        String cleanedJob = textCleaner.clean(a.getJobDescription());
        Set<String> jobSkills = extractSkills(cleanedJob);
        Set<String> resumeSkills = extractSkills(cleanedResume);
        Set<String> matched = new HashSet<>(resumeSkills);
        matched.retainAll(jobSkills);
        Set<String> missing = new HashSet<>(jobSkills);
        missing.removeAll(resumeSkills);

        List<String> suggestions = buildSuggestions(a.getResumeText(), cleanedResume, matched, missing, jobSkills);
        double readability = computeReadabilityScore(a.getResumeText());
        boolean ats = isAtsFriendly(a.getResumeText());

        return AnalysisResponse.builder()
                .analysisId(a.getId())
                .matchPercentage(a.getMatchPercentage())
                .resumeScore(a.getResumeScore())
                .matchedSkills(new ArrayList<>(matched))
                .missingSkills(new ArrayList<>(missing))
                .suggestions(suggestions)
                .readabilityScore(readability)
                .atsCompatible(ats)
                .build();
    }
}
