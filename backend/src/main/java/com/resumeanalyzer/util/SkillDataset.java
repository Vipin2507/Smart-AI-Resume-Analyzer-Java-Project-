package com.resumeanalyzer.util;

import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Predefined skill dataset for extraction from resume and job description.
 */
@Component
public class SkillDataset {

    public static final Set<String> KNOWN_SKILLS = Stream.of(
            "java", "spring", "spring boot", "mysql", "postgresql", "docker", "kubernetes",
            "aws", "azure", "gcp", "react", "angular", "vue", "node", "nodejs",
            "python", "javascript", "typescript", "rest", "api", "microservices",
            "git", "junit", "mockito", "maven", "gradle", "sql", "nosql",
            "mongodb", "redis", "kafka", "rabbitmq", "jenkins", "ci", "cd",
            "agile", "scrum", "jira", "html", "css", "tailwind", "redux",
            "machine learning", "ml", "ai", "tensorflow", "pytorch", "data structures",
            "algorithms", "oop", "design patterns", "linux", "bash", "terraform",
            "ansible", "graphql", "elasticsearch", "hibernate", "jpa"
    ).map(String::toLowerCase).collect(Collectors.toUnmodifiableSet());

    public Set<String> getKnownSkills() {
        return KNOWN_SKILLS;
    }
}
