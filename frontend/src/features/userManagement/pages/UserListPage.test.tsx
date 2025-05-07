import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserListPage from './UserListPage';
import { UserResponseDTO } from '../types/UserCreateDTO';

// --- Mocking ---
const mockGetAllUsersAPI = vi.fn();
const mockNavigateFn = vi.fn();

vi.mock('../api/userService', () => ({
    getAllUsersAPI: () => mockGetAllUsersAPI(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigateFn,
        // Keep Link as actual component for href testing
        Link: actual.Link,
    };
});

vi.mock('../../../layouts/PageLayout', () => ({
    default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
        <div data-testid="page-layout">
            {title && <h1 data-testid="page-title">{title}</h1>}
            {children}
        </div>
    ),
}));

vi.mock('../components/UserListItem', () => ({
    default: ({ user }: { user: UserResponseDTO }) => (
        <tr data-testid={`user-item-${user.id}`}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.active ? 'Active' : 'Inactive'}</td>
            <td><button>Edit</button></td>
            <td><button>Delete</button></td>
        </tr>
    ),
}));


describe('UserListPage Component', () => {

    const mockUsers: UserResponseDTO[] = [
        {
            id: '1',
            username: 'userone',
            email: 'one@example.com',
            firstName: 'User',
            lastName: 'One',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            phoneNumber: '111'
        },
        {
            id: '2',
            username: 'usertwo',
            email: 'two@example.com',
            firstName: 'User',
            lastName: 'Two',
            active: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            phoneNumber: '222'
        },
    ];

    beforeEach(() => {
        mockGetAllUsersAPI.mockReset();
        mockNavigateFn.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render PageLayout with title and "Create New User" button after loading', async () => {
        mockGetAllUsersAPI.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <UserListPage />
            </MemoryRouter>
        );

        // Wait for loading to complete and content to render
        await waitFor(() => {
            expect(screen.getByTestId('page-layout')).toBeInTheDocument();
            expect(screen.getByTestId('page-title')).toHaveTextContent('User List');
        });
        // The button should be present after the initial loading/empty state is resolved
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /\+ Create New User/i })).toBeInTheDocument();
        });
    });

    it('should display loading state initially', () => {
        mockGetAllUsersAPI.mockReturnValue(new Promise(() => {}));

        render(
            <MemoryRouter>
                <UserListPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/loading users.../i)).toBeInTheDocument();
    });

    it('should display error message if API call fails', async () => {
        const errorMessage = 'Failed to fetch users due to network error.';
        mockGetAllUsersAPI.mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter>
                <UserListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
        });
        expect(screen.getByText(/this page requires admin privileges/i, { exact: false })).toBeInTheDocument();
    });

    it('should display "No users found." when API returns an empty list', async () => {
        mockGetAllUsersAPI.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <UserListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/no users found./i)).toBeInTheDocument();
        });
    });

    it('should display a list of users when API returns data', async () => {
        mockGetAllUsersAPI.mockResolvedValue(mockUsers);

        render(
            <MemoryRouter>
                <UserListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId(`user-item-${mockUsers[0].id}`)).toBeInTheDocument();
            expect(screen.getByTestId(`user-item-${mockUsers[1].id}`)).toBeInTheDocument();
        });

        expect(screen.getByText(mockUsers[0].username)).toBeInTheDocument();
        expect(screen.getByText(mockUsers[1].email)).toBeInTheDocument();

        expect(screen.getByRole('columnheader', { name: /username/i})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /email/i})).toBeInTheDocument();
        // Be more specific for the "Name" column to avoid ambiguity
        expect(screen.getByRole('columnheader', { name: /^name$/i})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /phone/i})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /status/i})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /actions/i})).toBeInTheDocument();
    });

    it('should have a "Create New User" link pointing to the correct route after loading', async () => {
        mockGetAllUsersAPI.mockResolvedValue([]);
        render(
            <MemoryRouter initialEntries={['/users']}>
                <Routes>
                    <Route path="/users" element={<UserListPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the link to be available after loading
        const createButtonLink = await screen.findByRole('link', { name: /\+ Create New User/i });
        expect(createButtonLink).toHaveAttribute('href', '/users/create');
    });
});
