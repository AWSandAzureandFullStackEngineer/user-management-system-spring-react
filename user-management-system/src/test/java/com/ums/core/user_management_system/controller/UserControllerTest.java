package com.ums.core.user_management_system.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ums.core.user_management_system.config.SecurityConfig;
import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.exception.DuplicateResourceException;
import com.ums.core.user_management_system.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;


// Target UserController and import the SecurityConfig to apply security rules in the test context
@WebMvcTest(UserController.class) // Focus test on UserController
@Import(SecurityConfig.class) // Import the security configuration to apply its rules
@AutoConfigureMockMvc // Configure MockMvc
@DisplayName("UserController Web Layer Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc; // To perform HTTP requests

    @Autowired
    private ObjectMapper objectMapper; // For JSON serialization/deserialization

    @MockBean // Create a Mockito mock for the UserService dependency
    private UserService userService;


    private UserRequestDTO validUserRequest;
    private UserRequestDTO invalidUserRequest_BlankUsername;
    private UserResponseDTO userResponse;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();

        // Valid request setup
        validUserRequest = UserRequestDTO.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .build();

        // Invalid request setup (for validation testing)
        invalidUserRequest_BlankUsername = UserRequestDTO.builder()
                .username("") // Blank username
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .build();

        // Expected response setup
        userResponse = UserResponseDTO.builder()
                .id(testUserId)
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .active(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
    }

    // --- Test POST /api/v1/users (Security: Anonymous Access - Permitted) ---
    @Test
    @DisplayName("POST /api/v1/users - Should allow anonymous access and return 201 on success")
    @WithAnonymousUser // Simulate request from an unauthenticated user
    void givenAnonymousUser_whenCreateUser_thenReturns201() throws Exception {
        // Given: Mock service returns the expected response DTO
        given(userService.createUser(any(UserRequestDTO.class))).willReturn(userResponse);

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUserRequest)))
                .andExpect(status().isCreated()) // Expect 201 Created (permitted)
                .andExpect(header().exists("Location")) // Check Location header
                .andExpect(header().string("Location", "http://localhost/api/v1/users/" + testUserId.toString()))
                .andExpect(jsonPath("$.id", is(testUserId.toString()))); // Check ID in response

        verify(userService).createUser(any(UserRequestDTO.class)); // Verify service was called
    }

    // --- TODO Test GET /api/v1/users (Security: Anonymous Access - Denied) ---


    // --- TODO Test GET /api/v1/users (Security: Authenticated User without ADMIN role - Denied) ---


    // --- Test GET /api/v1/users (Security: Authenticated User with ADMIN role - Allowed) ---
    @Test
    @DisplayName("GET /api/v1/users - Should return 200 OK for admin user")
    @WithMockUser(username = "admin", roles = {"ADMIN"}) // Simulate logged-in user with ADMIN role
    void givenAdminUser_whenGetUsers_thenReturns200() throws Exception {
        // Given: Mock service returns an empty list
        given(userService.getAllUsers()).willReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(get("/api/v1/users")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Expect 200 OK
                .andExpect(jsonPath("$", hasSize(0))); // Check for empty array

        verify(userService).getAllUsers(); // Verify service was called
    }

    // --- Functional Tests (Copied/Adapted from Integration Test) ---

    @Test
    @DisplayName("POST /api/v1/users - Should return 409 Conflict when username already exists")
    @WithAnonymousUser // POST is permitted for anonymous
    void givenDuplicateUsername_whenCreateUser_thenReturns409() throws Exception {
        // Given: Mock service throws DuplicateResourceException
        String errorMessage = "Username 'testuser' already exists.";
        given(userService.createUser(any(UserRequestDTO.class)))
                .willThrow(new DuplicateResourceException(errorMessage));

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUserRequest)))
                .andExpect(status().isConflict()); // Expect 409 Conflict

        verify(userService).createUser(any(UserRequestDTO.class)); // Verify service was called
    }

    @Test
    @DisplayName("POST /api/v1/users - Should return 400 Bad Request for invalid input (blank username)")
    void givenInvalidUserRequest_BlankUsername_whenCreateUser_thenReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUserRequest_BlankUsername)))
                .andExpect(status().isBadRequest()); // Expect 400 Bad Request

        verify(userService, never()).createUser(any()); // Service should NOT be called if validation fails
    }
}
