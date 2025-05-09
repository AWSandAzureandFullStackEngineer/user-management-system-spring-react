import React, { useState, FormEvent, useEffect } from 'react';
import { UserCreateDTO } from '../types/UserCreateDTO';

interface UserFormProps {
    onSubmit: (userData: UserCreateDTO) => Promise<void> | void;
    isLoading?: boolean;
    error?: string | null;
    initialData?: Partial<UserCreateDTO>;
    submitButtonText?: string;
    isEditMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
                                               onSubmit,
                                               isLoading = false,
                                               error = null,
                                               initialData,
                                               submitButtonText = 'Create User',
                                               isEditMode = false,
                                           }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');

    useEffect(() => {
        if (initialData) {
            setUsername(initialData.username || '');
            setEmail(initialData.email || '');
            setPassword('');
            setFirstName(initialData.firstName || '');
            setLastName(initialData.lastName || '');
            setPhoneNumber(initialData.phoneNumber || '');
        } else if (!isEditMode) {
            setUsername('');
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
        }
    }, [initialData, isEditMode]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoading) return;

        const userData: UserCreateDTO = {
            username,
            email,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phoneNumber: phoneNumber || undefined,
        };

        if (!isEditMode || password) {
            userData.password = password;
        }

        onSubmit(userData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white text-black dark:bg-gray-900 dark:text-white shadow-md rounded-lg max-w-lg mx-auto"
        >
            <h2 className="text-xl font-semibold">{isEditMode ? 'Edit User' : 'Create New User'}</h2>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800 rounded-md">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Username */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={100}
                    disabled={isLoading || (isEditMode && !!initialData?.username)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={150}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password {isEditMode && '(Leave blank to keep current)'}
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditMode}
                    minLength={8}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* First Name */}
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* Last Name */}
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={50}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* Phone Number */}
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={20}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-indigo-300 dark:bg-gray-800"
                />
            </div>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow disabled:opacity-50"
                >
                    {isLoading ? (isEditMode ? 'Saving...' : 'Creating...') : submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
