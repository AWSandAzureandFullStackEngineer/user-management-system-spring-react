package com.ums.core.user_management_system.service;

import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    /**
     * Creates a new user based on the provided request data.
     * Handles validation, password hashing, and persistence.
     *
     * @param userRequestDTO DTO containing the new user's details.
     * @return UserResponseDTO representing the newly created user.
     * @throws com.ums.core.user_management_system.exception.DuplicateResourceException if username or email already exists.
     */
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    /**
     * Retrieves all users.
     *
     * @return A list of UserResponseDTOs representing all users.
     */
    List<UserResponseDTO> getAllUsers();

    /**
     * Retrieves a specific user by their unique ID.
     *
     * @param id The UUID of the user to retrieve.
     * @return An Optional containing the UserResponseDTO if found, otherwise empty.
     */
}
