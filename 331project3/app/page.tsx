import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
                Project 3 Landing Page
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link 
                    href="/manager" 
                    className="w-full max-w-sm p-6 bg-blue-600 text-white text-2xl text-center font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 block"
                >
                    Manager View
                </Link>
                <Link 
                    href="/cashier" 
                    className="w-full max-w-sm p-6 bg-blue-600 text-white text-2xl text-center font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 block"
                >
                    Cashier View
                </Link>
                <Link 
                    href="/customer" 
                    className="w-full max-w-sm p-6 bg-blue-600 text-white text-2xl text-center font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 block"
                >
                    Customer Kiosk
                </Link>
                <Link 
                    href="/menu-board" 
                    className="w-full max-w-sm p-6 bg-blue-600 text-white text-2xl text-center font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 block"
                >
                    Menu Board
                </Link>
            </div>
        </main>
    );
}