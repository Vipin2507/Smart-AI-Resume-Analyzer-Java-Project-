package com.resumeanalyzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.dto.AuthResponse;
import com.resumeanalyzer.dto.LoginRequest;
import com.resumeanalyzer.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AnalysisControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeAll
    void registerAndLogin() throws Exception {
        String registerBody = objectMapper.writeValueAsString(RegisterRequest.builder()
                .name("Test User")
                .email("test-analysis@test.com")
                .password("password123")
                .build());
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated());

        String loginBody = objectMapper.writeValueAsString(LoginRequest.builder()
                .email("test-analysis@test.com")
                .password("password123")
                .build());
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        AuthResponse auth = objectMapper.readValue(response, AuthResponse.class);
        jwtToken = auth.getToken();
    }

    @Test
    @Order(1)
    void analyze_withValidResumeText_returnsAnalysis() throws Exception {
        // Plain text: Tika can parse .txt; for real PDF use a sample PDF file
        String resumeContent = "John Doe. Experience: Java, Spring, MySQL. Projects: Built microservices. Education: BSc CS. Certified AWS.";
        MockMultipartFile resume = new MockMultipartFile(
                "resume",
                "resume.txt",
                "text/plain",
                resumeContent.getBytes()
        );
        String jobDescription = "We need Java, Spring, Docker, AWS, and React.";

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/analyze")
                        .file(resume)
                        .param("jobDescription", jobDescription)
                        .header("Authorization", "Bearer " + this.jwtToken)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.matchPercentage").exists())
                .andExpect(jsonPath("$.resumeScore").exists())
                .andExpect(jsonPath("$.matchedSkills").isArray())
                .andExpect(jsonPath("$.missingSkills").isArray())
                .andExpect(jsonPath("$.suggestions").isArray());
    }

    @Test
    @Order(2)
    void analyze_withoutAuth_returns401() throws Exception {
        MockMultipartFile resume = new MockMultipartFile("resume", "resume.pdf", "application/pdf", "text".getBytes());
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/analyze")
                        .file(resume)
                        .param("jobDescription", "Java developer"))
                .andExpect(status().isUnauthorized());
    }
}
