import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsersAPI } from '../api/userService';
import { UserResponseDTO } from '../types/UserCreateDTO';
import PageLayout from '../../../layouts/PageLayout';
import UserListItem from '../components/UserListItem';

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: Add security for admin-only access with login
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
                setUsers([]); // Clear users on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleDeleteUser = (userId: string, username: string) => {
        // TODO: Implement delete functionality

        alert(`TODO: Implement delete for user: ${username} (ID: ${userId})`);
    };


    if (isLoading) {
        return (
            <PageLayout title="User List">
                <div className="text-center py-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Loading users...</p>
                    {/* You can add a spinner component here */}
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="User List">
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 text-center" role="alert">
                    <span className="font-medium">Error Fetching Users:</span> {error}
                    <p className="mt-2 text-xs">
                        This page requires ADMIN privileges. If you are not logged in as an admin,
                        or if there's a network issue, this error will appear.
                        Check console for more details.
                    </p>
                </div>
                <div className="mb-6 flex justify-end">
                    <Link
                        to="/users/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-150"
                    >
                        + Create New User
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="User List">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">All Registered Users</h2>
                <Link
                    to="/users/create"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-150"
                >
                    + Create New User
                </Link>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-400">No users found.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Try creating some users first!</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <UserListItem key={user.id} user={user} onDelete={handleDeleteUser} />
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    );
};

export default UserListPage;
