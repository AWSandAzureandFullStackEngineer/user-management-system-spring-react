/**
 * Data Transfer Object for sending user creation requests to the backend.
 */
export interface UserCreateDTO {
    username: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

/**
 * Data Transfer Object for sending user update requests to the backend.
 */
export interface UserUpdateDTO {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

/**
 * Data Transfer Object for representing a user in API responses from the backend.
 * This should match the structure of the UserResponseDTO from your Spring Boot backend.
 */
export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
     roles?: string[];
}
