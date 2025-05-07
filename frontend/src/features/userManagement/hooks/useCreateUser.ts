import { useState } from 'react';
import { UserCreateDTO, UserResponseDTO } from '../types/UserCreateDTO';
import { createUserAPI } from '../api/userService';

interface UseCreateUserReturn {
    createUser: (userData: UserCreateDTO) => Promise<UserResponseDTO | null>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export const useCreateUser = (): UseCreateUserReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const createUser = async (userData: UserCreateDTO): Promise<UserResponseDTO | null> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const createdUser = await createUserAPI(userData);
            setSuccess(true);
            setIsLoading(false);
            return createdUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during user creation.';
            setError(errorMessage);
            setIsLoading(false);
            setSuccess(false);
            return null;
        }
    };

    return { createUser, isLoading, error, success };
};
