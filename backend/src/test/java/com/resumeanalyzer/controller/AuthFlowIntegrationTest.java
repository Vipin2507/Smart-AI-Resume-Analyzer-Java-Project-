package com.resumeanalyzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.dto.AuthResponse;
import com.resumeanalyzer.dto.LoginRequest;
import com.resumeanalyzer.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration test for JWT authentication flow: register → login → access protected endpoint.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_login_then_accessProfile_returns200() throws Exception {
        String email = "authflow@test.com";
        String password = "password123";

        // Register
        String registerBody = objectMapper.writeValueAsString(RegisterRequest.builder()
                .name("Auth Flow User")
                .email(email)
                .password(password)
                .build());
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value(email));

        // Login
        String loginBody = objectMapper.writeValueAsString(LoginRequest.builder()
                .email(email)
                .password(password)
                .build());
        ResultActions loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        String responseBody = loginResult.andReturn().getResponse().getContentAsString();
        AuthResponse auth = objectMapper.readValue(responseBody, AuthResponse.class);
        String token = auth.getToken();

        // Access protected endpoint with JWT
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    void accessProfile_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isUnauthorized());
    }
}
