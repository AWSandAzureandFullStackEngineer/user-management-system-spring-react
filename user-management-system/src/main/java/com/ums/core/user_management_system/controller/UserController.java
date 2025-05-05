package com.ums.core.user_management_system.controller;

import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/v1/users") // Base path for all endpoints in this controller
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users") // Swagger tag
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Endpoint to create a new user.
     * Takes a UserRequestDTO, validates it, passes it to the service layer,
     * and returns the created user's details along with HTTP 201 status.
     *
     * @param userRequestDTO The user data from the request body.
     * @return ResponseEntity containing the created UserResponseDTO and location header.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create a new user", description = "Registers a new user in the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data provided",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))), // Define an ErrorResponse DTO if desired
            @ApiResponse(responseCode = "409", description = "Username or email already exists",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))) // Conflict
    })
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody UserRequestDTO userRequestDTO) {

        log.info("Received request to create user with username: {}", userRequestDTO.getUsername());

        UserResponseDTO createdUser = userService.createUser(userRequestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();

        log.info("User created successfully with ID: {}", createdUser.getId());

        // Return HTTP 201 Created status, location header, and the response body
        return ResponseEntity.created(location).body(createdUser);
    }

    /**
     * Endpoint to get all users.
     *
     * @return A list of users.
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(type = "array", implementation = UserResponseDTO.class))) // More specific schema
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        log.info("Received request to get all users");
        // Delegate to service
        List<UserResponseDTO> users = userService.getAllUsers();
        log.info("Returning {} users", users.size());
        return ResponseEntity.ok(users); // Return HTTP 200 OK with the list
    }

    // --- Placeholder for ErrorResponse DTO (used in @ApiResponses) ---
    @Schema(description = "Standard error response structure")
    private record ErrorResponse(
            @Schema(description = "HTTP Status Code", example = "400") int status,
            @Schema(description = "Error message detailing the issue", example = "Username cannot be blank") String message,
            @Schema(description = "Timestamp of the error") OffsetDateTime timestamp) {}

}
