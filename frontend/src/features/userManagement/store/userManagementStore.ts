import { create } from 'zustand';
import { UserResponseDTO } from '../types/UserCreateDTO';

interface UserManagementState {
    users: UserResponseDTO[];
    selectedUser: UserResponseDTO | null;
    isLoading: boolean;
    error: string | null;
    // Actions
    fetchAllUsers: () => Promise<void>; // Example action
    addUser: (newUser: UserResponseDTO) => void;
    setSelectedUser: (user: UserResponseDTO | null) => void;
    clearError: () => void;
}

export const useUserManagementStore = create<UserManagementState>((set) => ({
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,

    fetchAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            const fetchedUsers: UserResponseDTO[] = []; // Replace with actual API call
            set({ users: fetchedUsers, isLoading: false });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users.';
            set({ error: errorMessage, isLoading: false });
        }
    },

    addUser: (newUser) => {
        set((state) => ({
            users: [...state.users, newUser],
        }));
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },

    clearError: () => {
        set({ error: null });
    },
}));