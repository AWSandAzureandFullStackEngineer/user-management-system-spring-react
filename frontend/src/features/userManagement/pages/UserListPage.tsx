import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsersAPI } from '../api/userService';
import { UserResponseDTO } from '../types/UserCreateDTO';
import UserListItem from '../components/UserListItem';

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedUsers = await getAllUsersAPI();
                setUsers(fetchedUsers);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching users.';
                setError(errorMessage);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = (userId: string, username: string) => {
        alert(`TODO: Implement delete for user: ${username} (ID: ${userId})`);
    };

    const layoutStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#111827', // Tailwind's gray-900
        color: 'white',
        padding: '2rem',
    };

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: '2rem',
    };

    if (isLoading) {
        return (
            <div style={layoutStyle}>
                <h1 style={titleStyle}>User List</h1>
                <p style={{ textAlign: 'center' }}>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={layoutStyle}>
                <h1 style={titleStyle}>User List</h1>
                <div style={{
                    backgroundColor: '#FECACA', // Tailwind red-100
                    color: '#7F1D1D', // Tailwind red-700
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                }}>
                    <strong>Error Fetching Users:</strong> {error}
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        This page requires ADMIN privileges. If you are not logged in as an admin,
                        or if there's a network issue, this error will appear. Check the console for more details.
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Link
                        to="/users/create"
                        style={{
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                        }}
                    >
                        + Create New User
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={layoutStyle}>
            <h1 style={titleStyle}>User List</h1>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>All Registered Users</h2>
                <Link
                    to="/users/create"
                    style={{
                        backgroundColor: '#4F46E5',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                    }}
                >
                    + Create New User
                </Link>
            </div>

            {users.length === 0 ? (
                <div style={{
                    backgroundColor: '#1F2937', // dark background
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                }}>
                    <p>No users found.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Try creating some users first!</p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#1F2937',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#374151' }}>
                        <tr>
                            {['Username', 'Email', 'Name', 'Phone', 'Status', 'Actions'].map((header) => (
                                <th key={header} style={{
                                    textAlign: 'left',
                                    padding: '1rem',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    color: '#D1D5DB',
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <UserListItem key={user.id} user={user} onDelete={handleDeleteUser} />
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserListPage;
