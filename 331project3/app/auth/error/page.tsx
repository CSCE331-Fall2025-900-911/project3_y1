import React from 'react';
import Link from 'next/link';

export default function AuthErrorPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Access Denied
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                    Your email address is not authorized to access this application D:
                </p>
                <Link 
                    href="/" 
                    className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
                >
                    Back to Sign-In Page
                </Link>
            </div>
        </main>
    );
}