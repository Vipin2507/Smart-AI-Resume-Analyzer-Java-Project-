package com.resumeanalyzer.repository;

import com.resumeanalyzer.model.Analysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

    List<Analysis> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    java.util.Optional<Analysis> findByIdAndUserId(Long id, Long userId);
}
