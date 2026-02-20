package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.exception.InvalidFileException;
import com.resumeanalyzer.model.User;
import com.resumeanalyzer.service.ReportService;
import com.resumeanalyzer.service.ResumeAnalyzerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Resume analysis and history endpoints.
 */
@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
@Tag(name = "Analysis", description = "Upload resume, analyze, history, report")
@SecurityRequirement(name = "bearerAuth")
public class AnalysisController {

    private final ResumeAnalyzerService analyzerService;
    private final ReportService reportService;
    private final com.resumeanalyzer.service.UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Analyze resume against job description")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam("resume") MultipartFile resume,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description is required");
        }
        User user = userService.findByEmail(userDetails.getUsername());
        AnalysisResponse response = analyzerService.analyze(resume, jobDescription, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    @Operation(summary = "Get analysis history")
    public ResponseEntity<List<com.resumeanalyzer.dto.AnalysisHistoryItem>> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        List<com.resumeanalyzer.dto.AnalysisHistoryItem> items = analyzerService.getHistory(user.getId(), page, size);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get analysis by ID")
    public ResponseEntity<AnalysisResponse> getAnalysis(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        return analyzerService.getAnalysisById(id, user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete analysis")
    public ResponseEntity<Void> deleteAnalysis(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        analyzerService.deleteAnalysis(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{id}/report", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Download analysis report as PDF")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername());
        AnalysisResponse response = analyzerService.getAnalysisById(id, user.getId())
                .orElseThrow(() -> new com.resumeanalyzer.exception.ResourceNotFoundException("Analysis", id));
        try {
            byte[] pdf = reportService.generatePdf(response, user.getName());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentDispositionFormData("attachment", "resume-analysis-report-" + id + ".pdf");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
