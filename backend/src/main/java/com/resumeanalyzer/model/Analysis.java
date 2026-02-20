package com.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Analysis entity storing resume vs job description analysis results.
 */
@Entity
@Table(name = "analysis", indexes = @Index(columnList = "user_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "job_description", columnDefinition = "TEXT", nullable = false)
    private String jobDescription;

    @Column(name = "resume_text", columnDefinition = "TEXT", nullable = false)
    private String resumeText;

    @Column(name = "match_percentage", nullable = false)
    private Double matchPercentage;

    @Column(name = "resume_score", nullable = false)
    private Double resumeScore;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
