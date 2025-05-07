import { create } from 'zustand';
import { UserResponseDTO } from '../features/userManagement/types/UserCreateDTO';

interface UserState {
    currentUser: UserResponseDTO | null;
    isAuthenticated: boolean;
    setCurrentUser: (user: UserResponseDTO | null) => void;
    logout: () => void;
}

/**
 * Zustand store for managing global user state (e.g., authentication status, current user details).
 */
export const useUserStore = create<UserState>((set) => ({
    currentUser: null,
    isAuthenticated: false,
    setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: !!user });
    },
    logout: () => {
        set({ currentUser: null, isAuthenticated: false });
    },
}));
