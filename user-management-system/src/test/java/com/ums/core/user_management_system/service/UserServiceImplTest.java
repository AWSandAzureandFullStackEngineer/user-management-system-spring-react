package com.ums.core.user_management_system.service;

import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.entity.User;
import com.ums.core.user_management_system.entity.Role;
import com.ums.core.user_management_system.exception.DuplicateResourceException;
import com.ums.core.user_management_system.mapper.UserMapper;
import com.ums.core.user_management_system.repository.UserRepository;
import com.ums.core.user_management_system.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserServiceImpl.
 * Uses Mockito for mocking dependencies.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserServiceImpl Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService; // Test the implementation

    @Captor
    private ArgumentCaptor<User> userArgumentCaptor; // Capture User passed to save

    // Test data variables
    private UserRequestDTO userRequestDTO;
    private User userEntityFromMapper; // Entity returned by mapper before hashing/saving
    private User savedUserEntity;    // Entity returned after saving
    private UserResponseDTO userResponseDTO; // Expected DTO result
    private UUID userId;
    private final String rawPassword = "rawPassword123";
    private final String hashedPassword = "hashedPassword"; // Example hashed password
    private final String testUsername = "testuser";
    private final String testEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        userRequestDTO = UserRequestDTO.builder()
                .username(testUsername)
                .email(testEmail)
                .password(rawPassword)
                .firstName("Test")
                .lastName("User")
                .build();

        // Mock entity returned by mapper (password field is null/ignored at this stage)
        userEntityFromMapper = User.builder()
                .username(testUsername)
                .email(testEmail)
                .firstName("Test")
                .lastName("User")
                // Roles might be set here or later depending on logic/mapper config
                .roles(Set.of(Role.USER))
                .build();

        // Mock entity returned by repository save (has ID, timestamps, HASHED password in 'password' field)
        savedUserEntity = User.builder()
                .id(userId)
                .username(testUsername)
                .email(testEmail)
                .password(hashedPassword) // Hashed password stored in the 'password' field
                .firstName("Test")
                .lastName("User")
                .active(true)
                .roles(Set.of(Role.USER))
                .createdAt(OffsetDateTime.now().minusMinutes(1))
                .updatedAt(OffsetDateTime.now())
                .build();

        // Expected DTO response after creation
        userResponseDTO = UserResponseDTO.builder()
                .id(userId)
                .username(testUsername)
                .email(testEmail)
                .firstName("Test")
                .lastName("User")
                .active(true)
                .createdAt(savedUserEntity.getCreatedAt())
                .updatedAt(savedUserEntity.getUpdatedAt())
                .build();
    }

    // --- Nested class for createUser tests ---
    @Nested
    @DisplayName("createUser Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should create user successfully when username and email are unique")
        void givenValidUserRequest_whenCreateUser_thenReturnsUserResponseDTO() {
            // Arrange (Given)
            given(userRepository.existsByUsernameIgnoreCase(testUsername)).willReturn(false);
            given(userRepository.existsByEmailIgnoreCase(testEmail)).willReturn(false);
            given(userMapper.toUser(userRequestDTO)).willReturn(userEntityFromMapper);
            given(passwordEncoder.encode(rawPassword)).willReturn(hashedPassword);
            // Use argument captor for the save method
            given(userRepository.save(userArgumentCaptor.capture())).willReturn(savedUserEntity);
            given(userMapper.toUserResponseDTO(savedUserEntity)).willReturn(userResponseDTO);

            // Act (When)
            UserResponseDTO result = userService.createUser(userRequestDTO);

            // Assert (Then)
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(userId);
            assertThat(result.getUsername()).isEqualTo(testUsername);

            // Verify the captured user entity that was passed to save()
            User capturedUser = userArgumentCaptor.getValue();
            assertThat(capturedUser).isNotNull();
            // IMPORTANT: Check that the 'password' field contains the HASHED password
            assertThat(capturedUser.getPassword()).isEqualTo(hashedPassword);
            assertThat(capturedUser.getUsername()).isEqualTo(testUsername);
            // Add other relevant assertions for the captured entity if needed

            // Verify mock interactions
            verify(userRepository).existsByUsernameIgnoreCase(testUsername);
            verify(userRepository).existsByEmailIgnoreCase(testEmail);
            verify(userMapper).toUser(userRequestDTO);
            verify(passwordEncoder).encode(rawPassword);
            verify(userRepository).save(any(User.class)); // Verify save was called
            verify(userMapper).toUserResponseDTO(savedUserEntity);
            verifyNoMoreInteractions(userRepository, userMapper, passwordEncoder);
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when username already exists")
        void givenExistingUsername_whenCreateUser_thenThrowsDuplicateResourceException() {
            // Arrange (Given)
            given(userRepository.existsByUsernameIgnoreCase(testUsername)).willReturn(true);

            // Act & Assert (When & Then)
            assertThatThrownBy(() -> userService.createUser(userRequestDTO))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Username '" + testUsername + "' already exists.");

            // Verify interactions
            verify(userRepository).existsByUsernameIgnoreCase(testUsername);
            verify(userRepository, never()).existsByEmailIgnoreCase(anyString());
            verifyNoInteractions(userMapper, passwordEncoder);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when email already exists")
        void givenExistingEmail_whenCreateUser_thenThrowsDuplicateResourceException() {
            // Arrange (Given)
            given(userRepository.existsByUsernameIgnoreCase(testUsername)).willReturn(false);
            given(userRepository.existsByEmailIgnoreCase(testEmail)).willReturn(true);

            // Act & Assert (When & Then)
            assertThatThrownBy(() -> userService.createUser(userRequestDTO))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email '" + testEmail + "' already exists.");

            // Verify interactions
            verify(userRepository).existsByUsernameIgnoreCase(testUsername);
            verify(userRepository).existsByEmailIgnoreCase(testEmail);
            verifyNoInteractions(userMapper, passwordEncoder);
            verify(userRepository, never()).save(any(User.class));
        }
    }

    // --- Nested class for getAllUsers tests ---
    @Nested
    @DisplayName("getAllUsers Tests")
    class GetAllUsersTests {

        @Test
        @DisplayName("Should return list of users when users exist")
        void whenGetAllUsers_andUsersExist_thenReturnsUserResponseDTOList() {
            // Arrange (Given)
            User user1 = User.builder().id(UUID.randomUUID()).username("user1").password("hash1").build();
            User user2 = User.builder().id(UUID.randomUUID()).username("user2").password("hash2").build();
            List<User> userList = List.of(user1, user2);
            UserResponseDTO dto1 = UserResponseDTO.builder().id(user1.getId()).username("user1").build();
            UserResponseDTO dto2 = UserResponseDTO.builder().id(user2.getId()).username("user2").build();
            List<UserResponseDTO> dtoList = List.of(dto1, dto2);

            given(userRepository.findAll()).willReturn(userList);
            given(userMapper.toUserResponseDTOList(userList)).willReturn(dtoList);

            // Act (When)
            List<UserResponseDTO> result = userService.getAllUsers();

            // Assert (Then)
            assertThat(result)
                    .isNotNull()
                    .hasSize(2)
                    .containsExactlyInAnyOrder(dto1, dto2);

            verify(userRepository).findAll();
            verify(userMapper).toUserResponseDTOList(userList);
            verifyNoMoreInteractions(userRepository, userMapper);
            verifyNoInteractions(passwordEncoder);
        }

        @Test
        @DisplayName("Should return empty list when no users exist")
        void whenGetAllUsers_andNoUsersExist_thenReturnsEmptyList() {
            // Arrange (Given)
            given(userRepository.findAll()).willReturn(Collections.emptyList());
            given(userMapper.toUserResponseDTOList(Collections.emptyList())).willReturn(Collections.emptyList());

            // Act (When)
            List<UserResponseDTO> result = userService.getAllUsers();

            // Assert (Then)
            assertThat(result).isNotNull().isEmpty();

            verify(userRepository).findAll();
            verify(userMapper).toUserResponseDTOList(Collections.emptyList());
            verifyNoMoreInteractions(userRepository, userMapper);
            verifyNoInteractions(passwordEncoder);
        }
    }
}
