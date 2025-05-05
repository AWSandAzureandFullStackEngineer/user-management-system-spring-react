package com.ums.core.user_management_system.service;

import com.ums.core.user_management_system.entity.User;
import com.ums.core.user_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Custom implementation of UserDetailsService that loads user-specific data
 * from the database using UserRepository.
 */
@Service // Mark this as a Spring service component
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Locates the user based on the username.
     *
     * @param username the username identifying the user whose data is required.
     * @return a fully populated user record (never <code>null</code>)
     * @throws UsernameNotFoundException if the user could not be found.
     */
    @Override
    @Transactional(readOnly = true) // Use read-only transaction for loading user data
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Attempting to load user by username: {}", username);

        // Find the user by username (case-insensitive) from the repository
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> {
                    log.warn("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });

        log.info("User found with username: {}. Loading details.", username);

        // Convert the user's roles (enum) into Spring Security GrantedAuthority objects
        Collection<? extends GrantedAuthority> authorities = mapRolesToAuthorities(user.getRoles());

        // Create and return a Spring Security UserDetails object
        // Uses the HASHED password from the entity's 'password' field
        // Corrected constructor call with all boolean flags
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),       // Hashed password from DB
                user.isActive(),          // enabled flag from DB
                true,                     // accountNonExpired (assuming true for now)
                true,                     // credentialsNonExpired (assuming true for now)
                true,                     // accountNonLocked (assuming true for now) - Added this parameter
                authorities               // authorities (roles)
        );
    }

    /**
     * Helper method to map Role enums to GrantedAuthority objects (prefixed with ROLE_).
     *
     * @param roles The set of Role enums from the User entity.
     * @return A collection of GrantedAuthority objects.
     */
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Set<com.ums.core.user_management_system.entity.Role> roles) {
        // Handle null or empty roles gracefully
        if (roles == null || roles.isEmpty()) {
            return Set.of(); // Return an empty set of authorities
        }
        return roles.stream()
                // Spring Security expects authorities prefixed with ROLE_ for hasRole/hasAuthority checks
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
    }
}
