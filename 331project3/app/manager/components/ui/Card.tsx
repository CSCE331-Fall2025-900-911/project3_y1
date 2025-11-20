import React from 'react';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white shadow-lg rounded-xl border border-gray-200 ${className}`}>
            {children}
        </div>
    );
}