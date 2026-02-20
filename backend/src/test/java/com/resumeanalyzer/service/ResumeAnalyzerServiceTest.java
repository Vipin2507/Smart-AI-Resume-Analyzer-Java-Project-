package com.resumeanalyzer.service;

import com.resumeanalyzer.model.User;
import com.resumeanalyzer.repository.AnalysisRepository;
import com.resumeanalyzer.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResumeAnalyzerServiceTest {

    @Mock
    private AnalysisRepository analysisRepository;
    @Mock
    private TextExtractor textExtractor;
    @Mock
    private TextCleaner textCleaner;
    @Mock
    private SkillDataset skillDataset;
    @Mock
    private CosineSimilarity cosineSimilarity;

    private ResumeAnalyzerService service;
    private User user;
    private com.resumeanalyzer.model.Analysis savedAnalysis;

    @BeforeEach
    void setUp() {
        TextCleaner realCleaner = new TextCleaner();
        SkillDataset realSkills = new SkillDataset();
        CosineSimilarity realCosine = new CosineSimilarity(realCleaner);
        service = new ResumeAnalyzerService(
                textExtractor,
                realCleaner,
                realSkills,
                realCosine,
                analysisRepository
        );
        user = User.builder().id(1L).name("Test").email("test@test.com").password("hash").role(User.Role.USER).build();
        savedAnalysis = com.resumeanalyzer.model.Analysis.builder()
                .id(1L)
                .user(user)
                .jobDescription("java spring")
                .resumeText("java spring mysql")
                .matchPercentage(80.0)
                .resumeScore(7.5)
                .build();
    }

    @Test
    void analyzeText_returnsResponseWithMatchAndSuggestions() {
        when(analysisRepository.save(any())).thenAnswer(inv -> {
            com.resumeanalyzer.model.Analysis a = inv.getArgument(0);
            a.setId(1L);
            return a;
        });

        com.resumeanalyzer.dto.AnalysisResponse response = service.analyzeText(
                "I have experience with Java, Spring, and MySQL. Worked on projects.",
                "We need Java, Spring, Docker, and AWS.",
                user
        );

        assertThat(response).isNotNull();
        assertThat(response.getMatchPercentage()).isGreaterThanOrEqualTo(0).isLessThanOrEqualTo(100);
        assertThat(response.getResumeScore()).isGreaterThanOrEqualTo(0).isLessThanOrEqualTo(10);
        assertThat(response.getMatchedSkills()).isNotNull();
        assertThat(response.getMissingSkills()).isNotNull();
        assertThat(response.getSuggestions()).isNotNull().isNotEmpty();
        verify(analysisRepository).save(any());
    }

    @Test
    void getAnalysisById_returnsEmptyWhenNotFound() {
        when(analysisRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());
        Optional<com.resumeanalyzer.dto.AnalysisResponse> result = service.getAnalysisById(99L, 1L);
        assertThat(result).isEmpty();
    }

    @Test
    void getAnalysisById_returnsResponseWhenFound() {
        when(analysisRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(savedAnalysis));
        Optional<com.resumeanalyzer.dto.AnalysisResponse> result = service.getAnalysisById(1L, 1L);
        assertThat(result).isPresent();
        assertThat(result.get().getAnalysisId()).isEqualTo(1L);
        assertThat(result.get().getMatchPercentage()).isEqualTo(80.0);
    }
}
