import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import { UserCreateDTO } from '../types/UserCreateDTO';

const CreateUserPage: React.FC = () => {
    const { createUser, isLoading, error } = useCreateUser();
    const navigate = useNavigate();

    const handleSubmit = async (userData: UserCreateDTO) => {
        const result = await createUser(userData);
        if (result) {
            alert(`User "${result.username}" created successfully!`);
            navigate('/users');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#111827', // Tailwind gray-900
                color: 'white',
                padding: '1rem',
            }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 600,
                    marginBottom: '2rem',
                }}
            >
                Create New User
            </h1>

            <div style={{ width: '100%', maxWidth: '32rem' }}>
                <UserForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    submitButtonText="Create User"
                    isEditMode={false}
                />
            </div>
        </div>
    );
};

export default CreateUserPage;
