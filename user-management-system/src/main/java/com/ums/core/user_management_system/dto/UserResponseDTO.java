package com.ums.core.user_management_system.dto; // Adjust package as needed

import io.swagger.v3.oas.annotations.media.Schema; // For Swagger documentation
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID; // Import UUID

/**
 * Data Transfer Object for representing a user in API responses.
 * Excludes sensitive information like the password hash.
 */
@Data // Lombok: Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok: Generates no-args constructor
@AllArgsConstructor // Lombok: Generates all-args constructor
@Builder // Lombok: Provides the Builder pattern
@Schema(description = "Data Transfer Object for representing a user in API responses")
public class UserResponseDTO {

    @Schema(description = "Unique identifier for the user (UUID)", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id; // User's unique ID (UUID)

    @Schema(description = "Unique username", example = "johndoe")
    private String username; // User's username

    @Schema(description = "Unique email address", example = "john.doe@example.com")
    private String email; // User's email address

    @Schema(description = "User's first name", example = "John")
    private String firstName; // User's first name

    @Schema(description = "User's last name", example = "Doe")
    private String lastName; // User's last name

    // Added phone number field
    @Schema(description = "User's phone number", example = "5551234567", nullable = true)
    private String phoneNumber; // User's phone number (can be null)

    @Schema(description = "Indicates if the user account is active", example = "true")
    private boolean active; // User's active status

    @Schema(description = "Timestamp when the user was created")
    private OffsetDateTime createdAt; // Timestamp of creation

    @Schema(description = "Timestamp when the user was last updated")
    private OffsetDateTime updatedAt; // Timestamp of last update

    // Note: Password hash is intentionally NOT included in response DTOs for security reasons.
}
