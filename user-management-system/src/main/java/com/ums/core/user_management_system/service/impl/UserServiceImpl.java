package com.ums.core.user_management_system.service.impl;
import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.entity.User;
import com.ums.core.user_management_system.exception.DuplicateResourceException;
import com.ums.core.user_management_system.mapper.UserMapper;
import com.ums.core.user_management_system.repository.UserRepository;
import com.ums.core.user_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of the UserService interface.
 */
@Service // Marks this as a Spring service component
@RequiredArgsConstructor // Lombok constructor injection
@Slf4j // Lombok logger
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user.
     * Validates uniqueness, hashes password, maps DTO to entity, saves, and maps back to response DTO.
     */
    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        log.info("Attempting to create user with username: {}", userRequestDTO.getUsername());

        if (userRepository.existsByUsernameIgnoreCase(userRequestDTO.getUsername())) {
            log.warn("Username already exists: {}", userRequestDTO.getUsername());
            throw new DuplicateResourceException("Username '" + userRequestDTO.getUsername() + "' already exists.");
        }
        if (userRepository.existsByEmailIgnoreCase(userRequestDTO.getEmail())) {
            log.warn("Email already exists: {}", userRequestDTO.getEmail());
            throw new DuplicateResourceException("Email '" + userRequestDTO.getEmail() + "' already exists.");
        }

        User user = userMapper.toUser(userRequestDTO);

        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        log.debug("Password hashed for username: {}", userRequestDTO.getUsername());


        User savedUser = userRepository.save(user);
        log.info("User saved successfully with ID: {}", savedUser.getId());

        return userMapper.toUserResponseDTO(savedUser);
    }

    /**
     * Retrieves all users.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.info("Found {} users", users.size());
        return userMapper.toUserResponseDTOList(users);

    }
}


