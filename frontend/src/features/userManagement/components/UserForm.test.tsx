import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserForm from './UserForm';
import { UserCreateDTO } from '../types/UserCreateDTO';

describe('UserForm Component', () => {
    const mockOnSubmit = vi.fn();
    let user: UserEvent;

    beforeEach(() => {
        mockOnSubmit.mockClear();
        user = userEvent.setup();
    });

    it('should render all input fields and a submit button for create mode', () => {
        render(<UserForm onSubmit={mockOnSubmit} />);
        expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/password \*/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    });

    it('should render correctly for edit mode', () => {
        const initialData: Partial<UserCreateDTO> = {
            username: 'edituser', email: 'edit@example.com', firstName: 'Edit', lastName: 'Mode', phoneNumber: '1234567890'
        };
        render(
            <UserForm onSubmit={mockOnSubmit} initialData={initialData} isEditMode={true} submitButtonText="Save Changes" />
        );
        expect(screen.getByRole('textbox', { name: /username/i })).toHaveValue('edituser');
        expect(screen.getByRole('textbox', { name: /username/i })).toBeDisabled();
        expect(screen.getByLabelText(/password \(leave blank to keep current\)/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('should update input values as user types', async () => {
        render(<UserForm onSubmit={mockOnSubmit} />); // No initialData for create mode

        const usernameInput = screen.getByRole('textbox', { name: /username/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password \*/i);
        const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

        await user.type(usernameInput, 'testuser');
        expect(usernameInput).toHaveValue('testuser');

        await user.type(emailInput, 'test@example.com');
        expect(emailInput).toHaveValue('test@example.com');

        await user.type(passwordInput, 'password123');
        expect(passwordInput).toHaveValue('password123');

        await user.type(phoneInput, '9876543210');
        expect(phoneInput).toHaveValue('9876543210');
    });

    it('should call onSubmit with form data when submitted in create mode', async () => {
        render(<UserForm onSubmit={mockOnSubmit} />); // No initialData for create mode

        const usernameInput = screen.getByRole('textbox', { name: /username/i });
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password \*/i);
        const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
        const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
        const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

        await user.type(usernameInput, 'johndoe');
        await user.type(emailInput, 'john.doe@example.com');
        await user.type(passwordInput, 'securePassword!');
        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(phoneInput, '1112223333');

        // Submit the form by clicking the button
        const submitButton = screen.getByRole('button', { name: /create user/i });
        await user.click(submitButton);

        // It can also be useful to use fireEvent.submit if click isn't working as expected
        // due to validation or other reasons, but user.click is preferred.
        // const form = usernameInput.closest('form');
        // if (form) fireEvent.submit(form);


        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        const expectedFormData: UserCreateDTO = {
            username: 'johndoe',
            email: 'john.doe@example.com',
            password: 'securePassword!',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '1112223333'
        };
        expect(mockOnSubmit).toHaveBeenCalledWith(expectedFormData);
    });

    it('should call onSubmit without password property if password field is empty in edit mode', async () => {
        const initialData: Partial<UserCreateDTO> = {
            username: 'test',
            email: 'test@test.com',
            // Explicitly provide initial values for optional fields for clarity in this test
            firstName: 'InitialFirst',
            lastName: 'InitialLast',
            phoneNumber: '0000000000'
        };
        render(<UserForm onSubmit={mockOnSubmit} initialData={initialData} isEditMode={true} submitButtonText="Save Changes"/>);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        // Password field is intentionally left empty by the user

        await user.clear(emailInput); // Clear initial email
        await user.type(emailInput, 'updated@example.com');

        const submitButton = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        const submittedData = mockOnSubmit.mock.calls[0][0];

        expect(submittedData.username).toBe('test'); // From initialData, not changed as it's disabled
        expect(submittedData.email).toBe('updated@example.com');
        expect(submittedData.firstName).toBe('InitialFirst');
        expect(submittedData.lastName).toBe('InitialLast');
        expect(submittedData.phoneNumber).toBe('0000000000');
        expect(submittedData.password).toBeUndefined(); // Password property should be undefined
    });


    it('should display loading state when isLoading is true', () => {
        render(<UserForm onSubmit={mockOnSubmit} isLoading={true} />);
        expect(screen.getByRole('button', { name: /creating.../i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
    });

    it('should display "Saving..." when isLoading is true in edit mode', () => {
        render(<UserForm onSubmit={mockOnSubmit} isLoading={true} isEditMode={true} submitButtonText="Save Changes" />);
        expect(screen.getByRole('button', { name: /saving.../i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
    });

    it('should display error message when error is provided', () => {
        const errorMessage = 'Failed to create user.';
        render(<UserForm onSubmit={mockOnSubmit} error={errorMessage} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
});
