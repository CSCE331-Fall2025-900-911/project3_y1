"use client";

import React, { useState } from "react";
import { ApiResponse } from "../../types";

export default function DashboardView() {
    const [apiResponse, setApiResponse] = useState<ApiResponse>(null);
    const [isLoading, setIsLoading] = useState(false);

    const testDbConnection = async () => {
        setApiResponse(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/manager/db-test')
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error: ${response.status}`)
            }

            setApiResponse(data);
        } catch (error) {
            console.error("Failed to fetch from api", error)
            setApiResponse({
                message: 'Failed to connect to API',
                error: (error as Error).message
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Main Dashboard. DB Connection Testing</p>

            <button
                onClick={testDbConnection}
                disabled={isLoading}
                style = {{
                    padding: '.5rem 1rem',
                    fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    backgroundColor: isLoading ? '#ccc' : '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                {isLoading ? 'Loading...' : 'Test DB Connection! :D'}
            </button>

            {apiResponse && (
                <pre style = {{
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '1rem',
                    overflowX: 'auto'
                }}>
                <strong>API Response:</strong>
                {JSON.stringify(apiResponse,null,2)}
                </pre>
            )}
        </div>
    )
}