package com.resumeanalyzer.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Computes cosine similarity between two texts using word frequency vectors.
 */
@Component
public class CosineSimilarity {

    private final TextCleaner textCleaner;

    public CosineSimilarity(TextCleaner textCleaner) {
        this.textCleaner = textCleaner;
    }

    /**
     * Build word frequency map from text.
     */
    public Map<String, Integer> wordFrequency(String text) {
        String[] tokens = textCleaner.tokenize(text);
        Map<String, Integer> freq = new HashMap<>();
        for (String token : tokens) {
            freq.merge(token, 1, Integer::sum);
        }
        return freq;
    }

    /**
     * Get all unique words from both maps (vocabulary).
     */
    public Set<String> vocabulary(Map<String, Integer> a, Map<String, Integer> b) {
        return Stream.concat(a.keySet().stream(), b.keySet().stream()).collect(Collectors.toSet());
    }

    /**
     * Cosine similarity in [0, 1]. Returns 0 if either vector is empty.
     */
    public double similarity(String text1, String text2) {
        Map<String, Integer> freq1 = wordFrequency(text1);
        Map<String, Integer> freq2 = wordFrequency(text2);
        if (freq1.isEmpty() || freq2.isEmpty()) {
            return 0.0;
        }

        Set<String> vocab = vocabulary(freq1, freq2);
        double dotProduct = 0;
        double norm1 = 0;
        double norm2 = 0;

        for (String word : vocab) {
            int v1 = freq1.getOrDefault(word, 0);
            int v2 = freq2.getOrDefault(word, 0);
            dotProduct += (double) v1 * v2;
            norm1 += (double) v1 * v1;
            norm2 += (double) v2 * v2;
        }

        if (norm1 == 0 || norm2 == 0) return 0.0;
        double cos = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
        return Math.max(0, Math.min(1, cos));
    }
}
