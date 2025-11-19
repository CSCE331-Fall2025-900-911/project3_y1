import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'danger' | 'secondary';
    isLoading?: boolean;
};

export function Button({ 
    children, 
    className = '', 
    variant = 'primary', 
    isLoading = false,
    disabled,
    ...props 
}: ButtonProps) {
    
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    };

    const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="ml-2">Loading...</span> : children}
        </button>
    );
}