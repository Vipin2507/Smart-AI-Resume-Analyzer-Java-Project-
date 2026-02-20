package com.resumeanalyzer.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CosineSimilarityTest {

    private CosineSimilarity cosineSimilarity;

    @BeforeEach
    void setUp() {
        TextCleaner textCleaner = new TextCleaner();
        cosineSimilarity = new CosineSimilarity(textCleaner);
    }

    @Test
    void similarity_identicalText_returnsOne() {
        String text = "java spring mysql docker";
        double sim = cosineSimilarity.similarity(text, text);
        assertThat(sim).isEqualTo(1.0);
    }

    @Test
    void similarity_differentText_returnsLessThanOne() {
        double sim = cosineSimilarity.similarity("java spring", "python react");
        assertThat(sim).isGreaterThanOrEqualTo(0).isLessThanOrEqualTo(1);
    }

    @Test
    void similarity_emptyText_returnsZero() {
        double sim = cosineSimilarity.similarity("", "java spring");
        assertThat(sim).isEqualTo(0.0);
    }
}
