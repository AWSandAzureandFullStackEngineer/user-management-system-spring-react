import React, { InputHTMLAttributes, useId } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string | null;
    helpText?: string;
    labelSrOnly?: boolean;
    containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   name,
                                                   type = 'text',
                                                   error = null,
                                                   helpText,
                                                   labelSrOnly = false,
                                                   containerClassName = '',
                                                   className = '',
                                                   disabled,
                                                   ...props
                                               }) => {
    const uniqueId = useId();

    const baseInputStyles =
        'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';
    const errorInputStyles =
        'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:border-red-400';
    const normalInputStyles =
        'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white';

    return (
        <div className={`mb-4 ${containerClassName}`}>
            <label
                htmlFor={uniqueId}
                className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${
                    labelSrOnly ? 'sr-only' : ''
                }`}
            >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                id={uniqueId}
                name={name}
                disabled={disabled}
                className={`
          ${baseInputStyles}
          ${error ? errorInputStyles : normalInputStyles}
          ${className}
        `}
                aria-describedby={helpText || error ? `${uniqueId}-description` : undefined}
                aria-invalid={!!error}
                {...props}
            />
            {(helpText || error) && (
                <p
                    id={`${uniqueId}-description`}
                    className={`mt-1 text-xs ${
                        error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                    role={error ? 'alert' : undefined}
                    aria-live={error ? 'assertive' : undefined}
                >
                    {error || helpText}
                </p>
            )}
        </div>
    );
};

export default InputField;
