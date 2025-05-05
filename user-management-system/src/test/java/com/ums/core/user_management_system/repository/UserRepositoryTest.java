package com.ums.core.user_management_system.repository;

import com.ums.core.user_management_system.entity.Role;
import com.ums.core.user_management_system.entity.User;
import jakarta.persistence.PersistenceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Integration tests for the UserRepository using @DataJpaTest.
 * This tests the repository's interaction with the database (H2 in-memory by default).
 */
@DataJpaTest // Configures H2, loads JPA components, enables transactions, rolls back after each test
@DisplayName("UserRepository Integration Tests")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager; // Provides methods for persisting/finding entities in tests

    @Autowired
    private UserRepository userRepository; // The repository under test

    private User user1;
    private User user2;

    @BeforeEach
    void setUpDatabase() {
        // Create and persist test users before each test method
        user1 = User.builder()
                .username("TestUser1")
                .email("test1@example.com")
                .password("hashedPassword1") // Assume hashed
                .firstName("First1")
                .lastName("Last1")
                .active(true)
                .roles(Set.of(Role.USER))
                .build();
        entityManager.persist(user1);

        user2 = User.builder()
                .username("testuser2") // Lowercase username
                .email("TEST2@EXAMPLE.COM") // Uppercase email
                .password("hashedPassword2")
                .firstName("First2")
                .lastName("Last2")
                .active(false)
                .roles(Set.of(Role.ADMIN, Role.USER))
                .build();
        entityManager.persist(user2);

        // Flush changes to the database to ensure data is written before queries run
        entityManager.flush();
    }

    // --- Test findByUsernameIgnoreCase ---
    @Test
    @DisplayName("findByUsernameIgnoreCase should find user with matching username (case-insensitive)")
    void findByUsernameIgnoreCase_whenUserExists_shouldReturnUser() {
        // Act
        Optional<User> foundUserUpper = userRepository.findByUsernameIgnoreCase("TESTUSER1");
        Optional<User> foundUserLower = userRepository.findByUsernameIgnoreCase("testuser1");
        Optional<User> foundUserMixed = userRepository.findByUsernameIgnoreCase("TestUser1");

        // Assert
        assertThat(foundUserUpper).isPresent();
        assertThat(foundUserUpper.get().getId()).isEqualTo(user1.getId());
        assertThat(foundUserUpper.get().getUsername()).isEqualTo("TestUser1"); // Original case is returned

        assertThat(foundUserLower).isPresent();
        assertThat(foundUserLower.get().getId()).isEqualTo(user1.getId());

        assertThat(foundUserMixed).isPresent();
        assertThat(foundUserMixed.get().getId()).isEqualTo(user1.getId());
    }

    @Test
    @DisplayName("findByUsernameIgnoreCase should return empty Optional when username does not exist")
    void findByUsernameIgnoreCase_whenUserDoesNotExist_shouldReturnEmpty() {
        // Act
        Optional<User> foundUser = userRepository.findByUsernameIgnoreCase("nonexistentuser");

        // Assert
        assertThat(foundUser).isNotPresent();
    }

    // --- Test findByEmailIgnoreCase ---
    @Test
    @DisplayName("findByEmailIgnoreCase should find user with matching email (case-insensitive)")
    void findByEmailIgnoreCase_whenUserExists_shouldReturnUser() {
        // Act
        Optional<User> foundUserUpper = userRepository.findByEmailIgnoreCase("TEST2@EXAMPLE.COM");
        Optional<User> foundUserLower = userRepository.findByEmailIgnoreCase("test2@example.com");
        Optional<User> foundUserMixed = userRepository.findByEmailIgnoreCase("Test2@Example.com");

        // Assert
        assertThat(foundUserUpper).isPresent();
        assertThat(foundUserUpper.get().getId()).isEqualTo(user2.getId());
        assertThat(foundUserUpper.get().getEmail()).isEqualTo("TEST2@EXAMPLE.COM"); // Original case is returned

        assertThat(foundUserLower).isPresent();
        assertThat(foundUserLower.get().getId()).isEqualTo(user2.getId());

        assertThat(foundUserMixed).isPresent();
        assertThat(foundUserMixed.get().getId()).isEqualTo(user2.getId());
    }

    @Test
    @DisplayName("findByEmailIgnoreCase should return empty Optional when email does not exist")
    void findByEmailIgnoreCase_whenUserDoesNotExist_shouldReturnEmpty() {
        // Act
        Optional<User> foundUser = userRepository.findByEmailIgnoreCase("nonexistent@example.com");

        // Assert
        assertThat(foundUser).isNotPresent();
    }

    // --- Test existsByUsernameIgnoreCase (Native Query) ---
    @Test
    @DisplayName("existsByUsernameIgnoreCase should return true for existing username (case-insensitive)")
    void existsByUsernameIgnoreCase_whenUserExists_shouldReturnTrue() {
        // Act & Assert
        assertThat(userRepository.existsByUsernameIgnoreCase("TESTUSER1")).isTrue();
        assertThat(userRepository.existsByUsernameIgnoreCase("testuser1")).isTrue();
        assertThat(userRepository.existsByUsernameIgnoreCase("TestUser1")).isTrue();
    }

    @Test
    @DisplayName("existsByUsernameIgnoreCase should return false for non-existent username")
    void existsByUsernameIgnoreCase_whenUserDoesNotExist_shouldReturnFalse() {
        // Act & Assert
        assertThat(userRepository.existsByUsernameIgnoreCase("nonexistentuser")).isFalse();
    }

    // --- Test existsByEmailIgnoreCase (Native Query) ---
    @Test
    @DisplayName("existsByEmailIgnoreCase should return true for existing email (case-insensitive)")
    void existsByEmailIgnoreCase_whenUserExists_shouldReturnTrue() {
        // Act & Assert
        assertThat(userRepository.existsByEmailIgnoreCase("TEST2@EXAMPLE.COM")).isTrue();
        assertThat(userRepository.existsByEmailIgnoreCase("test2@example.com")).isTrue();
        assertThat(userRepository.existsByEmailIgnoreCase("Test2@Example.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmailIgnoreCase should return false for non-existent email")
    void existsByEmailIgnoreCase_whenUserDoesNotExist_shouldReturnFalse() {
        // Act & Assert
        assertThat(userRepository.existsByEmailIgnoreCase("nonexistent@example.com")).isFalse();
    }

    // --- Test Unique Constraints ---
    @Test
    @DisplayName("Saving user with duplicate username should throw PersistenceException")
    void save_whenDuplicateUsername_shouldThrowException() {
        // Arrange
        User duplicateUser = User.builder()
                .username("TestUser1") // Duplicate username
                .email("unique@example.com")
                .password("somehash")
                .build();

        // Act & Assert
        entityManager.persist(duplicateUser);
        // Simplified assertion: Expect standard JPA PersistenceException for constraint violations during flush
        assertThatThrownBy(() -> entityManager.flush())
                .isInstanceOf(PersistenceException.class);
    }

    @Test
    @DisplayName("Saving user with duplicate email should throw PersistenceException")
    void save_whenDuplicateEmail_shouldThrowException() {
        // Arrange
        User duplicateUser = User.builder()
                .username("uniqueUser")
                .email("test1@example.com") // Duplicate email
                .password("somehash")
                .build();

        // Act & Assert
        entityManager.persist(duplicateUser);
        // Simplified assertion: Expect standard JPA PersistenceException for constraint violations during flush
        assertThatThrownBy(() -> entityManager.flush())
                .isInstanceOf(PersistenceException.class);
    }

    // --- Test Roles Loading ---
    @Test
    @DisplayName("Should correctly load user roles")
    void findById_shouldLoadRoles() {
        // Act: Find user1 which has USER role
        Optional<User> foundUser1 = userRepository.findById(user1.getId());
        // Act: Find user2 which has ADMIN and USER roles
        Optional<User> foundUser2 = userRepository.findById(user2.getId());

        // Assert
        assertThat(foundUser1).isPresent();
        assertThat(foundUser1.get().getRoles()).containsExactlyInAnyOrder(Role.USER);

        assertThat(foundUser2).isPresent();
        assertThat(foundUser2.get().getRoles()).containsExactlyInAnyOrder(Role.ADMIN, Role.USER);
    }
}
