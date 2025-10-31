"use client";

import React from 'react';

type ApiResponse = {
  message: string;
  dataBaseTime?: string;
  error?: string;
} | null;

export default function ManagerHomePage() {
  const [apiResponse, setApiResponse] = React.useState<ApiResponse>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDbTest = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch('/api/db-test');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      setApiResponse(data);
    } catch (error) {
      console.error('Failed to fetch from API:', error);
      setApiResponse({
        message: 'Failed to connect to API.',
        error: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <h1>Manager Home Page</h1>
      <p>Welcome to the manager&apos;s dashboard!</p>

      <button onClick={handleDbTest} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Database Connection'}
      </button>

      {apiResponse && (
        <div style={{ marginTop: '20px' }}>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
    
  );
}