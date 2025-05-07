import React from 'react';
import { Link } from 'react-router-dom';
import { UserResponseDTO } from '../types/UserCreateDTO';

interface UserListItemProps {
    user: UserResponseDTO;
    onDelete: (userId: string, username: string) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onDelete }) => {
    const handleDelete = () => {
        onDelete(user.id, user.username);
    };

    return (
        <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.username}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {user.firstName || ''} {user.lastName || ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {user.phoneNumber || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
            Active
          </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
            Inactive
          </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                    to={`/users/edit/${user.id}`} // Adjust path as per your routing setup
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3 transition-colors"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    aria-label={`Delete user ${user.username}`}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default UserListItem;
