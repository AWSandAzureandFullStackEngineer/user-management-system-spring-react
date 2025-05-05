package com.ums.core.user_management_system.mapper;

import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.entity.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget; // For update mapping
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * Mapper interface for converting between User entity and User DTOs.
 * Uses MapStruct for implementation generation.
 * Configured as a Spring component model.
 */
@Mapper(componentModel = "spring", // Integrates with Spring DI
        unmappedTargetPolicy = ReportingPolicy.IGNORE) // Ignore unmapped fields
public interface UserMapper {

    /**
     * Maps UserRequestDTO to User entity.
     * Note: Password hashing should happen in the service layer, not here.
     * The 'password' field from DTO is ignored for direct mapping to 'passwordHash'.
     *
     * @param userRequestDTO The source DTO.
     * @return The mapped User entity.
     */
    @Mapping(target = "id", ignore = true) // Ignore ID during creation mapping
    @Mapping(target = "password", ignore = true) // Ignore passwordHash, handled by service
    @Mapping(target = "active", ignore = true) // Usually set by default or logic
    @Mapping(target = "createdAt", ignore = true) // Handled by entity/database
    @Mapping(target = "updatedAt", ignore = true) // Handled by entity/database
    User toUser(UserRequestDTO userRequestDTO);

    /**
     * Maps User entity to UserResponseDTO.
     *
     * @param user The source User entity.
     * @return The mapped UserResponseDTO.
     */
    UserResponseDTO toUserResponseDTO(User user);

    /**
     * Maps a list of User entities to a list of UserResponseDTOs.
     *
     * @param users The list of source User entities.
     * @return The list of mapped UserResponseDTOs.
     */
    List<UserResponseDTO> toUserResponseDTOList(List<User> users);

    /**
     * Updates an existing User entity from a UserRequestDTO.
     * Useful for PATCH/PUT operations (implement later).
     *
     * @param userRequestDTO The source DTO containing updates.
     * @param user           The target User entity to update.
     */
    @Mapping(target = "id", ignore = true) // Never update the ID
    @Mapping(target = "password", ignore = true) // Password updates require special handling
    @Mapping(target = "createdAt", ignore = true) // Creation timestamp should not change
    @Mapping(target = "updatedAt", ignore = true) // Handled by @PreUpdate
    @Mapping(target = "active", ignore = true) // Active status updates might need specific logic
    void updateUserFromDto(UserRequestDTO userRequestDTO, @MappingTarget User user);
}
