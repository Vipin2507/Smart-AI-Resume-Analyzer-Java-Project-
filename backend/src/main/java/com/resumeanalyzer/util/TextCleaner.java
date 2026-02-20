package com.resumeanalyzer.util;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Cleans and normalizes text for analysis: lowercase, remove special chars, stopwords.
 */
@Component
public class TextCleaner {

    private static final Set<String> STOPWORDS = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
            "be", "have", "has", "had", "do", "does", "did", "will", "would",
            "could", "should", "may", "might", "must", "shall", "can", "need",
            "this", "that", "these", "those", "i", "you", "he", "she", "it",
            "we", "they", "what", "which", "who", "when", "where", "why", "how"
    );

    /**
     * Lowercase, remove non-alphanumeric (keep spaces), remove stopwords.
     */
    public String clean(String text) {
        if (text == null || text.isBlank()) return "";

        String lower = text.toLowerCase().trim();
        // Keep letters, numbers, spaces; replace other chars with space
        String noSpecial = lower.replaceAll("[^a-z0-9\\s]", " ");
        String singleSpaces = noSpecial.replaceAll("\\s+", " ").trim();

        return Arrays.stream(singleSpaces.split("\\s+"))
                .filter(word -> !word.isEmpty() && !STOPWORDS.contains(word))
                .collect(Collectors.joining(" "));
    }

    /**
     * Returns cleaned text as array of tokens (for word frequency).
     */
    public String[] tokenize(String text) {
        String cleaned = clean(text);
        return cleaned.isEmpty() ? new String[0] : cleaned.split("\\s+");
    }
}
