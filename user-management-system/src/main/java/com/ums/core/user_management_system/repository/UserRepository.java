package com.ums.core.user_management_system.repository;

import com.ums.core.user_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    /**
     * Finds a user by their username (case-insensitive).
     * Uses Spring Data JPA derived query.
     *
     * @param username The username to search for.
     * @return An Optional containing the user if found, otherwise empty.
     */
    Optional<User> findByUsernameIgnoreCase(String username);

    /**
     * Finds a user by their email address (case-insensitive).
     * Uses Spring Data JPA derived query.
     *
     * @param email The email address to search for.
     * @return An Optional containing the user if found, otherwise empty.
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Checks if a user exists with the given username (case-insensitive) using a native SQL query.
     * More efficient than findByUsername if only existence check is needed.
     * Note: Using native queries ties the repository more closely to the specific database (PostgreSQL here).
     *
     * @param username The username to check.
     * @return true if a user exists, false otherwise.
     */
    @Query(value = "SELECT EXISTS (SELECT 1 FROM app_users WHERE LOWER(username) = LOWER(:username))",
            nativeQuery = true) // Indicate this is a native SQL query
    boolean existsByUsernameIgnoreCase(@Param("username") String username); // Use @Param to bind method parameter to query parameter

    /**
     * Checks if a user exists with the given email address (case-insensitive) using a native SQL query.
     * More efficient than findByEmail if only existence check is needed.
     *
     * @param email The email address to check.
     * @return true if a user exists, false otherwise.
     */
    @Query(value = "SELECT EXISTS (SELECT 1 FROM app_users WHERE LOWER(email) = LOWER(:email))",
            nativeQuery = true) // Indicate this is a native SQL query
    boolean existsByEmailIgnoreCase(@Param("email") String email); // Use @Param to bind method paramete
}
