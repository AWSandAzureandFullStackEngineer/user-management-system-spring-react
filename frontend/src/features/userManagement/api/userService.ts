import { UserCreateDTO, UserResponseDTO } from '../types/UserCreateDTO';
import apiClient from '../../../services/apiClient';

/**
 * Creates a new user by sending a POST request to the backend.
 *
 * @param userData - The user data to create.
 * @returns A promise that resolves to the created user data (UserResponseDTO).
 * @throws Will throw an error if the API request fails.
 */
export const createUserAPI = async (userData: UserCreateDTO): Promise<UserResponseDTO> => {
    try {
        const response = await apiClient.post<UserResponseDTO>('/users', userData);
        return response.data;
    } catch (error: any) {
        // AxiosError will have error.response.data
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during user creation.';
        console.error('Error in createUserAPI:', errorMessage, error.response?.data);
        throw new Error(errorMessage);
    }
};

/**
 * Fetches all users from the backend.
 *
 * @returns A promise that resolves to an array of UserResponseDTO.
 * @throws Will throw an error if the API request fails.
 */
export const getAllUsersAPI = async (): Promise<UserResponseDTO[]> => {
    try {
        const response = await apiClient.get<UserResponseDTO[]>('/users');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred while fetching users.';
        console.error('Error in getAllUsersAPI:', errorMessage, error.response?.data);
        throw new Error(errorMessage);
    }
};

/**
 * Fetches a single user by their ID.
 * (Example - implement as needed)
 * @param userId - The ID of the user to fetch.
 * @returns A promise that resolves to the UserResponseDTO.
 */
export const getUserByIdAPI = async (userId: string): Promise<UserResponseDTO> => {
    try {
        const response = await apiClient.get<UserResponseDTO>(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred while fetching user by ID.';
        console.error('Error in getUserByIdAPI:', errorMessage, error.response?.data);
        throw new Error(errorMessage);
    }
};


