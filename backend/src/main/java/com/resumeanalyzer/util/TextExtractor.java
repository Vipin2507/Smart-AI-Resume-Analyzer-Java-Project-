package com.resumeanalyzer.util;

import com.resumeanalyzer.exception.InvalidFileException;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

/**
 * Extracts text from PDF and DOCX using Apache Tika.
 */
@Component
@Slf4j
public class TextExtractor {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
            "text/plain"  // for tests and pasted resume text
    );

    private final Tika tika = new Tika();

    public String extractText(InputStream inputStream, String contentType) {
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new InvalidFileException("Only PDF, DOCX, or plain text files are allowed");
        }

        try {
            String text = tika.parseToString(inputStream);
            if (text == null || text.isBlank()) {
                throw new InvalidFileException("Could not extract text from file. File may be empty or corrupted.");
            }
            return text;
        } catch (IOException | TikaException e) {
            log.warn("Text extraction failed: {}", e.getMessage());
            throw new InvalidFileException("Failed to extract text from file: " + e.getMessage());
        }
    }

    public String detectContentType(InputStream inputStream) throws IOException {
        return tika.detect(inputStream);
    }
}
