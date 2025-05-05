package com.ums.core.user_management_system.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * Data Transfer Object for creating or updating a user.
 * This object represents the data expected in the request body.
 */
@Data // Lombok: Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok: Generates no-args constructor
@AllArgsConstructor // Lombok: Generates all-args constructor
@Builder // Lombok: Provides the Builder pattern
@Schema(description = "Data Transfer Object for creating or updating a user")
public class UserRequestDTO {

    @NotBlank(message = "Username cannot be blank") // Validation: Must not be null or empty/whitespace
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters") // Validation: Size constraint
    @Schema(description = "Unique username for the user", example = "johndoe", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @NotBlank(message = "Email cannot be blank") // Validation: Must not be null or empty/whitespace
    @Email(message = "Email should be valid") // Validation: Must be a valid email format
    @Size(max = 150, message = "Email cannot exceed 150 characters") // Validation: Max length
    @Schema(description = "Unique email address for the user", example = "john.doe@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotBlank(message = "Password cannot be blank") // Validation: Must not be null or empty/whitespace
    @Size(min = 8, message = "Password must be at least 8 characters long") // Validation: Minimum length
    @Schema(description = "User's password (will be hashed before storing)", example = "Str0ngP@ssw0rd!", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password; // Raw password received from the client

    @Size(max = 50, message = "First name cannot exceed 50 characters") // Validation: Max length
    @Schema(description = "User's first name", example = "John")
    private String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters") // Validation: Max length
    @Schema(description = "User's last name", example = "Doe")
    private String lastName;
}
