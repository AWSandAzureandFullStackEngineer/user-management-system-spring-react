package com.ums.core.user_management_system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when an attempt is made to create a resource
 * that would violate a uniqueness constraint (e.g., duplicate username or email).
 *
 * Annotated with @ResponseStatus(HttpStatus.CONFLICT) so that Spring MVC
 * automatically returns an HTTP 409 Conflict status code when this exception
 * is thrown from a controller or not caught elsewhere.
 */
@ResponseStatus(value = HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    /**
     * Constructor accepting a message detailing the conflict.
     *
     * @param message A descriptive message explaining the duplicate resource issue.
     */
    public DuplicateResourceException(String message) {
        super(message); // Pass the message to the parent RuntimeException
    }

    /**
     * Constructor accepting a message and the underlying cause.
     *
     * @param message The descriptive message.
     * @param cause   The underlying exception that caused this one.
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause); // Pass message and cause to the parent
    }
}
