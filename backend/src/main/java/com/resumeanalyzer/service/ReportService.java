package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * Generates PDF analysis report from AnalysisResponse using Apache PDFBox.
 */
@Service
@Slf4j
public class ReportService {

    private static final float MARGIN = 50;
    private static final float LEADING = 14;
    private static final float TITLE_SIZE = 18;
    private static final float HEADING_SIZE = 14;
    private static final float BODY_SIZE = 11;

    public byte[] generatePdf(AnalysisResponse response, String userName) throws IOException {
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(doc, page)) {
                float pageHeight = page.getMediaBox().getHeight();
                float y = pageHeight - MARGIN;

                content.beginText();
                content.setFont(PDType1Font.HELVETICA_BOLD, TITLE_SIZE);
                content.newLineAtOffset(MARGIN, y);
                content.showText("Smart AI Resume Analyzer - Report");
                content.endText();
                y -= LEADING * 2;

                content.beginText();
                content.setFont(PDType1Font.HELVETICA, BODY_SIZE);
                content.newLineAtOffset(MARGIN, y);
                content.showText("Prepared for: " + userName);
                content.endText();
                y -= LEADING * 2;

                content.beginText();
                content.setFont(PDType1Font.HELVETICA_BOLD, HEADING_SIZE);
                content.newLineAtOffset(MARGIN, y);
                content.showText("Match Percentage: " + response.getMatchPercentage() + "%");
                content.endText();
                y -= LEADING;

                content.beginText();
                content.setFont(PDType1Font.HELVETICA, BODY_SIZE);
                content.newLineAtOffset(MARGIN, y);
                content.showText("Resume Score (out of 10): " + response.getResumeScore());
                content.endText();
                y -= LEADING;

                if (response.getReadabilityScore() != null) {
                    content.beginText();
                    content.newLineAtOffset(MARGIN, y);
                    content.showText("Readability Score: " + response.getReadabilityScore() + "/100");
                    content.endText();
                    y -= LEADING;
                }
                if (response.getAtsCompatible() != null) {
                    content.beginText();
                    content.newLineAtOffset(MARGIN, y);
                    content.showText("ATS Compatible: " + (response.getAtsCompatible() ? "Yes" : "No"));
                    content.endText();
                    y -= LEADING * 2;
                }

                y = addSection(content, page, y, "Matched Skills", response.getMatchedSkills());
                y = addSection(content, page, y, "Missing Skills", response.getMissingSkills());
                addSection(content, page, y, "Suggestions", response.getSuggestions());
            }

            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private float addSection(PDPageContentStream content, PDPage page, float y, String title, List<String> items) throws IOException {
        if (items == null || items.isEmpty()) return y;

        if (y < MARGIN + 80) {
            return y;
        }

        content.beginText();
        content.setFont(PDType1Font.HELVETICA_BOLD, HEADING_SIZE);
        content.newLineAtOffset(MARGIN, y);
        content.showText(title);
        content.endText();
        y -= LEADING;

        content.setFont(PDType1Font.HELVETICA, BODY_SIZE);
        for (String item : items) {
            if (y < MARGIN + 20) break;
            content.beginText();
            content.newLineAtOffset(MARGIN + 10, y);
            content.showText(sanitize(item));
            content.endText();
            y -= LEADING;
        }
        y -= LEADING;
        return y;
    }

    private static String sanitize(String s) {
        if (s == null) return "";
        return s.replaceAll("[\\x00-\\x1f\\x7f]", " ").trim();
    }
}
