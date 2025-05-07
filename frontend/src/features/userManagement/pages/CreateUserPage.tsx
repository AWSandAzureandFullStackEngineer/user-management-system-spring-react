import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import { UserCreateDTO } from '../types/UserCreateDTO';
import PageLayout from '../../../layouts/PageLayout';
const CreateUserPage: React.FC = () => {
    const { createUser, isLoading, error } = useCreateUser();
    const navigate = useNavigate(); // For redirecting after successful creation

    const handleSubmit = async (userData: UserCreateDTO) => {
        const result = await createUser(userData); // This calls the function from our hook

        if (result) { // The hook's createUser now returns the UserResponseDTO or null
            alert(`User "${result.username}" created successfully!`);

            // Navigate to the user list page (or another appropriate page)
            navigate('/users'); // Ensure this route exists in your App.tsx
        }
    };

    return (
        <PageLayout title="Create New User">
            <div className="max-w-xl mx-auto">
                {/*
          The UserForm component will receive the isLoading and error props
          from the useCreateUser hook and can display them accordingly.
        */}
                <UserForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    submitButtonText="Create User"
                    isEditMode={false}
                />
            </div>
        </PageLayout>
    );
};

export default CreateUserPage;
