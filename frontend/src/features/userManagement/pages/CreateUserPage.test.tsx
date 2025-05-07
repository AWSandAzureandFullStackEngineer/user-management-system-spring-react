import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateUserPage from './CreateUserPage';
import { UserCreateDTO, UserResponseDTO } from '../types/UserCreateDTO';

// --- Mocking ---

// 1. Define the mock function for the createUser action that the hook will return
const mockCreateUserFn = vi.fn();

// 2. Mock the useNavigate hook from react-router-dom
const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigateFn,
    };
});

// 3. Mock the UserForm component
vi.mock('../components/UserForm', () => ({
    default: ({ onSubmit, isLoading, error, submitButtonText }: {
        onSubmit: (data: UserCreateDTO) => void;
        isLoading?: boolean;
        error?: string | null;
        submitButtonText?: string;
    }) => (
        <form
            data-testid="user-form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({
                    username: 'mockedFormUser', email: 'mocked@example.com', password: 'mockedPassword123',
                    firstName: 'MockedFirst', lastName: 'MockedLast', phoneNumber: '1234567890'
                });
            }}
        >
            {error && <div role="alert">{error}</div>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : submitButtonText || 'Submit'}
            </button>
        </form>
    ),
}));

// 4. Mock the PageLayout component
vi.mock('../../../layouts/PageLayout', () => ({
    default: ({ children, title }: { children: React.ReactNode, title?: string }) => (
        <div data-testid="page-layout">
            {title && <h1 data-testid="page-title">{title}</h1>}
            {children}
        </div>
    )
}));

// 5. Mock the useCreateUser hook
interface MockUseCreateUserHookReturnValue {
    createUser: typeof mockCreateUserFn;
    isLoading: boolean;
    error: string | null; // Allow string or null for error
    success: boolean;
}

const mockUseCreateUserReturnValue: MockUseCreateUserHookReturnValue = {
    createUser: mockCreateUserFn,
    isLoading: false,
    error: null, // Initial value is null
    success: false,
};
vi.mock('../hooks/useCreateUser', () => ({
    useCreateUser: () => mockUseCreateUserReturnValue,
}));


describe('CreateUserPage Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        // Reset all mocks before each test
        mockCreateUserFn.mockReset();
        mockNavigateFn.mockReset();

        // Reset the state of the useCreateUser mock for each test
        mockUseCreateUserReturnValue.createUser = mockCreateUserFn;
        mockUseCreateUserReturnValue.isLoading = false;
        mockUseCreateUserReturnValue.error = null;
        mockUseCreateUserReturnValue.success = false;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render the PageLayout with title and the UserForm', () => {
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        expect(screen.getByTestId('page-layout')).toBeInTheDocument();
        expect(screen.getByTestId('page-title')).toHaveTextContent('Create New User');
        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    it('should call createUser from the hook when UserForm is submitted', async () => {
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /create user/i });
        await user.click(submitButton);

        expect(mockCreateUserFn).toHaveBeenCalledTimes(1);
        expect(mockCreateUserFn).toHaveBeenCalledWith({
            username: 'mockedFormUser', email: 'mocked@example.com', password: 'mockedPassword123',
            firstName: 'MockedFirst', lastName: 'MockedLast', phoneNumber: '1234567890'
        });
    });

    it('should display loading state from the hook via UserForm', () => {
        mockUseCreateUserReturnValue.isLoading = true; // Set loading state for this test

        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: /processing.../i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /processing.../i })).toBeDisabled();
    });

    it('should display error message from the hook via UserForm', () => {
        const errorMessage = 'Network Error: Failed to connect';
        mockUseCreateUserReturnValue.error = errorMessage; // Set error state for this test

        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });

    it('should navigate to /users and show alert on successful user creation', async () => {
        const createdUserData: UserResponseDTO = {
            id: 'new-user-uuid', username: 'mockedFormUser', email: 'mocked@example.com',
            active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        mockCreateUserFn.mockResolvedValue(createdUserData);

        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(
            <MemoryRouter initialEntries={['/users/create']}>
                <Routes>
                    <Route path="/users/create" element={<CreateUserPage />} />
                    <Route path="/users" element={<div>User List Page (Mocked for test)</div>} />
                </Routes>
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /create user/i });
        await user.click(submitButton);

        await waitFor(() => expect(mockCreateUserFn).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(alertSpy).toHaveBeenCalledWith(`User "${createdUserData.username}" created successfully!`));
        await waitFor(() => expect(mockNavigateFn).toHaveBeenCalledWith('/users'));

        alertSpy.mockRestore();
    });

    it('should not navigate and show error if user creation fails', async () => {
        mockCreateUserFn.mockResolvedValue(null);
        mockUseCreateUserReturnValue.error = 'Backend validation failed'; // Ensure hook reflects error

        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /create user/i });
        await user.click(submitButton);

        await waitFor(() => expect(mockCreateUserFn).toHaveBeenCalledTimes(1));
        expect(screen.getByRole('alert')).toHaveTextContent('Backend validation failed');
        expect(mockNavigateFn).not.toHaveBeenCalled();
    });
});
