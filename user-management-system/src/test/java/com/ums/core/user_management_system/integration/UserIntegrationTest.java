package com.ums.core.user_management_system.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.entity.Role;
import com.ums.core.user_management_system.entity.User;
import com.ums.core.user_management_system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full integration tests for User Management endpoints using @SpringBootTest.
 * Loads the complete application context and interacts with a test database (H2).
 */
@SpringBootTest // Load full application context
@AutoConfigureMockMvc // Configure MockMvc for sending HTTP requests
@Transactional // Roll back database changes after each test
@DisplayName("User Integration Tests")
class UserIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // To perform HTTP requests

    @Autowired
    private ObjectMapper objectMapper; // To convert objects to/from JSON

    @Autowired
    private UserRepository userRepository; // To interact directly with the test DB for setup/verification

    @Autowired
    private PasswordEncoder passwordEncoder; // To verify hashed passwords

    private UserRequestDTO newUserRequest;
    private final String adminUsername = "testadmin";
    private String basicAuthAdminHeader;


    @BeforeEach
    void setUp() {
        // Clear repository before each test to ensure isolation
        userRepository.deleteAll();

        // Create request DTO for new user creation tests
        newUserRequest = UserRequestDTO.builder()
                .username("newuser")
                .email("newuser@example.com")
                .password("newPassword123")
                .firstName("New")
                .lastName("User")
                .build();

        // TODO Setup existing admin user for authorization tests


        //  TODO Setup existing regular user for authorization tests

        // Pre-calculate Basic Auth headers
        String adminPassword = "password";
        basicAuthAdminHeader = "Basic " + Base64.getEncoder().encodeToString((adminUsername + ":" + adminPassword).getBytes());
        String regularUsername = "testuser";
        String regularPassword = "password";
        String basicAuthUserHeader = "Basic " + Base64.getEncoder().encodeToString((regularUsername + ":" + regularPassword).getBytes());
    }

    @Test
    @DisplayName("POST /api/v1/users - Should create user successfully and return 201")
    void createUser_whenValidRequest_shouldSucceed() throws Exception {
        // Act: Perform POST request to create user
        MvcResult result = mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUserRequest)))
                // Assert HTTP Response
                .andExpect(status().isCreated()) // Expect 201
                .andExpect(header().exists(HttpHeaders.LOCATION)) // Expect Location header
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(notNullValue()))) // Check ID is present
                .andExpect(jsonPath("$.username", is(newUserRequest.getUsername())))
                .andExpect(jsonPath("$.email", is(newUserRequest.getEmail())))
                .andExpect(jsonPath("$.firstName", is(newUserRequest.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(newUserRequest.getLastName())))
                .andExpect(jsonPath("$.active", is(true))) // Default should be active
                .andReturn();

        UserResponseDTO createdUserResponse = objectMapper.readValue(result.getResponse().getContentAsString(), UserResponseDTO.class);
        Optional<User> savedUserOptional = userRepository.findById(createdUserResponse.getId());

        assertThat(savedUserOptional).isPresent();
        User savedUser = savedUserOptional.get();
        assertThat(savedUser.getUsername()).isEqualTo(newUserRequest.getUsername());
        assertThat(savedUser.getEmail()).isEqualTo(newUserRequest.getEmail());
        assertThat(savedUser.getFirstName()).isEqualTo(newUserRequest.getFirstName());
        assertThat(savedUser.getLastName()).isEqualTo(newUserRequest.getLastName());
        assertThat(savedUser.isActive()).isTrue();
        // Verify the password stored in DB is the HASHED version
        assertThat(passwordEncoder.matches(newUserRequest.getPassword(), savedUser.getPassword())).isTrue();
    }

    @Test
    @DisplayName("POST /api/v1/users - Should return 409 Conflict when username already exists")
    void createUser_whenUsernameExists_shouldReturn409() throws Exception {
        // Arrange: Use username of existing admin user
        newUserRequest.setUsername(adminUsername);

        // Act & Assert
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUserRequest)))
                .andExpect(status().isConflict()); // Expect 409 Conflict
    }

    @Test
    @DisplayName("POST /api/v1/users - Should return 400 Bad Request for invalid input")
    void createUser_whenInvalidInput_shouldReturn400() throws Exception {
        // Arrange: Set an invalid field (e.g., blank username)
        newUserRequest.setUsername("");

        // Act & Assert
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUserRequest)))
                .andExpect(status().isBadRequest()); // Expect 400 Bad Request
    }

    // --- TODO Test GET /api/v1/users Security ---



    @Test
    @DisplayName("GET /api/v1/users - Should return 200 OK for admin user")
    void getAllUsers_whenAdminUser_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .header(HttpHeaders.AUTHORIZATION, basicAuthAdminHeader) // Use Basic Auth for admin user
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Expect 200
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                // Should contain the 2 users created in setup
                .andExpect(jsonPath("$.length()", is(2)));
    }
}
