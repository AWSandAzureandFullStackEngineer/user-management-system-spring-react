import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           size = 'md',
                                           isLoading = false,
                                           leftIcon,
                                           rightIcon,
                                           fullWidth = false,
                                           className = '', // Allow additional custom classes
                                           disabled,
                                           ...props // Pass down any other standard button attributes
                                       }) => {
    const baseStyles =
        'inline-flex items-center justify-center font-semibold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out';

    const variantStyles = {
        primary:
            'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-500',
        secondary:
            'bg-gray-200 hover:bg-gray-300 text-gray-700 border-transparent focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-600',
        danger:
            'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500 disabled:bg-red-300 dark:disabled:bg-red-500',
        outline:
            'bg-transparent hover:bg-indigo-50 text-indigo-700 border-indigo-500 focus:ring-indigo-500 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:border-gray-300 dark:disabled:border-gray-600',
        ghost:
            'bg-transparent hover:bg-indigo-50 text-indigo-700 border-transparent focus:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20 disabled:text-gray-400 dark:disabled:text-gray-500',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    // Loading spinner
    const spinner = (
        <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

    const buttonDisabled = isLoading || disabled;

    return (
        <button
            type="button"
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${buttonDisabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={buttonDisabled}
            {...props}
        >
            {isLoading && <span className="mr-2">{spinner}</span>}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

export default Button;
