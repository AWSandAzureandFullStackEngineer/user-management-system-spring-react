import React, { useState, FormEvent, useEffect } from 'react';
import { UserCreateDTO } from '../types/UserCreateDTO';

interface UserFormProps {
    onSubmit: (userData: UserCreateDTO) => Promise<void> | void;
    isLoading?: boolean;
    error?: string | null;
    initialData?: Partial<UserCreateDTO>; // Make initialData truly optional
    submitButtonText?: string;
    isEditMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
                                               onSubmit,
                                               isLoading = false,
                                               error = null,
                                               initialData, // Removed default {} here
                                               submitButtonText = 'Create User',
                                               isEditMode = false,
                                           }) => {
    // Initialize state: if initialData is provided, use its values, otherwise use empty strings.
    const [username, setUsername] = useState(initialData?.username || '');
    const [email, setEmail] = useState(initialData?.email || '');
    // For edit mode, password starts blank. For create, it also starts blank.
    // initialData.password is usually not provided for edit forms.
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

        if (!isEditMode || (isEditMode && password)) {
            userData.password = password;
        }

        onSubmit(userData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-lg mx-auto"
            aria-labelledby="user-form-title"
        >
            <h2 id="user-form-title" className="text-xl font-semibold text-gray-900 dark:text-white sr-only">
                {isEditMode ? 'Edit User Form' : 'Create User Form'}
            </h2>

            {error && (
                <div
                    role="alert"
                    className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    aria-live="assertive"
                >
                    <span className="font-medium">Error:</span> {error}
                </div>
            )}

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    maxLength={100}
                    disabled={isLoading || (isEditMode && !!initialData?.username)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                    aria-describedby="username-help"
                    autoComplete="username"
                />
                <p id="username-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be unique, 3-100 characters. {isEditMode && !!initialData?.username && "(Cannot be changed)"}
                </p>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={150}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    autoComplete="email"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password {isEditMode ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditMode}
                    minLength={8}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    aria-describedby="password-help"
                    autoComplete={isEditMode ? "new-password" : "current-password"}
                />
                <p id="password-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum 8 characters.
                </p>
            </div>

            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    autoComplete="given-name"
                />
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={50}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    autoComplete="family-name"
                />
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={20}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    autoComplete="tel"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-500 disabled:cursor-not-allowed transition-colors duration-150"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isEditMode ? 'Saving...' : 'Creating...'}
                        </>
                    ) : (
                        submitButtonText
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
