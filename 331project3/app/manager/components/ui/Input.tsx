import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, name, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    id={name}
                    name={name}
                    ref={ref}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                                placeholder-gray-400 focus:outline-none focus:ring-blue-500
                                focus:border-blue-500 sm:text-sm ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';