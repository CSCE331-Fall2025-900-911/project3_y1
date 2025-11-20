"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";

export default function LandingPage() {
    // get session data
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100">
                <p>Loading...</p>
            </main>
        );
    }

    if (status === "authenticated") {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
                <div className="absolute top-4 right-4 flex items-center gap-4">
                    <p className="text-gray-700">
                        Welcome, <strong>{session.user?.name}</strong>!
                    </p>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </div>

                <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
                    Boba POS System
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
                        href="/menu"
                        className="w-full max-w-sm p-6 bg-blue-600 text-white text-2xl text-center font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 block"
                    >
                        Menu Board
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
                Boba POS System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Please sign in to continue
            </p>
            <button
                onClick={() => signIn("google")}
                className="flex items-center gap-3 px-6 py-4 bg-white text-gray-700 text-xl font-medium rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
                <Image 
                    src="/images/googlelogo.png" 
                    alt="Google logo" 
                    className="w-6 h-6"
                    width={24}
                    height={24}
                />
                Sign in with Google
            </button>
        </main>
    );
}